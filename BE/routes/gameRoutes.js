import express from "express";
import { getGameLogs,UserGameResults,getGameResultsByUserId,getUserGameDatabyCode } from "../controllers/gameController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getlogs",getGameLogs)
router.get("/getGameResults",authenticateToken,UserGameResults)
router.get("/getGameResults-by-id",getGameResultsByUserId);
router.post("/getGameResultsbyCode",getUserGameDatabyCode);
export default router;