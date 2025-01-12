import express from "express";
import { registerUser, loginUser,getwalletAmount,createRechargeTransaction , handleWithdraw,getTransactionsByUserId, getWithdrawalsByWalletNo , checkUser} from "../controllers/authController.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import { checkClient,syncWallet,syncWalletByCode } from '../controllers/ClientController.js';
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/wallet-details", authenticateToken,getwalletAmount);
router.post("/recharge", authenticateToken, createRechargeTransaction);
router.get("/sync-wallets", syncWallet);
router.get("/sync-wallets-by-code", syncWalletByCode);
router.get("/get-user-transactions", authenticateToken, getTransactionsByUserId);
router.get("/get-user-withdrawals", getWithdrawalsByWalletNo);
router.post("/withdraw", authenticateToken,handleWithdraw);
router.get("/verify", checkUser);
router.get('/check-client', checkClient);


export default router;
