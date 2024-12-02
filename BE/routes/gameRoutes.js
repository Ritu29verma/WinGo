import express from "express";
import { getGameLogs,UserGameResults,getGameResultsByUserId } from "../controllers/gameController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getlogs",getGameLogs)
router.get("/getGameResults",authenticateToken,UserGameResults)
router.get("/getGameResults-by-id",getGameResultsByUserId)
export default router;