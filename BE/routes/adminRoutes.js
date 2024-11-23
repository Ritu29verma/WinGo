import express from "express";
import { registerAdmin, loginAdmin,checkAdmin,updateMinAmount, createChannel,updateChannel,deleteChannel,getChannelsByType,getMinAmount,getRechargeByStatus,ApproveRecharge,rejectRecharge,getNonPendingTransactions} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/minamount",updateMinAmount);
router.get("/check",checkAdmin);
router.get("/getminamount",getMinAmount);
router.post("/approve-recharge",ApproveRecharge);
router.post("/reject-recharge",rejectRecharge);
router.get("/get-recharge",getRechargeByStatus);
router.get("/non-pending-transactions",getNonPendingTransactions);
router.post("/channels", createChannel);
router.put('/channels/:id', updateChannel);
router.delete('/channels/:id', deleteChannel);
router.get('/channels/type/:type', getChannelsByType);

export default router;