import Game from "../models/Game.js";
import Game2 from "../models/Game2.js";
import Game3 from "../models/Game3.js";
import Game4 from "../models/Game4.js";
import GameResult from "../models/GameResult.js";

import User from "../models/User.js";

// API to fetch game logs
export const getGameLogs = async (req, res) => {
  try {
    const games = await Game.find()
      .sort({ timestamp: -1 }) // Sort in descending order by timestamp
      .limit(50); // Limit the results to the top 80
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game logs" });
  }
};



export const getGameLogs2 = async (req, res) => {
  try {
    const games = await Game2.find()
      .sort({ timestamp: -1 }) // Sort in descending order by timestamp
      .limit(50); // Limit the results to the top 80
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game logs" });
  }
};

export const getGameLogs3 = async (req, res) => {
  try {
    const games = await Game3.find()
      .sort({ timestamp: -1 }) // Sort in descending order by timestamp
      .limit(50); // Limit the results to the top 80
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game logs" });
  }
};

export const getGameLogs4 = async (req, res) => {
  try {
    const games = await Game4.find()
      .sort({ timestamp: -1 }) // Sort in descending order by timestamp
      .limit(50); // Limit the results to the top 80
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game logs" });
  }
};



export const UserGameResults = async (req, res) => {
  try {
    const gameResults = await GameResult.find({ 
      userid: req.user._id, 
      duration: "30s" // Filter for duration 30s
    }).sort({ time: -1 }); // Sort by most recent
    
    res.json(gameResults);
  } catch (error) {
    console.error("Error fetching game results:", error);
    res.status(500).json({ error: "Failed to fetch game results" });
  }
};

export const UserGameResults2 = async (req, res) => {
  try {
    const gameResults = await GameResult.find({ 
      userid: req.user._id, 
      duration: "60s" // Filter for duration 30s
    }).sort({ time: -1 }); // Sort by most recent
    
    res.json(gameResults);
  } catch (error) {
    console.error("Error fetching game results:", error);
    res.status(500).json({ error: "Failed to fetch game results" });
  }
};

export const UserGameResults3 = async (req, res) => {
  try {
    const gameResults = await GameResult.find({ 
      userid: req.user._id, 
      duration: "180s" // Filter for duration 30s
    }).sort({ time: -1 }); // Sort by most recent
    
    res.json(gameResults);
  } catch (error) {
    console.error("Error fetching game results:", error);
    res.status(500).json({ error: "Failed to fetch game results" });
  }
};

