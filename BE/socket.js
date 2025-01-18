import { Server } from "socket.io";
import mongoose from "mongoose";
import Game from "./models/Game.js";
import GameResult from "./models/GameResult.js"; 
import Game2 from "./models/Game2.js";
import Game3 from "./models/Game3.js";
import Game4 from "./models/Game4.js";
import User from "./models/User.js"
import Wallet from "./models/Wallet.js"
import PurchasedAmount from "./models/PurchaseAmount.js";
export let userSockets = new Map();
export let io;
import dotenv from "dotenv";

dotenv.config();
//for 30 sec
let nextGameId = null;
let timer = null;
let timerDuration = 0;
let isTimerActive = false;
let currentGameId = null;
let adminSelectedGameData = null;
//for 60 sec
let nextGameId2 = null;
let timer2 = null;
let timerDuration2 = 0;
let isTimerActive2 = false;
let currentGameId2 = null;
let adminSelectedGameData2 = null;
//for 180 sec
let nextGameId3 = null;
let timer3 = null;
let timerDuration3 = 0;
let isTimerActive3 = false;
let currentGameId3 = null;
let adminSelectedGameData3 = null;
//for 300 sec
let nextGameId4 = null;
let timer4 = null;
let timerDuration4 = 0;
let isTimerActive4 = false;
let currentGameId4 = null;
let adminSelectedGameData4 = null;

const updatePurchasedAmount = async (amount) => {
  try {
    // Get the current date and set time to 00:00:00.000
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

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


//for 30 sec
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

//for 60 sec
const stats2 = {
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
//for 180 sec
const stats3 = {
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
//for 300 sec
const stats4 = {
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

//for 30 sec
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

//for 60 sec
const getMinimumBetsAndUsers2 = () => {
  // Get minimum bet data
  const minColorBet = Object.entries(stats2.totalAmount.colors).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );
  const minColorUsers = Object.entries(stats2.colors).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );

  const minNumberBet = stats2.totalAmount.numbers.reduce((min, value, index) => 
    value < min.value ? { index, value } : min, 
    { index: null, value: Infinity }
  );
  const minNumberUsers = stats2.numbers.reduce((min, value, index) => 
    value < min.value ? { index, value } : min, 
    { index: null, value: Infinity }
  );

  const minSizeBet = Object.entries(stats2.totalAmount.size).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );
  const minSizeUsers = Object.entries(stats2.size).reduce((min, [key, value]) => 
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
//for 180
const getMinimumBetsAndUsers3 = () => {
  // Get minimum bet data
  const minColorBet = Object.entries(stats3.totalAmount.colors).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );
  const minColorUsers = Object.entries(stats3.colors).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );

  const minNumberBet = stats3.totalAmount.numbers.reduce((min, value, index) => 
    value < min.value ? { index, value } : min, 
    { index: null, value: Infinity }
  );
  const minNumberUsers = stats3.numbers.reduce((min, value, index) => 
    value < min.value ? { index, value } : min, 
    { index: null, value: Infinity }
  );

  const minSizeBet = Object.entries(stats3.totalAmount.size).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );
  const minSizeUsers = Object.entries(stats3.size).reduce((min, [key, value]) => 
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
//for 300
const getMinimumBetsAndUsers4 = () => {
  // Get minimum bet data
  const minColorBet = Object.entries(stats4.totalAmount.colors).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );
  const minColorUsers = Object.entries(stats4.colors).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );

  const minNumberBet = stats4.totalAmount.numbers.reduce((min, value, index) => 
    value < min.value ? { index, value } : min, 
    { index: null, value: Infinity }
  );
  const minNumberUsers = stats4.numbers.reduce((min, value, index) => 
    value < min.value ? { index, value } : min, 
    { index: null, value: Infinity }
  );

  const minSizeBet = Object.entries(stats4.totalAmount.size).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, 
    { key: null, value: Infinity }
  );
  const minSizeUsers = Object.entries(stats4.size).reduce((min, [key, value]) => 
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


//for 30 sec
const setManualGameData = (io, data) => {
  adminSelectedGameData = {
    number: data.number,
    color: getColor(data.number),
    bigOrSmall: getBigOrSmall(data.number),
  };
  io.emit("adminSelectedGameData", adminSelectedGameData);
};

//for 30 sec
const setManualGameDataforSuggestions = (io, data) => {

  if (data.type === 'number') {
    adminSelectedGameData = {
      number: data.value,
      color: getColor(data.value),
      bigOrSmall: getBigOrSmall(data.value),
    };
  } else if (data.type === 'color') {
    // Select the first number corresponding to the suggested color
    const colorNumbers = data.value === 'GREEN' ? [1, 3, 7, 9] :
                         data.value === 'RED' ? [2, 4, 6, 8] :
                         data.value === 'VIOLET' ? [0, 5] : [];
    const selectedNumber = colorNumbers[Math.floor(Math.random() * colorNumbers.length)];
    adminSelectedGameData = {
      number: selectedNumber,
      color: getColor(selectedNumber),
      bigOrSmall: getBigOrSmall(selectedNumber),
    };
  } else if (data.type === 'size') {
    const sizeNumber = data.value === 'Big' ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 5); // Random number based on size
    adminSelectedGameData = {
      number: sizeNumber,
      color: getColor(sizeNumber),
      bigOrSmall: getBigOrSmall(sizeNumber),
    };
  }

  io.emit("adminSelectedGameData", adminSelectedGameData);
};

//for 60 sec
const setManualGameData2 = (io, data) => {
  adminSelectedGameData2 = {
    number: data.number,
    color: getColor(data.number),
    bigOrSmall: getBigOrSmall(data.number),
  };
  io.emit("adminSelectedGameData2", adminSelectedGameData2);
};

//for 60 sec
const setManualGameDataforSuggestions2 = (io, data) => {

  if (data.type === 'number') {
    adminSelectedGameData2 = {
      number: data.value,
      color: getColor(data.value),
      bigOrSmall: getBigOrSmall(data.value),
    };
  } else if (data.type === 'color') {
    // Select the first number corresponding to the suggested color
    const colorNumbers = data.value === 'GREEN' ? [1, 3, 7, 9] :
                         data.value === 'RED' ? [2, 4, 6, 8] :
                         data.value === 'VIOLET' ? [0, 5] : [];
    const selectedNumber = colorNumbers[Math.floor(Math.random() * colorNumbers.length)];
    adminSelectedGameData2 = {
      number: selectedNumber,
      color: getColor(selectedNumber),
      bigOrSmall: getBigOrSmall(selectedNumber),
    };
  } else if (data.type === 'size') {
    const sizeNumber = data.value === 'Big' ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 5); // Random number based on size
    adminSelectedGameData2 = {
      number: sizeNumber,
      color: getColor(sizeNumber),
      bigOrSmall: getBigOrSmall(sizeNumber),
    };
  }

  io.emit("adminSelectedGameData2", adminSelectedGameData2);
};

