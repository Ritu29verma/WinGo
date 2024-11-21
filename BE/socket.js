import { Server } from "socket.io";

let nextGameId = null;
let timer = null;
let timerDuration = 0;
let isTimerActive = false;
let currentGameId = null; // Store the current game ID
let adminSelectedGameData = null; // Store admin-selected data

// Utility Functions
const generateGameId = () => {
  const timestamp = Date.now(); // Current time in milliseconds
  const randomNumber = Math.floor(Math.random() * 1000000); // Random number up to 1 million
  return `${timestamp}${randomNumber}`; // Concatenate timestamp with random number
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

// Function to generate game data (randomly)
const fetchGameData = () => {
  const number = Math.floor(Math.random() * 10); // Random number from 0-9
  const color = getColor(number);
  const bigOrSmall = getBigOrSmall(number);

  return { gameId: currentGameId, number, color, bigOrSmall };
};


const startRepeatingTimer = (io, durationMs) => {
  timerDuration = durationMs / 1000;
  isTimerActive = true;

  if (timer) clearInterval(timer);

  // Generate the first next game ID at the start of the timer
  nextGameId = generateGameId();
  io.emit("gameId", { gameId: nextGameId });
  timer = setInterval(() => {
    if (timerDuration <= 0) {
      // Reset the timer duration for the next cycle
      timerDuration = durationMs / 1000;

      // Generate the new current game ID and the next one
      currentGameId = nextGameId;
      nextGameId = generateGameId(); // Set the next game ID

      io.emit("gameId", { gameId: nextGameId }); // Emit the next game ID to the frontend

      let gameData;
      if (adminSelectedGameData) {
        // Use admin-selected game data
        gameData = {
          gameId: currentGameId,
          ...adminSelectedGameData,
        };
        adminSelectedGameData = null; // Reset admin data after use
      } else {
        // Generate random game data
        gameData = fetchGameData();
      }

      // Emit the finalized game data (current game data)
      io.emit("gameData", gameData);
    }

    timerDuration -= 1;

    const minutes = Math.floor(timerDuration / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timerDuration % 60).toString().padStart(2, "0");

    io.emit("timerUpdate", {
      minutes,
      seconds,
      isTimerActive,
    });
  }, 1000);
};

  

const stopTimer = () => {
  if (timer) clearInterval(timer);
  timer = null;
  isTimerActive = false;
  currentGameId = null;
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

    // Start the repeating timer
    socket.on("startTimer", (durationMs, callback) => {
      startRepeatingTimer(io, durationMs);
      callback({ success: true });
    });

    // Stop the timer
    socket.on("stopTimer", (callback) => {
      stopTimer();
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

export default initializeSocket;
