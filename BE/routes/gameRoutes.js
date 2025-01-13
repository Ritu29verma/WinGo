import express from "express";
import { getGameLogs,UserGameResults,getGameResultsByUserId,getUserGameDatabyCode,getUserGameDatabyCodes, deleteGameLogs } from "../controllers/gameController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getlogs",getGameLogs)
router.get("/getGameResults",authenticateToken,UserGameResults)
router.get("/getGameResults-by-id",getGameResultsByUserId);
router.post("/getGameResultsbyCode",getUserGameDatabyCode);
router.post("/getGameResultsbyCodes",getUserGameDatabyCodes);
router.post('/delete-game-logs', deleteGameLogs);
export default router;