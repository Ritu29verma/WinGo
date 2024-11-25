import express from "express";
import { getGameLogs,UserGameResults } from "../controllers/gameController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getlogs",getGameLogs)
router.get("/getGameResults",authenticateToken,UserGameResults)
export default router;