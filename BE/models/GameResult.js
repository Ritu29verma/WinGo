import mongoose from "mongoose";

const GameResultSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  periodNumber: {
    type: Number,
    required: true,
  },
  purchaseAmount: {
    type: Number,
    required: true,
  },
  amountAfterTax: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  select: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["succeed", "fail"], // Restrict to succeed/fail
  },
  winLoss: {
    type: Number, // Represents the win/loss amount
    required: true,
  },
  duration: {
    type: String,
    required: true,
    enum: ["30s", "60s", "180s", "300s"], // Restrict values
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const GameResult = mongoose.model("GameResult", GameResultSchema);
export default GameResult;