export const UserGameResults4 = async (req, res) => {
  try {
    const gameResults = await GameResult.find({ 
      userid: req.user._id, 
      duration: "300s" // Filter for duration 30s
    }).sort({ time: -1 }); // Sort by most recent
    
    res.json(gameResults);
  } catch (error) {
    console.error("Error fetching game results:", error);
    res.status(500).json({ error: "Failed to fetch game results" });
  }
};
  export const getGameResultsByUserId = async (req, res) => {
    try {
      const { userId } = req.query;;
  
      // Fetch game results for the given user ID
      const gameResults = await GameResult.find({ userid: userId })
        .sort({ time: -1 }) // Sort by most recent first
        .lean();
  
      if (!gameResults.length) {
        return res.status(404).json({
          success: false,
          message: "No game results found for this user.",
        });
      }
  
      // Map and send all necessary fields to frontend
      const transformedResults = gameResults.map((result) => ({
        gameId: result._id.toString(),
        periodNumber: result.periodNumber,
        purchaseAmount: result.purchaseAmount,
        amountAfterTax: result.amountAfterTax,
        tax: result.tax,
        result: result.result,
        select: result.select,
        status: result.status,
        winLoss: result.winLoss,
        duration:result.duration,
        time: result.time,
      }));
  
      res.status(200).json({
        success: true,
        gameData: transformedResults,
      });
    } catch (error) {
      console.error("Error fetching game results:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch game results.",
      });
    }
  };
  
  

  export const getUserGameDatabyCode = async (req, res) => {
    try {
      const { code, fromDate, toDate } = req.body;
  
      // Validate that `code` is provided
      if (!code) {
        return res.status(400).json({ success: false, message: "Code is required" });
      }
  
      // Find the user by code
      const user = await User.findOne({ code });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Build the query for GameResult
      const query = { userid: user._id }; // Assuming `userid` in `GameResult` refers to MongoDB `_id`
  
      // Add date filtering if `fromDate` or `toDate` is provided
      if (fromDate || toDate) {
        query.time = {};
        if (fromDate) query.time.$gte = new Date(fromDate); // Include fromDate
        if (toDate) {
          const endOfDay = new Date(toDate);
          endOfDay.setUTCHours(23, 59, 59, 999); // Include entire toDate
          query.time.$lte = endOfDay;
        }
      }
  
      // Fetch game results based on query
      const gameResults = await GameResult.find(query)
        .sort({ time: -1 }) // Sort by most recent first
        .lean();
  
      // Check if results exist
      if (!gameResults.length) {
        return res.status(404).json({
          success: false,
          message: "No game results found for the specified criteria.",
        });
      }
  
      // Transform results to only include necessary fields
      const transformedResults = gameResults.map((result) => ({
        gameId: result._id.toString(),
        periodNumber: result.periodNumber,
        purchaseAmount: result.purchaseAmount,
        amountAfterTax: result.amountAfterTax,
        tax: result.tax,
        result: result.result,
        select: result.select,
        status: result.status,
        winLoss: result.winLoss,
        timeSlot :result.duration,
        time: result.time,
      }));
  
      // Send the response with transformed results
      res.status(200).json({
        success: true,
        gameData: transformedResults,
      });
    } catch (error) {
      console.error("Error fetching user game data:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  


export const getUserGameDatabyCodes = async (req, res) => {
    try {
      const { codes, fromDate, toDate } = req.body;
  
      // Validate that `codes` is provided and is an array
      if (!Array.isArray(codes) || codes.length === 0) {
        return res.status(400).json({
          success: false,
          message: "An array of codes is required.",
        });
      }
  
      // Initialize the response array
      const results = [];
  
      // Iterate over the codes and fetch user and game results
      for (const code of codes) {
        // Find the user by code
        const user = await User.findOne({ code });
        if (!user) {
          results.push({
            code,
            success: false,
            message: "User not found.",
          });
          continue; // Skip to the next code
        }
  
        // Build the query for GameResult
        const query = { userid: user._id };
  
        // Add date filtering if `fromDate` or `toDate` is provided
        if (fromDate || toDate) {
          query.time = {};
          if (fromDate) query.time.$gte = new Date(fromDate);
          if (toDate) {
            const endOfDay = new Date(toDate);
            endOfDay.setUTCHours(23, 59, 59, 999);
            query.time.$lte = endOfDay;
          }
        }
  
        // Fetch game results for the user
        const gameResults = await GameResult.find(query)
          .sort({ time: -1 })
          .lean();
  
        if (!gameResults.length) {
          results.push({
            code,
            success: false,
            message: "No game results found for the specified criteria.",
          });
          continue; // Skip to the next code
        }
  
        // Transform results to include necessary fields and the code
        const transformedResults = gameResults.map((result) => ({
          code, // Include the code
          gameId: result._id.toString(),
          periodNumber: result.periodNumber,
          purchaseAmount: result.purchaseAmount,
          amountAfterTax: result.amountAfterTax,
          tax: result.tax,
          result: result.result,
          select: result.select,
          status: result.status,
          winLoss: result.winLoss,
          timeSlot:result.duration,
          time: result.time,
        }));
  
        // Add results to the response array
        results.push({
          code,
          success: true,
          gameData: transformedResults,
        });
      }
  
      // Send the response
      res.status(200).json({
        success: true,
        results,
      });
    } catch (error) {
      console.error("Error fetching user game data:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  
export const deleteGameLogs = async (req, res) => {
    try {
      const { quantity } = req.body;
      let deleteCount;
  
      if (quantity === 'all') {
        deleteCount = await Game.deleteMany({});
      } else {
        const numQuantity = parseInt(quantity, 10);
  
        // Find logs in ascending order (oldest first) and limit to the specified quantity
        const logsToDelete = await Game.find().sort({ timestamp: 1 }).limit(numQuantity); // Sorting by ascending order
        const idsToDelete = logsToDelete.map(log => log._id);
  
        // Check if the number of logs found matches the requested quantity
        if (idsToDelete.length === numQuantity) {
          await Game.deleteMany({ _id: { $in: idsToDelete } });
          deleteCount = idsToDelete.length;
        } else {
          // In case fewer logs are found than requested, delete what is found
          await Game.deleteMany({ _id: { $in: idsToDelete } });
          deleteCount = idsToDelete.length;
        }
      }
  
      res.status(200).json({ message: `Deleted ${deleteCount} logs successfully` });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete game logs" });
    }
  };
  
  export const deleteGameLogs2 = async (req, res) => {
    try {
      const { quantity } = req.body;
      let deleteCount;
  
      if (quantity === 'all') {
        deleteCount = await Game2.deleteMany({});
      } else {
        const numQuantity = parseInt(quantity, 10);
  
        // Find logs in ascending order (oldest first) and limit to the specified quantity
        const logsToDelete = await Game2.find().sort({ timestamp: 1 }).limit(numQuantity); // Sorting by ascending order
        const idsToDelete = logsToDelete.map(log => log._id);
  
        // Check if the number of logs found matches the requested quantity
        if (idsToDelete.length === numQuantity) {
          await Game2.deleteMany({ _id: { $in: idsToDelete } });
          deleteCount = idsToDelete.length;
        } else {
          // In case fewer logs are found than requested, delete what is found
          await Game2.deleteMany({ _id: { $in: idsToDelete } });
          deleteCount = idsToDelete.length;
        }
      }
  
      res.status(200).json({ message: `Deleted ${deleteCount} logs successfully` });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete game logs" });
    }
  };

  export const deleteGameLogs3 = async (req, res) => {
    try {
      const { quantity } = req.body;
      let deleteCount;
  
      if (quantity === 'all') {
        deleteCount = await Game3.deleteMany({});
      } else {
        const numQuantity = parseInt(quantity, 10);
  
        // Find logs in ascending order (oldest first) and limit to the specified quantity
        const logsToDelete = await Game3.find().sort({ timestamp: 1 }).limit(numQuantity); // Sorting by ascending order
        const idsToDelete = logsToDelete.map(log => log._id);
  
        // Check if the number of logs found matches the requested quantity
        if (idsToDelete.length === numQuantity) {
          await Game3.deleteMany({ _id: { $in: idsToDelete } });
          deleteCount = idsToDelete.length;
        } else {
          // In case fewer logs are found than requested, delete what is found
          await Game3.deleteMany({ _id: { $in: idsToDelete } });
          deleteCount = idsToDelete.length;
        }
      }
  
      res.status(200).json({ message: `Deleted ${deleteCount} logs successfully` });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete game logs" });
    }
  };

  export const deleteGameLogs4 = async (req, res) => {
    try {
      const { quantity } = req.body;
      let deleteCount;
  
      if (quantity === 'all') {
        deleteCount = await Game4.deleteMany({});
      } else {
        const numQuantity = parseInt(quantity, 10);
  
        // Find logs in ascending order (oldest first) and limit to the specified quantity
        const logsToDelete = await Game4.find().sort({ timestamp: 1 }).limit(numQuantity); // Sorting by ascending order
        const idsToDelete = logsToDelete.map(log => log._id);
  
        // Check if the number of logs found matches the requested quantity
        if (idsToDelete.length === numQuantity) {
          await Game4.deleteMany({ _id: { $in: idsToDelete } });
          deleteCount = idsToDelete.length;
        } else {
          // In case fewer logs are found than requested, delete what is found
          await Game4.deleteMany({ _id: { $in: idsToDelete } });
          deleteCount = idsToDelete.length;
        }
      }
  
      res.status(200).json({ message: `Deleted ${deleteCount} logs successfully` });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete game logs" });
    }
  };
export const gamecount = async(req,res)=>{
    try {
      // Get the total count of entries in the Game collection
      const count = await Game.countDocuments();
  
      // Format the count as K, M, or B
      let formattedCount;
      if (count >= 1_000_000_000) {
        formattedCount = (count / 1_000_000_000).toFixed(1) + 'B';
      } else if (count >= 1_000_000) {
        formattedCount = (count / 1_000_000).toFixed(1) + 'M';
      } else if (count >= 1_000) {
        formattedCount = (count / 1_000).toFixed(1) + 'K';
      } else {
        formattedCount = count.toString();
      }
  
      // Send the response
      res.status(200).json({
        success: true,
        totalCount: formattedCount,
      });
    } catch (error) {
      console.error('Error fetching game count:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching the game count.',
      });
    }
  };
  
export const gamecount2 = async(req,res)=>{
    try {
      // Get the total count of entries in the Game collection
      const count = await Game2.countDocuments();
  
      // Format the count as K, M, or B
      let formattedCount;
      if (count >= 1_000_000_000) {
        formattedCount = (count / 1_000_000_000).toFixed(1) + 'B';
      } else if (count >= 1_000_000) {
        formattedCount = (count / 1_000_000).toFixed(1) + 'M';
      } else if (count >= 1_000) {
        formattedCount = (count / 1_000).toFixed(1) + 'K';
      } else {
        formattedCount = count.toString();
      }
  
      // Send the response
      res.status(200).json({
        success: true,
        totalCount: formattedCount,
      });
    } catch (error) {
      console.error('Error fetching game count:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching the game count.',
      });
    }
  };


  export const gamecount3 = async(req,res)=>{
    try {
      // Get the total count of entries in the Game collection
      const count = await Game3.countDocuments();
  
      // Format the count as K, M, or B
      let formattedCount;
      if (count >= 1_000_000_000) {
        formattedCount = (count / 1_000_000_000).toFixed(1) + 'B';
      } else if (count >= 1_000_000) {
        formattedCount = (count / 1_000_000).toFixed(1) + 'M';
      } else if (count >= 1_000) {
        formattedCount = (count / 1_000).toFixed(1) + 'K';
      } else {
        formattedCount = count.toString();
      }
  
      // Send the response
      res.status(200).json({
        success: true,
        totalCount: formattedCount,
      });
    } catch (error) {
      console.error('Error fetching game count:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching the game count.',
      });
    }
  };

  export const gamecount4 = async(req,res)=>{
    try {
      // Get the total count of entries in the Game collection
      const count = await Game4.countDocuments();
  
      // Format the count as K, M, or B
      let formattedCount;
      if (count >= 1_000_000_000) {
        formattedCount = (count / 1_000_000_000).toFixed(1) + 'B';
      } else if (count >= 1_000_000) {
        formattedCount = (count / 1_000_000).toFixed(1) + 'M';
      } else if (count >= 1_000) {
        formattedCount = (count / 1_000).toFixed(1) + 'K';
      } else {
        formattedCount = count.toString();
      }
  
      // Send the response
      res.status(200).json({
        success: true,
        totalCount: formattedCount,
      });
    } catch (error) {
      console.error('Error fetching game count:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching the game count.',
      });
    }
  };