import Game from "../models/Game.js";


// API to fetch game logs
export const getGameLogs = async (req, res) => {
    try {
      const games = await Game.find().sort({ timestamp: -1 }); 
      res.status(200).json(games);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game logs" });
    }
  };