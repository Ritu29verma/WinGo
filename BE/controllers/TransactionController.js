import Withdraw from "../models/Withdraw.js";
import Wallet from "../models/Wallet.js";
import {io,userSockets} from "../socket.js"
import User from "../models/User.js";
export const getPendingWithdrawals = async (req, res) => {
  try {
    // Fetch pending withdrawals sorted by creation date (latest first)
    const withdrawals = await Withdraw.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .exec();

    // Transform data for the response
    const result = withdrawals.map((withdrawal) => ({
      id: withdrawal._id,
      type: withdrawal.type,
      bankName: withdrawal.bankName || "N/A",
      walletNo: withdrawal.walletNo,
      accountNo: withdrawal.accountNo || "N/A",
      ifscCode: withdrawal.ifscCode || "N/A",
      cardHolderName: withdrawal.cardHolderName || "N/A",
      amount: withdrawal.amount,
      date: withdrawal.createdAt,
    }));

    res.status(200).json({
      success: true,
      message: "Pending withdrawals fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching pending withdrawals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const getNonPendingWithdrawals = async (req, res) => {
    try {
      // Fetch non-pending withdrawals (approved/rejected) sorted by creation date
      const withdrawals = await Withdraw.find({ status: { $ne: "pending" } })
        .sort({ createdAt: -1 })
        .exec();
  
      // Transform data for the response
      const result = withdrawals.map((withdrawal) => ({
        id: withdrawal._id,
        type: withdrawal.type,
        bankName: withdrawal.bankName || "N/A",
        walletNo: withdrawal.walletNo,
        accountNo: withdrawal.accountNo || "N/A",
        ifscCode: withdrawal.ifscCode || "N/A",
        cardHolderName: withdrawal.cardHolderName || "N/A",
        amount: withdrawal.amount,
        date: withdrawal.createdAt,
        status: withdrawal.status,
      }));
  
      res.status(200).json({
        success: true,
        message: "Non-pending withdrawals fetched successfully.",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching non-pending withdrawals:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };



export const approveWithdrawal = async (req, res) => {
    const { withdrawalId } = req.body;
    try {
      const withdrawal = await Withdraw.findById(withdrawalId);
      if (!withdrawal) {
        return res.status(404).json({ error: "Withdrawal transaction not found." });
      }
      
      const wallet = await Wallet.findOne({ walletNo: withdrawal.walletNo });
      if (!wallet) {
        return res.status(404).json({ error: "Associated wallet not found." });
      }
      if (wallet.totalAmount < withdrawal.amount) {
        return res
          .status(400)
          .json({ error: "Insufficient balance in the wallet for this transaction." });
      }
      wallet.totalAmount -= withdrawal.amount;
      await wallet.save();
      withdrawal.status = "approved";
      await withdrawal.save();
      const userSocketId = userSockets.get(wallet.userId.toString());
      if (userSocketId) {
        io.to(userSocketId).emit("walletUpdated", {
          walletNo: wallet.walletNo,
          totalAmount: wallet.totalAmount,
        });
      }
      const user = await User.findById(wallet.userId);
      if (!user) {
        return res.status(404).json({ error: "User associated with the wallet not found." });
      }

      const [results] = await req.mysqlPool.query(
        'SELECT * FROM client WHERE code = ?',
        [user.code]
      );
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Client not found in MySQL." });
      }
  
      const client = results[0];

      const updatedMatkaLimit = wallet.totalAmount;
      await req.mysqlPool.query(
        'UPDATE client SET matkaLimit = ?, updated_at = NOW() WHERE Id = ?',
        [updatedMatkaLimit, client.Id]
      );

      return res.status(200).json({
        message: "Withdrawal approved successfully.",
        withdrawal,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An internal server error occurred." });
    }
  };


export const rejectWithdrawal =  async (req, res) => {
    try {
      const { withdrawalId } = req.body;
  
      if (!withdrawalId) {
        return res.status(400).json({ error: "Withdrawal ID is required." });
      }
  
      const withdrawal = await Withdraw.findById(withdrawalId);
  
      if (!withdrawal) {
        return res.status(404).json({ error: "Withdrawal not found." });
      }
  
      // Update the status to 'rejected'
      withdrawal.status = "rejected";
      await withdrawal.save();
  
      res.status(200).json({
        message: "Withdrawal rejected successfully.",
        withdrawal,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while rejecting the withdrawal." });
    }
  };