//for 180 sec
const setManualGameData3 = (io, data) => {
  adminSelectedGameData3 = {
    number: data.number,
    color: getColor(data.number),
    bigOrSmall: getBigOrSmall(data.number),
  };
  io.emit("adminSelectedGameData3", adminSelectedGameData3);
};

// for 180 sec
const setManualGameDataforSuggestions3 = (io, data) => {
  if (data.type === 'number') {
    adminSelectedGameData3 = {
      number: data.value,
      color: getColor(data.value),
      bigOrSmall: getBigOrSmall(data.value),
    };
  } else if (data.type === 'color') {
    // Select the first number corresponding to the suggested color
    const colorNumbers = data.value === 'GREEN' ? [1, 3, 7, 9] :
                         data.value === 'RED' ? [2, 4, 6, 8] :
                         data.value === 'VIOLET' ? [0, 5] : [];
    const selectedNumber = colorNumbers[Math.floor(Math.random() * colorNumbers.length)];
    adminSelectedGameData3 = {
      number: selectedNumber,
      color: getColor(selectedNumber),
      bigOrSmall: getBigOrSmall(selectedNumber),
    };
  } else if (data.type === 'size') {
    const sizeNumber = data.value === 'Big' ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 5); // Random number based on size
    adminSelectedGameData3 = {
      number: sizeNumber,
      color: getColor(sizeNumber),
      bigOrSmall: getBigOrSmall(sizeNumber),
    };
  }

  io.emit("adminSelectedGameData3", adminSelectedGameData3);
};

