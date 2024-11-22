import express from "express";
import { getGameLogs } from "../controllers/gameController.js";


const router = express.Router();

router.get("/getlogs",getGameLogs)

export default router;