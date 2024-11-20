import express from "express";
import { placeBet, setGameResult } from "../controllers/gameController.js";

const router = express.Router();

router.post("/user/placeBet", placeBet);
router.post("/admin/setResult", setGameResult);

export default router;
