import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { signupValidator,loginValidator } from "../validators/authValidators.js";
import Wallet from "../models/Wallet.js";
import MinAmount from "../models/MinAmount.js";
import RechargeTransaction from "../models/RechargeTransaction.js";
import Withdraw from "../models/Withdraw.js";
import GameResult from "../models/GameResult.js";

export const registerUser = async (req, res) => {
  try {
    const validation = signupValidator.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const { phoneNo, countryCode, password, inviteCode } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ phoneNo });
    if (existingUser) {
      return res.status(409).json({ error: "Phone number already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      phoneNo,
      countryCode,
      password: hashedPassword,
      inviteCode,
    });

    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); 
    const day = now.getDate().toString().padStart(2, "0"); 
    const seconds = Math.floor(now.getTime() / 1000).toString().slice(-4); 

    const walletNo = `${year}${month}${day}${seconds}`; 

    const minAmountDoc = await MinAmount.findOne();
    const minAmount = minAmountDoc ? minAmountDoc.value : 100;

    const wallet = await Wallet.create({
      walletNo,
      userId: user._id,
      totalAmount: minAmount,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, phoneNo: user.phoneNo, countryCode: user.countryCode },
      wallet: { walletNo: wallet.walletNo, totalAmount: wallet.totalAmount },
    });
  } catch (error) {
    if (error.name === "MongoNetworkError") {
      return res.status(503).json({ error: "Network error. Please try again later." });
    }
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

  

export const loginUser = async (req, res) => {
  try {
    const validation = loginValidator.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }
    const { phoneNo, password } = req.body;
    const user = await User.findOne({ phoneNo });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, phoneNo: user.phoneNo },
    });
  } catch (error) {
    if (error.name === "MongoNetworkError") {
      return res.status(503).json({ error: "Network error. Please try again later." });
    }
    console.error("Error during login:", error);
    res.status(500).json({ error: "Network error. Please try again later." });
  }
};



export const getwalletAmount = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found for this user" });
    }

    res.status(200).json({
      walletNo: wallet.walletNo,
      totalAmount: wallet.totalAmount,
    });
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const createRechargeTransaction = async (req, res) => {
  const { utr, amount, paymentType, walletNo } = req.body;

  // Check if required fields are provided
  if (!utr || !amount || !paymentType || !walletNo) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if a transaction with the same UTR already exists
    const existingTransaction = await RechargeTransaction.findOne({ utr });
    if (existingTransaction) {
      return res
        .status(400)
        .json({ error: "A transaction with this UTR already exists" });
    }

    // Create a new recharge transaction
    const newTransaction = new RechargeTransaction({
      userId: req.user._id, // Extracted from authenticated token
      walletNo,
      paymentType,
      utr,
      amount,
      status: "pending", // Default status
    });

    // Save transaction
    await newTransaction.save();

    res.status(201).json({
      message: "Recharge transaction created successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const handleWithdraw = async (req, res) => {
  try {
    const {
      type,
      walletNo,
      accountNo,
      bankName,
      ifscCode,
      cardHolderName,
      amount,
    } = req.body;

    // Validate required fields
    if (!type || !walletNo || !amount) {
      return res
        .status(400)
        .json({ error: "Type, Wallet Number, and Amount are required." });
    }

    // Validate amount
    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "Withdrawal amount must be greater than 0." });
    }

    // Check if wallet exists
    const wallet = await Wallet.findOne({ walletNo });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found." });
    }

    // Ensure the wallet has sufficient funds
    if (wallet.balance < amount) {
      return res
        .status(400)
        .json({ error: "Insufficient wallet balance." });
    }

    // Create the withdrawal entry in the database
    const newWithdraw = new Withdraw({
      type,
      walletNo: wallet.walletNo,
      accountNo: type === "Bank Card" ? accountNo : null, // Required only for Bank
      bankName: type === "Bank Card" ? bankName : null,
      ifscCode: type === "Bank Card" ? ifscCode : null,
      cardHolderName: type === "Bank Card" ? cardHolderName : null, // Required only for Card
      amount,
      status: "pending", // Default to pending
    });

    // Save the withdraw amount to the database
    const savedWithdraw = await newWithdraw.save();
  

    res.status(201).json({
      message: "Withdrawal request submitted successfully.",
      withdraw: savedWithdraw,
    });
  } catch (error) {
    console.error("Error handling withdrawal:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};






export const getTransactionsByUserId = async (req, res) => {
  try {
    const userId = req.user._id; // Retrieved from the authenticated user in middleware

    const transactions = await RechargeTransaction.find({ userId }).sort({ createdAt: -1 }); // Sorting by newest first


    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "An error occurred while fetching transactions." });
  }
};




export const getWithdrawalsByWalletNo = async (req, res) => {
  try {
    const { walletNo } = req.query; // walletNo passed as query parameter
    if (!walletNo) {
      return res.status(400).json({ error: "walletNo is required" });
    }
    const withdrawals = await Withdraw.find({ walletNo }).sort({ createdAt: -1 });
    
    res.status(200).json({ withdrawals });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    res.status(500).json({ error: "An error occurred while fetching withdrawal records." });
  }
};


export const checkUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ isAuthenticated: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId); // Ensure `userId` matches the JWT payload
    if (!user) {
      return res.status(403).json({ isAuthenticated: false, message: "Not authorized" });
    }
    res.status(200).json({ isAuthenticated: true, message: "User is authenticated" });
  } catch (error) {
    console.error("Error during user check:", error);
    res.status(403).json({ isAuthenticated: false, message: "Invalid or expired token" });
  }
};





