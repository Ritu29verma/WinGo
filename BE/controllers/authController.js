import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { signupValidator,loginValidator } from "../validators/authValidators.js";
import Wallet from "../models/Wallet.js";
import MinAmount from "../models/MinAmount.js";

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

    // Generate a unique wallet number using year, month, day, and seconds
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of the year
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month as 2 digits
    const day = now.getDate().toString().padStart(2, "0"); // Day as 2 digits
    const seconds = Math.floor(now.getTime() / 1000).toString().slice(-4); // Last 4 digits of the timestamp in seconds

    const walletNo = `${year}${month}${day}${seconds}`; // Combine to create a unique wallet number

    // Fetch the minimum wallet amount
    const minAmountDoc = await MinAmount.findOne();
    const minAmount = minAmountDoc ? minAmountDoc.value : 100; // Default to 100 if not set

    // Create a wallet for the user
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
