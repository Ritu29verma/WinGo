const express = require("express");
const router = express.Router();
const zod = require("zod");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const signupBody = zod.object({
    phoneNo: zod.string().nonempty("Phone number is required"),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
  inviteCode: zod.string().optional(),
  agree: zod.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

router.post("/register", async (req, res) => {
  try {
    // Existing email check
    const existingUser = await User.findOne({  phoneNo : req.body.phoneNo });
    if (existingUser) {
      return res.status(409).json({ error: "A user with this  phone No already exists." });
    }

    // Input validation check
    const result = signupBody.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Input specified in incorrect format",
      });
    }

    const hashedpassword = await bcrypt.hash(req.body.password, 10);

    // When both checks are successful, add user to the database
    const user = await User.create({
      phoneNo: req.body.phoneNo,
      password: hashedpassword,
      inviteCode: req.body.inviteCode,
      agree: req.body.agree,
    });

    const userId = user._id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    res.status(201).json({
      message: "User created successfully",
      token: token,
      user: {
        id: user._id,
        phoneNo: user.phoneNo,
      },
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

  
  

const LoginBody = zod.object({
    phoneNo: zod.string(),
  password: zod.string(),
});

router.post("/login", async (req, res) => {
  try {
    // Input validation check
    const result = LoginBody.safeParse(req.body);
   

    const trial_user = await User.findOne({
        phoneNo: req.body. phoneNo,
    });

    if (!trial_user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      trial_user.password
    );

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          userId: trial_user._id,
        },
        process.env.JWT_SECRET,
      );

      return res.status(200).json({
        message: "Welcome user, you are logged in",
        token: token,
        user: {
          id: trial_user._id,
          phoneNo: trial_user.phoneNo,
          // Add other user details if needed
        },
      });
    }

    res.status(401).json({
      message: "Invalid Credentials",
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
module.exports = router;