//for 300 sec
const setManualGameData4 = (io, data) => {
  adminSelectedGameData4 = {
    number: data.number,
    color: getColor(data.number),
    bigOrSmall: getBigOrSmall(data.number),
  };
  io.emit("adminSelectedGameData4", adminSelectedGameData4);
};

// for 300 sec
const setManualGameDataforSuggestions4 = (io, data) => {
  if (data.type === 'number') {
    adminSelectedGameData4 = {
      number: data.value,
      color: getColor(data.value),
      bigOrSmall: getBigOrSmall(data.value),
    };
  } else if (data.type === 'color') {
    // Select the first number corresponding to the suggested color
    const colorNumbers = data.value === 'GREEN' ? [1, 3, 7, 9] :
                         data.value === 'RED' ? [2, 4, 6, 8] :
                         data.value === 'VIOLET' ? [0, 5] : [];
    const selectedNumber = colorNumbers[Math.floor(Math.random() * colorNumbers.length)];
    adminSelectedGameData4 = {
      number: selectedNumber,
      color: getColor(selectedNumber),
      bigOrSmall: getBigOrSmall(selectedNumber),
    };
  } else if (data.type === 'size') {
    const sizeNumber = data.value === 'Big' ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 5); // Random number based on size
    adminSelectedGameData4 = {
      number: sizeNumber,
      color: getColor(sizeNumber),
      bigOrSmall: getBigOrSmall(sizeNumber),
    };
  }

  io.emit("adminSelectedGameData4", adminSelectedGameData4);
};



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

//for 30 sec
const fetchGameData = () => {
  const number = Math.floor(Math.random() * 10);
  const color = getColor(number);
  const bigOrSmall = getBigOrSmall(number);
  return { gameId: currentGameId, number, color, bigOrSmall };
};

//for 60 sec
const fetchGameData2 = () => {
  const number = Math.floor(Math.random() * 10);
  const color = getColor(number);
  const bigOrSmall = getBigOrSmall(number);
  return { gameId: currentGameId2, number, color, bigOrSmall };
};

//for 180 sec
const fetchGameData3 = () => {
  const number = Math.floor(Math.random() * 10);
  const color = getColor(number);
  const bigOrSmall = getBigOrSmall(number);
  return { gameId: currentGameId3, number, color, bigOrSmall };
};

//for 300 sec
const fetchGameData4 = () => {
  const number = Math.floor(Math.random() * 10);
  const color = getColor(number);
  const bigOrSmall = getBigOrSmall(number);
  return { gameId: currentGameId4, number, color, bigOrSmall };
};

//for 30 sec
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
              duration:"30s"
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
    io.emit("gameId", { gameId: nextGameId });
    
    io.emit("suggestions", {
      suggestions: getMinimumBetsAndUsers(),
    });
    io.emit("bettingStats", {
      ...stats,
      uniqueUsersCount: stats.uniqueUsers.size, // Send count of unique users
    });
  }, 1000);
};

