import { Server } from "socket.io";
import mongoose from "mongoose";
import Game from "./models/Game.js";
import GameResult from "./models/GameResult.js"; 
import User from "./models/User.js"
import Wallet from "./models/Wallet.js"
import PurchasedAmount from "./models/PurchaseAmount.js";

const updatePurchasedAmount = async (amount) => {
  const currentDate = new Date().setHours(0, 0, 0, 0);

  try {
    // Check if a document exists for the current date
    let purchasedAmountDoc = await PurchasedAmount.findOne({ date: currentDate });

    if (purchasedAmountDoc) {
      // Update the total amount for the existing document
      purchasedAmountDoc.totalAmount += amount;
      await purchasedAmountDoc.save();
    } else {
      // Create a new document for the current date
      purchasedAmountDoc = new PurchasedAmount({
        date: currentDate,
        totalAmount: amount,
      });
      await purchasedAmountDoc.save();
    }
  } catch (error) {
    console.error("Error updating purchased amount:", error);
  }
};
const stats = {
  numbers: Array(10).fill(0),
  colors: { RED: 0, GREEN: 0, VIOLET: 0 },
  size: { Big: 0, Small: 0 },
  totalAmount: {
    numbers: Array(10).fill(0),
    colors: { RED: 0, GREEN: 0, VIOLET: 0 },
    size: { Big: 0, Small: 0 },
  },
  totalGameAmount: 0,
  uniqueUsers: new Set(),
};

const getMinimumBetsAndUsers = () => {
  // Get minimum bet data
  const minColorBet = Object.entries(stats.totalAmount.colors).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );
  const minColorUsers = Object.entries(stats.colors).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );

  const minNumberBet = stats.totalAmount.numbers.reduce((min, value, index) => 
    value < min.value ? { index, value } : min, 
    { index: null, value: Infinity }
  );
  const minNumberUsers = stats.numbers.reduce((min, value, index) => 
    value < min.value ? { index, value } : min, 
    { index: null, value: Infinity }
  );

  const minSizeBet = Object.entries(stats.totalAmount.size).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );
  const minSizeUsers = Object.entries(stats.size).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );

  return {
    minColorBet,
    minColorUsers,
    minNumberBet,
    minNumberUsers,
    minSizeBet,
    minSizeUsers,
  };
};



