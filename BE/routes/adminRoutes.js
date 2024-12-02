import express from "express";
import { registerAdmin, loginAdmin,checkAdmin,updateMinAmount, createChannel,updateChannel,deleteChannel,getChannelsByType,getMinAmount,getRechargeByStatus,ApproveRecharge,rejectRecharge,getNonPendingTransactions,getAllUsers,AdminGameResults,getPurchasedAmount} from "../controllers/adminController.js";
import { getPendingWithdrawals,getNonPendingWithdrawals,approveWithdrawal,rejectWithdrawal } from "../controllers/TransactionController.js";
const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/minamount",updateMinAmount);
router.get("/check",checkAdmin);
router.get("/getminamount",getMinAmount);
router.post("/approve-recharge",ApproveRecharge);
router.get("/get-all-users",getAllUsers);
router.get("/pending-withdrawals", getPendingWithdrawals);
router.get("/non-pending-withdrawals", getNonPendingWithdrawals);
router.post("/approve-withdrawal",approveWithdrawal);
router.post("/reject-withdrawal",rejectWithdrawal);
router.post("/reject-recharge",rejectRecharge);
router.get("/get-recharge",getRechargeByStatus);
router.get("/non-pending-transactions",getNonPendingTransactions);
router.get("/betsData" , AdminGameResults);
router.get('/total-purchased-amount', getPurchasedAmount);
router.post("/channels", createChannel);
router.put('/channels/:id', updateChannel);
router.delete('/channels/:id', deleteChannel);
router.get('/channels/type/:type', getChannelsByType);

export default router;