import express from "express";
import { getGameLogs,UserGameResults,getGameResultsByUserId,getUserGameDatabyCode,getUserGameDatabyCodes, deleteGameLogs, getGameLogs2,getGameLogs3,getGameLogs4,UserGameResults2,UserGameResults3,UserGameResults4, gamecount, gamecount2, gamecount3, gamecount4,deleteGameLogs2, deleteGameLogs3, deleteGameLogs4} from "../controllers/gameController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getlogs",getGameLogs)
router.get("/getlogs2",getGameLogs2)
router.get("/getlogs3",getGameLogs3)
router.get("/getlogs4",getGameLogs4)
router.get("/getGameResults",authenticateToken,UserGameResults)
router.get("/getGameResults2",authenticateToken,UserGameResults2)
router.get("/getGameResults3",authenticateToken,UserGameResults3)
router.get("/getGameResults4",authenticateToken,UserGameResults4)
router.get("/getgamecount",gamecount)
router.get("/getgamecount2",gamecount2)
router.get("/getgamecount3",gamecount3)
router.get("/getgamecount4",gamecount4)
router.get("/getGameResults-by-id",getGameResultsByUserId);
router.post("/getGameResultsbyCode",getUserGameDatabyCode);
router.post("/getGameResultsbyCodes",getUserGameDatabyCodes);
router.post('/delete-game-logs', deleteGameLogs);
router.post('/delete-game-logs2', deleteGameLogs2);
router.post('/delete-game-logs3', deleteGameLogs3);
router.post('/delete-game-logs4', deleteGameLogs4);

export default router;