const setManualGameData = (io, data) => {
  adminSelectedGameData = {
    number: data.number,
    color: getColor(data.number),
    bigOrSmall: getBigOrSmall(data.number),
  };
  io.emit("adminSelectedGameData", adminSelectedGameData);
};

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
      Object.keys(stats.colors).forEach((key) => (stats.colors[key] = 0));
      Object.keys(stats.size).forEach((key) => (stats.size[key] = 0));
      stats.numbers.fill(0);
      stats.totalAmount.numbers.fill(0);
      Object.keys(stats.totalAmount.colors).forEach((key) => (stats.totalAmount.colors[key] = 0));
      Object.keys(stats.totalAmount.size).forEach((key) => (stats.totalAmount.size[key] = 0));
      await updatePurchasedAmount(stats.totalGameAmount);
      stats.totalGameAmount = 0;
      stats.uniqueUsers.clear();
      timerDuration = durationMs / 1000;
    
      currentGameId = nextGameId;
      nextGameId = generateGameId();
      io.emit("gameId", { gameId: nextGameId });
    
      let gameData;
      if (adminSelectedGameData) {
        gameData = { gameId: currentGameId, ...adminSelectedGameData };
        adminSelectedGameData = null;
        io.emit("adminSelectedGameData", adminSelectedGameData);
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
        const userBets = socket.userBets;
        if (userBets && userBets.length > 0) {
          const betResults = [];
          for (const bet of userBets) {
            const { userId, content, purchaseAmount } = bet;
      
            // Determine win condition
            const isWin =
              content == gameData.number ||
              gameData.color.includes(content.toUpperCase()) ||
              content.toLowerCase() === gameData.bigOrSmall.toLowerCase();
      
            const taxRate = 0.02;
            let winAmount = 0;
      
            // Calculate win amount based on content type
            if (!isNaN(content) && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(content))) {
             
              winAmount = purchaseAmount * 9 ;
            
            } else if (
              content.toLowerCase() === "big" ||
              content.toLowerCase() === "small" ||
              gameData.color.includes(content.toUpperCase())
            ) {
              // Content is big, small, or a color
              winAmount = purchaseAmount * 2 ;
            }
      
            // If lose, calculate loss amount
            const lossAmount = purchaseAmount * (1 - taxRate);
      
            const result = gameData.number;
            const winLossDisplay = isWin ? winAmount * (1 - taxRate) : -lossAmount;
      
            // Save game result
            const gameResult = new GameResult({
              userid: userId,
              periodNumber: currentGameId,
              purchaseAmount,
              amountAfterTax: isWin ? winAmount * (1 - taxRate) :-lossAmount,
              tax: isWin ? winAmount * taxRate : purchaseAmount * taxRate,
              result,
              select: content,
              status: isWin ? "succeed" : "fail",
              winLoss: winLossDisplay,
            });
            await gameResult.save();
      
            // Update wallet
            const wallet = await Wallet.findOne({ userId });
            if (wallet) {
              if (isWin) {
                wallet.totalAmount += winAmount;
              }
              wallet.updatedAt = Date.now();
              await wallet.save();
            }

            const user = await User.findById(userId);
            if (user) {
              if (isWin) {
                user.totalWinAmount += winLossDisplay;
              } else {
                user.totalLossAmount -= winLossDisplay;
              }
              user.updatedAt = Date.now();
              await user.save();
            }

      
            betResults.push({
              success: isWin,
              amount: winLossDisplay,
              period: currentGameId,
              result: {
                number: gameData.number,
                color: gameData.color,
                size: gameData.bigOrSmall,
              },
            });
          }
          io.to(socketId).emit("betResults", betResults);
          socket.userBets = []; // Reset userBets to an empty array
          socket.emit("userBetsUpdate", socket.userBets);
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
    
    io.emit("suggestions", {
      suggestions: getMinimumBetsAndUsers(),
    });
    io.emit("bettingStats", {
      ...stats,
      uniqueUsersCount: stats.uniqueUsers.size, // Send count of unique users
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
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
        const wallet = await Wallet.findOne({ userId });
        if (!wallet || wallet.totalAmount < purchaseAmount) {
          throw new Error("Insufficient balance");
        }
        wallet.totalAmount -= purchaseAmount;
        await wallet.save();
        if (!socket.userBets) {
          socket.userBets = [];
        }
    
        const newBet = { userId, content, purchaseAmount, timestamp: new Date() };
        socket.userBets.push(newBet);
        stats.uniqueUsers.add(userId);
        socket.emit("userBetsUpdate", socket.userBets);
        
        socket.emit("walletUpdate", { walletDetails: { totalAmount: wallet.totalAmount, walletNo:wallet.walletNo } });
        if (!isNaN(content)) {
          const number = parseInt(content, 10);
          stats.numbers[number]++;
          stats.totalAmount.numbers[number] += purchaseAmount;
        } else if (stats.colors[content.toUpperCase()] !== undefined) {
          const color = content.toUpperCase();
          stats.colors[color]++;
          stats.totalAmount.colors[color] += purchaseAmount;
        } else if (stats.size[content] !== undefined) {
          const size = content.charAt(0).toUpperCase() + content.slice(1).toLowerCase();
          stats.size[size]++;
          stats.totalAmount.size[size] += purchaseAmount;
        }
        stats.totalGameAmount += purchaseAmount;
        io.emit("bettingStats", {
          ...stats,
          uniqueUsersCount: stats.uniqueUsers.size, // Send count of unique users
        });
        io.emit("suggestions",{
          suggestions: getMinimumBetsAndUsers()
        });
        callback({ success: true });
      } catch (error) {
        callback({ success: false, message: error.message });
      }
    });
  
    

    socket.on("setManualGameData", (data, callback) => {
      if (data.number >= 0 && data.number <= 9) {
        setManualGameData(io, data);
        callback({ success: true, gameData: adminSelectedGameData });
      } else {
        callback({ success: false, message: "Invalid number." });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};