//for 60 sec
const startRepeatingTimer2 = (io, durationMs) => {
  timerDuration2 = durationMs / 1000;
  isTimerActive2 = true;

  if (timer2) clearInterval(timer2);

  nextGameId2 = generateGameId();
  io.emit("gameId2", { gameId: nextGameId2 });

  timer2 = setInterval(async () => {
    if (timerDuration2 <= 0) {
      Object.keys(stats2.colors).forEach((key) => (stats2.colors[key] = 0));
      Object.keys(stats2.size).forEach((key) => (stats2.size[key] = 0));
      stats2.numbers.fill(0);
      stats2.totalAmount.numbers.fill(0);
      Object.keys(stats2.totalAmount.colors).forEach((key) => (stats2.totalAmount.colors[key] = 0));
      Object.keys(stats2.totalAmount.size).forEach((key) => (stats2.totalAmount.size[key] = 0));
      await updatePurchasedAmount(stats2.totalGameAmount);
      stats2.totalGameAmount = 0;
      stats2.uniqueUsers.clear();
      timerDuration2 = durationMs / 1000;
    
      currentGameId2 = nextGameId2;
      nextGameId2 = generateGameId();
      io.emit("gameId2", { gameId: nextGameId2 });
    
      let gameData2;
      if (adminSelectedGameData2) {
        gameData2 = { gameId: currentGameId2, ...adminSelectedGameData2 };
        adminSelectedGameData2 = null;
        io.emit("adminSelectedGameData2", adminSelectedGameData2);
      } else {
        gameData2 = fetchGameData2();
      }
    
      const gameDocument = new Game2({
        ...gameData2,
        duration: `${durationMs / 1000}s`,
      });
      await gameDocument.save();
    
      io.emit("gameData2", gameData2);
 
      // Check user bets
      for (const [socketId, socket] of io.sockets.sockets.entries()) {
        const userBets2 = socket.userBets2;
        if (userBets2 && userBets2.length > 0) {
          const betResults2 = [];
          for (const bet2 of userBets2) {
            const { userId, content, purchaseAmount } = bet2;
      
            // Determine win condition
            const isWin =
              content == gameData2.number ||
              gameData2.color.includes(content.toUpperCase()) ||
              content.toLowerCase() === gameData2.bigOrSmall.toLowerCase();
      
            const taxRate = 0.02;
            let winAmount = 0;
      
            // Calculate win amount based on content type
            if (!isNaN(content) && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(content))) {
             
              winAmount = purchaseAmount * 9 ;
            
            } else if (
              content.toLowerCase() === "big" ||
              content.toLowerCase() === "small" ||
              gameData2.color.includes(content.toUpperCase())
            ) {
              // Content is big, small, or a color
              winAmount = purchaseAmount * 2 ;
            }
      
            // If lose, calculate loss amount
            const lossAmount = purchaseAmount * (1 - taxRate);
      
            const result = gameData2.number;
            const winLossDisplay = isWin ? winAmount * (1 - taxRate) : -lossAmount;
      
            // Save game result
            const gameResult = new GameResult({
              userid: userId,
              periodNumber: currentGameId2,
              purchaseAmount,
              amountAfterTax: isWin ? winAmount * (1 - taxRate) :-lossAmount,
              tax: isWin ? winAmount * taxRate : purchaseAmount * taxRate,
              result,
              select: content,
              status: isWin ? "succeed" : "fail",
              winLoss: winLossDisplay,
              duration:"60s"
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

      
            betResults2.push({
              success: isWin,
              amount: winLossDisplay,
              period: currentGameId2,
              result: {
                number: gameData2.number,
                color: gameData2.color,
                size: gameData2.bigOrSmall,
              },
            });
          }
          io.to(socketId).emit("betResults2", betResults2);
          socket.userBets2 = []; // Reset userBets to an empty array
          socket.emit("userBetsUpdate2", socket.userBets2);
        }
      }
      
    }

    timerDuration2 -= 1;
    const minutes = Math.floor(timerDuration2 / 60).toString().padStart(2, "0");
    const seconds = (timerDuration2 % 60).toString().padStart(2, "0");
    io.emit("gameId2", { gameId: nextGameId2 });
    io.emit("timerUpdate2", {
      minutes,
      seconds,
      isTimerActive2,
    });
    
    io.emit("suggestions2", {
      suggestions: getMinimumBetsAndUsers2(),
    });
    io.emit("bettingStats2", {
      ...stats2,
      uniqueUsersCount: stats2.uniqueUsers.size, // Send count of unique users
    });
  }, 1000);
};

//for 180 sec
const startRepeatingTimer3 = (io, durationMs) => {
  timerDuration3 = durationMs / 1000;
  isTimerActive3 = true;

  if (timer3) clearInterval(timer3);

  nextGameId3 = generateGameId();
  io.emit("gameId3", { gameId: nextGameId3 });

  timer3 = setInterval(async () => {
    if (timerDuration3 <= 0) {
      Object.keys(stats3.colors).forEach((key) => (stats3.colors[key] = 0));
      Object.keys(stats3.size).forEach((key) => (stats3.size[key] = 0));
      stats3.numbers.fill(0);
      stats3.totalAmount.numbers.fill(0);
      Object.keys(stats3.totalAmount.colors).forEach((key) => (stats3.totalAmount.colors[key] = 0));
      Object.keys(stats3.totalAmount.size).forEach((key) => (stats3.totalAmount.size[key] = 0));
      await updatePurchasedAmount(stats3.totalGameAmount);
      stats3.totalGameAmount = 0;
      stats3.uniqueUsers.clear();
      timerDuration3 = durationMs / 1000;
    
      currentGameId3 = nextGameId3;
      nextGameId3 = generateGameId();
      io.emit("gameId3", { gameId: nextGameId3 });
    
      let gameData3;
      if (adminSelectedGameData3) {
        gameData3 = { gameId: currentGameId3, ...adminSelectedGameData3 };
        adminSelectedGameData3 = null;
        io.emit("adminSelectedGameData3", adminSelectedGameData3);
      } else {
        gameData3 = fetchGameData3();
      }
    
      const gameDocument = new Game3({
        ...gameData3,
        duration: `${durationMs / 1000}s`,
      });
      await gameDocument.save();
    
      io.emit("gameData3", gameData3);
 
      for (const [socketId, socket] of io.sockets.sockets.entries()) {
        const userBets3 = socket.userBets3;
        if (userBets3 && userBets3.length > 0) {
          const betResults3 = [];
          for (const bet3 of userBets3) {
            const { userId, content, purchaseAmount } = bet3;
      
            const isWin =
              content == gameData3.number ||
              gameData3.color.includes(content.toUpperCase()) ||
              content.toLowerCase() === gameData3.bigOrSmall.toLowerCase();
      
            const taxRate = 0.02;
            let winAmount = 0;
      
            if (!isNaN(content) && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(content))) {
              winAmount = purchaseAmount * 9 ;
            } else if (
              content.toLowerCase() === "big" ||
              content.toLowerCase() === "small" ||
              gameData3.color.includes(content.toUpperCase())
            ) {
              winAmount = purchaseAmount * 2 ;
            }
      
            const lossAmount = purchaseAmount * (1 - taxRate);
            const result = gameData3.number;
            const winLossDisplay = isWin ? winAmount * (1 - taxRate) : -lossAmount;
      
            const gameResult = new GameResult({
              userid: userId,
              periodNumber: currentGameId3,
              purchaseAmount,
              amountAfterTax: isWin ? winAmount * (1 - taxRate) :-lossAmount,
              tax: isWin ? winAmount * taxRate : purchaseAmount * taxRate,
              result,
              select: content,
              status: isWin ? "succeed" : "fail",
              winLoss: winLossDisplay,
              duration:"180s"
            });
            await gameResult.save();
      
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

            betResults3.push({
              success: isWin,
              amount: winLossDisplay,
              period: currentGameId3,
              result: {
                number: gameData3.number,
                color: gameData3.color,
                size: gameData3.bigOrSmall,
              },
            });
          }
          io.to(socketId).emit("betResults3", betResults3);
          socket.userBets3 = [];
          socket.emit("userBetsUpdate3", socket.userBets3);
        }
      }
      
    }

    timerDuration3 -= 1;
    const minutes = Math.floor(timerDuration3 / 60).toString().padStart(2, "0");
    const seconds = (timerDuration3 % 60).toString().padStart(2, "0");
    io.emit("gameId3", { gameId: nextGameId3 });
    io.emit("timerUpdate3", {
      minutes,
      seconds,
      isTimerActive3,
    });
    
    io.emit("suggestions3", {
      suggestions: getMinimumBetsAndUsers3(),
    });
    io.emit("bettingStats3", {
      ...stats3,
      uniqueUsersCount: stats3.uniqueUsers.size,
    });
  }, 1000);
};

