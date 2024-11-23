import mongoose from "mongoose";

const rechargeTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    walletNo: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
      enum: ["E-Wallet", "Paytm X QR", "UPI X QR", "USDT"],
    },
    utr: {
      type: String,
      required: true,
      unique: true, // To ensure UTR is unique
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["approved", "pending","rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const RechargeTransaction = mongoose.model(
  "RechargeTransaction",
  rechargeTransactionSchema
);

export default RechargeTransaction;
