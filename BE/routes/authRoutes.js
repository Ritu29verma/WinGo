import express from "express";
import { registerUser, loginUser,getwalletAmount,createRechargeTransaction , handleWithdraw } from "../controllers/authController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/wallet-details", authenticateToken,getwalletAmount);
router.post("/recharge", authenticateToken, createRechargeTransaction);
router.post("/withdraw", authenticateToken,handleWithdraw);

export default router;