//for 300 sec
const startRepeatingTimer4 = (io, durationMs) => {
  timerDuration4 = durationMs / 1000;
  isTimerActive4 = true;

  if (timer4) clearInterval(timer4);

  nextGameId4 = generateGameId();
  io.emit("gameId4", { gameId: nextGameId4 });

  timer4 = setInterval(async () => {
    if (timerDuration4 <= 0) {
      Object.keys(stats4.colors).forEach((key) => (stats4.colors[key] = 0));
      Object.keys(stats4.size).forEach((key) => (stats4.size[key] = 0));
      stats4.numbers.fill(0);
      stats4.totalAmount.numbers.fill(0);
      Object.keys(stats4.totalAmount.colors).forEach((key) => (stats4.totalAmount.colors[key] = 0));
      Object.keys(stats4.totalAmount.size).forEach((key) => (stats4.totalAmount.size[key] = 0));
      await updatePurchasedAmount(stats4.totalGameAmount);
      stats4.totalGameAmount = 0;
      stats4.uniqueUsers.clear();
      timerDuration4 = durationMs / 1000;
    
      currentGameId4 = nextGameId4;
      nextGameId4 = generateGameId();
      io.emit("gameId4", { gameId: nextGameId4 });
    
      let gameData4;
      if (adminSelectedGameData4) {
        gameData4 = { gameId: currentGameId4, ...adminSelectedGameData4 };
        adminSelectedGameData4 = null;
        io.emit("adminSelectedGameData4", adminSelectedGameData4);
      } else {
        gameData4 = fetchGameData4();
      }
    
      const gameDocument = new Game4({
        ...gameData4,
        duration: `${durationMs / 1000}s`,
      });
      await gameDocument.save();
    
      io.emit("gameData4", gameData4);
   
      // Check user bets
      for (const [socketId, socket] of io.sockets.sockets.entries()) {
        const userBets4 = socket.userBets4;
        if (userBets4 && userBets4.length > 0) {
          const betResults4 = [];
          for (const bet4 of userBets4) {
            const { userId, content, purchaseAmount } = bet4;
      
            // Determine win condition
            const isWin =
              content == gameData4.number ||
              gameData4.color.includes(content.toUpperCase()) ||
              content.toLowerCase() === gameData4.bigOrSmall.toLowerCase();
      
            const taxRate = 0.02;
            let winAmount = 0;
      
            // Calculate win amount based on content type
            if (!isNaN(content) && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(content))) {
             
              winAmount = purchaseAmount * 9 ;
            
            } else if (
              content.toLowerCase() === "big" ||
              content.toLowerCase() === "small" ||
              gameData4.color.includes(content.toUpperCase())
            ) {
              // Content is big, small, or a color
              winAmount = purchaseAmount * 2 ;
            }
      
            // If lose, calculate loss amount
            const lossAmount = purchaseAmount * (1 - taxRate);
      
            const result = gameData4.number;
            const winLossDisplay = isWin ? winAmount * (1 - taxRate) : -lossAmount;
      
            // Save game result
            const gameResult = new GameResult({
              userid: userId,
              periodNumber: currentGameId4,
              purchaseAmount,
              amountAfterTax: isWin ? winAmount * (1 - taxRate) :-lossAmount,
              tax: isWin ? winAmount * taxRate : purchaseAmount * taxRate,
              result,
              select: content,
              status: isWin ? "succeed" : "fail",
              winLoss: winLossDisplay,
              duration:"300s"
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

      
            betResults4.push({
              success: isWin,
              amount: winLossDisplay,
              period: currentGameId4,
              result: {
                number: gameData4.number,
                color: gameData4.color,
                size: gameData4.bigOrSmall,
              },
            });
          }
          io.to(socketId).emit("betResults4", betResults4);
          socket.userBets4 = []; // Reset userBets to an empty array
          socket.emit("userBetsUpdate4", socket.userBets4);
        }
      }
      
    }

    timerDuration4 -= 1;
    const minutes = Math.floor(timerDuration4 / 60).toString().padStart(2, "0");
    const seconds = (timerDuration4 % 60).toString().padStart(2, "0");
    io.emit("gameId4", { gameId: nextGameId4 });
    io.emit("timerUpdate4", {
      minutes,
      seconds,
      isTimerActive4,
    });
    
    io.emit("suggestions4", {
      suggestions: getMinimumBetsAndUsers4(),
    });
    io.emit("bettingStats4", {
      ...stats4,
      uniqueUsersCount: stats4.uniqueUsers.size, // Send count of unique users
    });
  }, 1000);
};


export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("registerUser", (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
    });
    //for 30 sec
    socket.on("startTimer", (durationMs, callback) => {
      startRepeatingTimer(io, durationMs);
      callback({ success: true });
    });
    //for 60 sec
    socket.on("startTimer2", (durationMs, callback) => {
      startRepeatingTimer2(io, durationMs);
      callback({ success: true });
    });

    //for 180 sec
    socket.on("startTimer3", (durationMs, callback) => {
      startRepeatingTimer3(io, durationMs);
      callback({ success: true });
    });

    socket.on("startTimer4", (durationMs, callback) => {
      startRepeatingTimer4(io, durationMs);
      callback({ success: true });
    });
    socket.emit("gameId", { gameId: nextGameId });
    socket.emit("gameId2", { gameId: nextGameId2 });
    socket.emit("gameId3", { gameId: nextGameId3 });
    socket.emit("gameId4", { gameId: nextGameId4 });


    
    //for 30 sec
    socket.on("stopTimer", (callback) => {
      if (timer) clearInterval(timer);
      timer = null;
      isTimerActive = false;
      callback({ success: true });
    });
    //for 60 sec
    socket.on("stopTimer2", (callback) => {
      if (timer2) clearInterval(timer2);
      timer2 = null;
      isTimerActive2 = false;
      callback({ success: true });
    });

    //for 180 sec
    socket.on("stopTimer3", (callback) => {
      if (timer3) clearInterval(timer3);
      timer3 = null;
      isTimerActive3 = false;
      callback({ success: true });
    });

    //for 300 sec
    socket.on("stopTimer4", (callback) => {
      if (timer4) clearInterval(timer4);
      timer4 = null;
      isTimerActive4 = false;
      callback({ success: true });
    });

    //for 30 sec
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


    //for 60 sec
    socket.on("userBet2", async (data, callback) => {
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
        if (!socket.userBets2) {
          socket.userBets2 = [];
        }
    
        const newBet = { userId, content, purchaseAmount, timestamp: new Date() };
        socket.userBets2.push(newBet);
        stats2.uniqueUsers.add(userId);
        socket.emit("userBetsUpdate2", socket.userBets2);
        
        socket.emit("walletUpdate", { walletDetails: { totalAmount: wallet.totalAmount, walletNo:wallet.walletNo } });
        if (!isNaN(content)) {
          const number = parseInt(content, 10);
          stats2.numbers[number]++;
          stats2.totalAmount.numbers[number] += purchaseAmount;
        } else if (stats2.colors[content.toUpperCase()] !== undefined) {
          const color = content.toUpperCase();
          stats2.colors[color]++;
          stats2.totalAmount.colors[color] += purchaseAmount;
        } else if (stats2.size[content] !== undefined) {
          const size = content.charAt(0).toUpperCase() + content.slice(1).toLowerCase();
          stats2.size[size]++;
          stats2.totalAmount.size[size] += purchaseAmount;
        }
        stats2.totalGameAmount += purchaseAmount;
        io.emit("bettingStats2", {
          ...stats2,
          uniqueUsersCount: stats2.uniqueUsers.size, // Send count of unique users
        });
        io.emit("suggestions2",{
          suggestions: getMinimumBetsAndUsers2()
        });
        callback({ success: true });
      } catch (error) {
        callback({ success: false, message: error.message });
      }
    });

    //for 180 sec
    socket.on("userBet3", async (data, callback) => {
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
        if (!socket.userBets3) {
          socket.userBets3 = [];
        }
    
        const newBet = { userId, content, purchaseAmount, timestamp: new Date() };
        socket.userBets3.push(newBet);
        stats3.uniqueUsers.add(userId);
        socket.emit("userBetsUpdate3", socket.userBets3);
        
        socket.emit("walletUpdate", { walletDetails: { totalAmount: wallet.totalAmount, walletNo:wallet.walletNo } });
        if (!isNaN(content)) {
          const number = parseInt(content, 10);
          stats3.numbers[number]++;
          stats3.totalAmount.numbers[number] += purchaseAmount;
        } else if (stats3.colors[content.toUpperCase()] !== undefined) {
          const color = content.toUpperCase();
          stats3.colors[color]++;
          stats3.totalAmount.colors[color] += purchaseAmount;
        } else if (stats3.size[content] !== undefined) {
          const size = content.charAt(0).toUpperCase() + content.slice(1).toLowerCase();
          stats3.size[size]++;
          stats3.totalAmount.size[size] += purchaseAmount;
        }
        stats3.totalGameAmount += purchaseAmount;
        io.emit("bettingStats3", {
          ...stats3,
          uniqueUsersCount: stats3.uniqueUsers.size, // Send count of unique users
        });
        io.emit("suggestions3",{
          suggestions: getMinimumBetsAndUsers3()
        });
        callback({ success: true });
      } catch (error) {
        callback({ success: false, message: error.message });
      }
    });
    
    //for 300 sec
    socket.on("userBet4", async (data, callback) => {
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
        if (!socket.userBets4) {
          socket.userBets4 = [];
        }
    
        const newBet = { userId, content, purchaseAmount, timestamp: new Date() };
        socket.userBets4.push(newBet);
        stats4.uniqueUsers.add(userId);
        socket.emit("userBetsUpdate4", socket.userBets4);
        
        socket.emit("walletUpdate", { walletDetails: { totalAmount: wallet.totalAmount, walletNo:wallet.walletNo } });
        if (!isNaN(content)) {
          const number = parseInt(content, 10);
          stats4.numbers[number]++;
          stats4.totalAmount.numbers[number] += purchaseAmount;
        } else if (stats4.colors[content.toUpperCase()] !== undefined) {
          const color = content.toUpperCase();
          stats4.colors[color]++;
          stats4.totalAmount.colors[color] += purchaseAmount;
        } else if (stats4.size[content] !== undefined) {
          const size = content.charAt(0).toUpperCase() + content.slice(1).toLowerCase();
          stats4.size[size]++;
          stats4.totalAmount.size[size] += purchaseAmount;
        }
        stats4.totalGameAmount += purchaseAmount;
        io.emit("bettingStats4", {
          ...stats4,
          uniqueUsersCount: stats4.uniqueUsers.size, // Send count of unique users
        });
        io.emit("suggestions4",{
          suggestions: getMinimumBetsAndUsers4()
        });
        callback({ success: true });
      } catch (error) {
        callback({ success: false, message: error.message });
      }
    });
    
    //for 30 sec
    socket.on("setBetFromSuggestion", (data, callback) => {
      setManualGameDataforSuggestions(io, data);
      callback({ success: true });
    });
    //for 60 sec
    socket.on("setBetFromSuggestion2", (data, callback) => {
      setManualGameDataforSuggestions2(io, data);
      callback({ success: true });
    });

    //for 180 sec
    socket.on("setBetFromSuggestion3", (data, callback) => {
      setManualGameDataforSuggestions3(io, data);
      callback({ success: true });
    });

    //for 300 sec
    socket.on("setBetFromSuggestion4", (data, callback) => {
      setManualGameDataforSuggestions4(io, data);
      callback({ success: true });
    });

  
    //for 30 sec
    socket.on("setManualGameData", (data, callback) => {
      if (data.number >= 0 && data.number <= 9) {
        setManualGameData(io, data);
        callback({ success: true, gameData: adminSelectedGameData });
      } else {
        callback({ success: false, message: "Invalid number." });
      }
    });
    //for 60 sec
    socket.on("setManualGameData2", (data, callback) => {
      if (data.number >= 0 && data.number <= 9) {
        setManualGameData2(io, data);
        callback({ success: true, gameData: adminSelectedGameData2 });
      } else {
        callback({ success: false, message: "Invalid number." });
      }
    });

    //for 180 sec
    socket.on("setManualGameData3", (data, callback) => {
      if (data.number >= 0 && data.number <= 9) {
        setManualGameData3(io, data);
        callback({ success: true, gameData: adminSelectedGameData3 });
      } else {
        callback({ success: false, message: "Invalid number." });
      }
    });

    //for 300 sec
    socket.on("setManualGameData4", (data, callback) => {
      if (data.number >= 0 && data.number <= 9) {
        setManualGameData4(io, data);
        callback({ success: true, gameData: adminSelectedGameData4 });
      } else {
        callback({ success: false, message: "Invalid number." });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          console.log("User disconnected:", userId);
          userSockets.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

