import Game from "../models/Game.js";
import GameResult from "../models/GameResult.js";
import User from "../models/User.js";

// API to fetch game logs
export const getGameLogs = async (req, res) => {
  try {
    const games = await Game.find()
      .sort({ timestamp: -1 }) // Sort in descending order by timestamp
      .limit(80); // Limit the results to the top 80
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game logs" });
  }
};


export const UserGameResults = async (req, res) => {
    try {
      const gameResults = await GameResult.find({ userid: req.user._id }).sort({ time: -1 }); // Sort by most recent
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
  
  