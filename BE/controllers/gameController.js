import Game from "../models/Game.js";
import GameResult from "../models/GameResult.js";


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
  
  