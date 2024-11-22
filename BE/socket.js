import { Server } from "socket.io";
import mongoose from "mongoose";
import Game from "./models/Game.js"; // Import the Game model

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
  if (number === 0) return ["Red", "Violet"];
  if (number === 5) return ["Green", "Violet"];
  if ([1, 3, 7, 9].includes(number)) return ["Green"];
  if ([2, 4, 6, 8].includes(number)) return ["Red"];
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
        gameData = {
          gameId: currentGameId,
          ...adminSelectedGameData,
        };
        adminSelectedGameData = null;
      } else {
        gameData = fetchGameData();
      }

      // Save game data to MongoDB
      const gameDocument = new Game({
        ...gameData,
        duration: `${durationMs / 1000}s`, // Save duration cycle
      });
      await gameDocument.save();

      io.emit("gameData", gameData);
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
