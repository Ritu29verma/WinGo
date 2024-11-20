import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

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
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
