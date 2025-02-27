import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import MinAmount from "../models/MinAmount.js"
import PaymentChannel from '../models/PaymentChannel.js';
import fs from "fs";
import path from "path";
import multer from "multer";
import RechargeTransaction from "../models/RechargeTransaction.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import GameResult from "../models/GameResult.js";
import PurchasedAmount from "../models/PurchaseAmount.js";
import {io,userSockets,timerDuration,timerDuration2,timerDuration3,timerDuration4} from "../socket.js";
import AdminWallet from "../models/AdminWallet.js";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve("images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });


export const registerAdmin = async (req, res) => {
  try {
    const { phoneNo, countryCode, password } = req.body;

    const existingAdmin = await Admin.findOne({ phoneNo });
    if (existingAdmin) {
      return res.status(409).json({ error: "Phone number already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      phoneNo,
      countryCode,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: { id: admin._id, phoneNo: admin.phoneNo, countryCode: admin.countryCode },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


export const loginAdmin = async (req, res) => {
    try {
      const { phoneNo, password } = req.body;
  
      const admin = await Admin.findOne({ phoneNo });
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET);
      res.status(200).json({
        message: "Login successful",
        token,
        admin: { id: admin._id, phoneNo: admin.phoneNo },
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


  export const checkAdmin = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ isAdmin: false, message: "No token provided" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const admin = await Admin.findById(decoded.adminId);
      if (!admin) {
        return res.status(403).json({ isAdmin: false, message: "Not authorized" });
      }
      res.status(200).json({ isAdmin: true, message: "User is an admin" });
    } catch (error) {
      console.error("Error during admin check:", error);
      res.status(403).json({ isAdmin: false, message: "Invalid or expired token" });
    }
  };


  export const updateMinAmount = async (req, res) => {
    try {
      const { value } = req.body;
      if (!value || typeof value !== "number" || value <= 0) {
        return res.status(400).json({ error: "Invalid value for minimum amount." });
      }
      const minAmountDoc = await MinAmount.findOneAndUpdate(
        {},
        { value, updatedAt: Date.now() },
        { new: true, upsert: true }
      );
      res.status(200).json({ message: "Minimum amount updated successfully", minAmount: minAmountDoc });
    } catch (error) {
      console.error("Error updating minimum amount:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };



  export const getMinAmount = async (req, res) => {
    try {
      const minAmountDoc = await MinAmount.findOne();
      if (!minAmountDoc) {
        return res.status(404).json({ message: "Minimum amount not set." });
      }
      res.status(200).json({ minAmount: minAmountDoc.value });
    } catch (error) {
      console.error("Error fetching minimum amount:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const createChannel = [
    upload.single("qrImage"),
    async (req, res) => {
      try {
        const { channelName, type, depositorId, fromBalance, toBalance } = req.body;
        const qrImage = req.file ? req.file.filename : null;
  
        const channel = new PaymentChannel({
          channelName,
          type,
          depositorId,
          fromBalance,
          toBalance,
          qrImage,
        });
  
        await channel.save();
        res.status(201).json(channel);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  ];
  
  export const updateChannel = [
    upload.single("qrImage"),
    async (req, res) => {
      try {

        const newFile = req.file ? req.file.filename : null;
  
        const channel = await PaymentChannel.findById(req.params.id);
        if (!channel) return res.status(404).json({ error: "Channel not found" });
    
        if (newFile && channel.qrImage) {
          const oldFilePath = path.resolve("images", channel.qrImage);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        const updatedData = {
          ...req.body,
          qrImage: newFile || channel.qrImage,
        };
        const updatedChannel = await PaymentChannel.findByIdAndUpdate(
          req.params.id,
          updatedData,
          { new: true }
        );
    
        res.status(201).json(updatedChannel);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  ];

  

export const deleteChannel = async (req, res) => {
  try {
    const channel = await PaymentChannel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    if (channel.qrImage) {
      const filePath = path.resolve("images", channel.qrImage);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await PaymentChannel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

  
  export const getChannelsByType = async (req, res) => {
    try {
      const channels = await PaymentChannel.find({ type: req.params.type });
      res.json(channels);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


export const getRechargeByStatus = async(req,res)=>{
  const { status } = req.query;

  if (!status || !["approved", "pending"].includes(status)) {
    return res.status(400).json({ error: "Invalid or missing status parameter." });
  }

  try {
    const transactions = await RechargeTransaction.find({ status })
      .populate({
        path: "userId",
        select: "phoneNo", // Include only the phoneNo field from the User model
        model: User,
      })
      .sort({ createdAt: -1 }); // Sort by latest transactions

    const result = transactions.map((transaction) => ({
      id: transaction._id,
      phoneNo: transaction.userId?.phoneNo || "N/A",
      walletNo: transaction.walletNo,
      utr: transaction.utr,
      amount: transaction.amount,
      paymentType: transaction.paymentType,
      time: transaction.createdAt,
      status: transaction.status,
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const ApproveRecharge = async(req,res) =>{
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ error: "Transaction ID is required." });
  }
  try {
    const transaction = await RechargeTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Recharge transaction not found." });
    }

    if (transaction.status === "rejected") {
      return res
        .status(400)
        .json({ error: "Cannot approve a rejected transaction." });
    }
    const wallet = await Wallet.findOne({ walletNo: transaction.walletNo });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found." });
    }
    wallet.totalAmount += transaction.amount;
    wallet.updatedAt = new Date();
    await wallet.save();

    const user = await User.findById(transaction.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const code = user.code;

    // Fetch the client from MySQL
    const [results] = await req.mysqlPool.query(
      "SELECT * FROM client WHERE code = ?",
      [code]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Client not found in MySQL." });
    }

    const client = results[0];
    const updatedAt = new Date();
    await req.mysqlPool.query(
      "UPDATE client SET matkaLimit = ?, updated_at = ? WHERE Id = ?",
      [wallet.totalAmount, updatedAt, client.Id]
    );


    transaction.status = "approved";
    transaction.updatedAt = new Date();
    await transaction.save();
    const userSocketId = userSockets.get(wallet.userId.toString());
    if (userSocketId) {
      io.to(userSocketId).emit("walletUpdated", {
        walletNo: wallet.walletNo,
        totalAmount: wallet.totalAmount,
      });
    }
    return res.status(200).json({
      message: "Transaction approved successfully.",
      wallet,
      transaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while approving the transaction.",
    });
  }
};



export const rejectRecharge = async (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ error: "Transaction ID is required." });
  }

  try {
    const transaction = await RechargeTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Recharge transaction not found." });
    }
    if (transaction.status === "approved") {
      return res
        .status(400)
        .json({ error: "Cannot reject an already approved transaction." });
    }
    if (transaction.status === "rejected") {
      return res
        .status(400)
        .json({ error: "This transaction is already rejected." });
    }
    transaction.status = "rejected";
    transaction.updatedAt = new Date();
    await transaction.save();

    return res.status(200).json({
      message: "Transaction rejected successfully.",
      transaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while rejecting the transaction.",
    });
  }
};



export const getNonPendingTransactions = async (req, res) => {
  try {
    const transactions = await RechargeTransaction.find({ status: { $ne: "pending" } })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "phoneNo",
        model: User,
      });

    const result = transactions.map((transaction) => ({
      id: transaction._id,
      phoneNo: transaction.userId?.phoneNo || "N/A",
      walletNo: transaction.walletNo,
      utr: transaction.utr,
      amount: transaction.amount,
      paymentType: transaction.paymentType,
      time: transaction.createdAt,
      status: transaction.status,
    }));

    if (result.length === 0) {
      return res.status(404).json({ message: "No non-pending transactions found." });
    }
    res.status(200).json({
      success: true,
      message: "Non-pending transactions fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      error: "An error occurred while fetching non-pending transactions.",
    });
  }
};






export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();

    const walletData = await Wallet.find()
      .select("walletNo userId totalAmount") // Include totalAmount
      .lean();

    // Map wallet data by userId
    const walletMap = walletData.reduce((acc, wallet) => {
      acc[wallet.userId] = {
        walletNo: wallet.walletNo,
        totalAmount: wallet.totalAmount,
      };
      return acc;
    }, {});

    // Process each user
    const processedUsers = users.map((user, index) => ({
      _id:user._id,
      serialNo: users.length - index, // Assign serial number
      phoneNo: `${user.phoneNo}`, // Combine country code and phone number
      inviteCode: user.inviteCode || "", // Handle blank invite code
      totalWinAmount: user.totalWinAmount,
      totalLossAmount: user.totalLossAmount,
      walletNo: walletMap[user._id]?.walletNo || "N/A", // Fetch walletNo or set as N/A
      totalAmount: walletMap[user._id]?.totalAmount || 0, // Fetch totalAmount or set as 0
      dateOfRegistration: user.createdAt.toISOString(), // Convert to readable format
    }));
    processedUsers.reverse();
    res.status(200).json({
      success: true,
      users: processedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const AdminGameResults = async (req, res) => {
  try {
    const { fromDate, toDate, page, limit } = req.query;

    const filter = {};

    // Validate that fromDate and toDate are provided
    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "Both fromDate and toDate are required." });
    }

    // Parse and validate the dates
    const startOfDay = new Date(fromDate);
    const endOfDay = new Date(toDate);
    endOfDay.setUTCHours(23, 59, 59, 999); // Set to end of the day

    // Add date range filter
    filter.time = { $gte: startOfDay, $lte: endOfDay };

    const totalResults = await GameResult.countDocuments(filter);

    const gameResults = await GameResult.find(filter)
      .sort({ time: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("userid", "phoneNo");

    if (!gameResults.length) {
        return res.json([]); // Return an empty array if no results are found
    }
    res.json({
      items: gameResults,
      totalPages: Math.ceil(totalResults / limit), // Calculate total pages
      currentPage: Number(page),
      totalResults,
    });

  } catch (error) {
    console.error("Error fetching admin game results:", error);
    res.status(500).json({ error: "Failed to fetch game results for admin" });
  }
}



export const getPurchasedAmount = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    // Validate that both `from` and `to` dates are provided
    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "Both 'from' and 'to' dates are required.",
      });
    }

    // Normalize 'from' date to the start of the day (00:00:00.000)
    const fromdate = new Date(fromDate);
    fromdate.setHours(0, 0, 0, 0);

    // Normalize 'to' date to the end of the day (23:59:59.999)
    const todate = new Date(toDate);
    todate.setHours(23, 59, 59, 999);

 
    const query = {
      date: {
        $gte: fromdate,
        $lte: todate, 
      },
    };

    // Fetch purchased amounts matching the query
    const purchasedAmounts = await PurchasedAmount.find(query).lean();

    // Check if any records were found
    if (!purchasedAmounts.length) {
      return res.json({
        success: true,
        totalAmount: 0, // Return 0 if no records are found
      });
    }

    // Calculate the total amount for the specified date range
    const totalAmount = purchasedAmounts.reduce((sum, record) => sum + record.totalAmount, 0);
    const totalProfit = purchasedAmounts.reduce((sum, record) => sum + record.profit, 0);
    const totalLoss = purchasedAmounts.reduce((sum, record) => sum + record.loss, 0);

    // Return the result
    res.status(200).json({
      success: true,
      totalAmount,
      totalProfit,
      totalLoss,
    });
  } catch (error) {
    console.error("Error fetching purchased amount:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



export const getAdminWallet =  async (req, res) => {
  try {
    let adminWallet = await AdminWallet.findOne();
    
    if (!adminWallet) {
      adminWallet = await AdminWallet.create({});
    }

    res.status(200).json({ balance: adminWallet.balance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



export const getAdminWalletpercent =  async (req, res) => {
  try {
    let adminWallet = await AdminWallet.findOne();
    
    if (!adminWallet) {
      adminWallet = await AdminWallet.create({});
    }

    res.status(200).json({ percent: adminWallet.reservePercentage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateWalletPercent =  async (req, res) => {
  try {
    const { reservePercentage } = req.body;

    if (reservePercentage < 0 || reservePercentage > 100) {
      return res.status(400).json({ message: "Reserve percentage must be between 0 and 100" });
    }

    if (timerDuration <= 6 || timerDuration2 <= 6 || timerDuration3 <= 6 || timerDuration4 <= 6) {
      return res.status(400).json({ message: "Cannot update reserve percentage when any timer is below 5 seconds" });
    }

    const adminWallet = await AdminWallet.findOne();
    if (!adminWallet) {
      return res.status(404).json({ message: "Admin wallet not found" });
    }

    adminWallet.reservePercentage = reservePercentage;
    adminWallet.updatedAt = new Date();

    await adminWallet.save();

    res.status(200).json({ reservePercentage: adminWallet.reservePercentage });
  } catch (error) {
    console.error("Error updating reserve percentage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
