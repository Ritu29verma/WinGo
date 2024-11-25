import { Server } from "socket.io";
import mongoose from "mongoose";
import Game from "./models/Game.js";
import GameResult from "./models/GameResult.js"; 
import User from "./models/User.js"
import Wallet from "./models/Wallet.js"

let nextGameId = null;
let timer = null;
let timerDuration = 0;
let isTimerActive = false;
let currentGameId = null;
let adminSelectedGameData = null;

// Utility Functions
const generateGameId = () => {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000000);
  return `${timestamp}${randomNumber}`;
};

const getColor = (number) => {
  if (number === 0) return ["RED", "VIOLET"];
  if (number === 5) return ["GREEN", "VIOLET"];
  if ([1, 3, 7, 9].includes(number)) return ["GREEN"];
  if ([2, 4, 6, 8].includes(number)) return ["RED"];
  return [];
};

const getBigOrSmall = (number) => {
  return number >= 5 ? "Big" : "Small";
};

const fetchGameData = () => {
  const number = Math.floor(Math.random() * 10);
  const color = getColor(number);
  const bigOrSmall = getBigOrSmall(number);
  return { gameId: currentGameId, number, color, bigOrSmall };
};

const startRepeatingTimer = (io, durationMs) => {
  timerDuration = durationMs / 1000;
  isTimerActive = true;

  if (timer) clearInterval(timer);

  nextGameId = generateGameId();
  io.emit("gameId", { gameId: nextGameId });

  timer = setInterval(async () => {
    if (timerDuration <= 0) {
      timerDuration = durationMs / 1000;
    
      currentGameId = nextGameId;
      nextGameId = generateGameId();
      io.emit("gameId", { gameId: nextGameId });
    
      let gameData;
      if (adminSelectedGameData) {
        gameData = { gameId: currentGameId, ...adminSelectedGameData };
        adminSelectedGameData = null;
      } else {
        gameData = fetchGameData();
      }
    
      const gameDocument = new Game({
        ...gameData,
        duration: `${durationMs / 1000}s`,
      });
      await gameDocument.save();
    
      io.emit("gameData", gameData);
    
      // Check user bets
      for (const [socketId, socket] of io.sockets.sockets.entries()) {
        const userBet = socket.userBet;
        if (userBet) {
          const { userId, content, purchaseAmount } = userBet;
    
          // Match user's bet with game data
          const isWin =
            content == gameData.number ||
            gameData.color.includes(content.toUpperCase()) ||
            content.toLowerCase() === gameData.bigOrSmall.toLowerCase();
    
          const taxRate = 0.02;
          const tax = purchaseAmount * taxRate;
          const amountAfterTax = purchaseAmount - tax;
    
          const result = gameData.number;
          const winLoss = isWin
            ? 2 * purchaseAmount - purchaseAmount * taxRate
            : -amountAfterTax;
    
          // Save the result to the database
          const gameResult = new GameResult({
            userid: userId,
            periodNumber: currentGameId,
            purchaseAmount,
            amountAfterTax,
            tax,
            result,
            select: content,
            status: isWin ? "succeed" : "fail",
            winLoss,
          });
          await gameResult.save();
          
          const wallet = await Wallet.findOne({ userId });
          if (wallet) {
            if (isWin) {
              wallet.totalAmount += winLoss;
            } else {
              wallet.totalAmount -= purchaseAmount;
            }
            wallet.updatedAt = Date.now(); // Update the timestamp
            await wallet.save(); // Save the updated wallet
          }
          // Emit the result to the user
          io.to(socketId).emit("betResult", {
            success: isWin,
            amount: isWin ? winLoss : -amountAfterTax,
            period: currentGameId,
            result: {number:gameData.number,color:gameData.color,size:gameData.bigOrSmall}

          });
    
          // Clear user bet
          delete socket.userBet;
        }
      }
    }

    timerDuration -= 1;
    const minutes = Math.floor(timerDuration / 60).toString().padStart(2, "0");
    const seconds = (timerDuration % 60).toString().padStart(2, "0");

    io.emit("timerUpdate", {
      minutes,
      seconds,
      isTimerActive,
    });
  }, 1000);
};



export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("startTimer", (durationMs, callback) => {
      startRepeatingTimer(io, durationMs);
      callback({ success: true });
    });

    socket.on("stopTimer", (callback) => {
      if (timer) clearInterval(timer);
      timer = null;
      isTimerActive = false;
      callback({ success: true });
    });

    socket.on("userBet", async (data, callback) => {
      const { userId, content, purchaseAmount } = data;
  
      try {
          if (!userId) {
              throw new Error("User ID is missing");
          }
  
          // Example: Fetch user details from the database (optional validation step)
          const user = await User.findById(userId);
          if (!user) {
              throw new Error("User not found");
          }
  
          // Store the bet details in the socket
          socket.userBet = { userId, content, purchaseAmount };
          callback({ success: true });
      } catch (error) {
          callback({ success: false, message: error.message });
      }
  });
  
    

    socket.on("setManualGameData", (data, callback) => {
      const { number } = data;
      const color = getColor(number);
      const bigOrSmall = getBigOrSmall(number);
      adminSelectedGameData = { number, color, bigOrSmall };
      callback({ success: true, gameData: adminSelectedGameData });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};
