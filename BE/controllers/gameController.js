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