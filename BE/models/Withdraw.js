import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Bank Card", "USTD"],
      required: true,
    },
    walletNo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet", 
      required: true,
    },
    accountNo: {
      type: String,
      required: function () {
        return this.type === "Bank Card"; // Account No is required only for type "Bank"
      },
    },
    bankNumber: {
      type: String,
      required: function () {
        return this.type === "Bank Card"; // Bank Number is required only for type "Bank"
      },
    },
    ifscCode: {
      type: String,
      required: function () {
        return this.type === "Bank Card"; // IFSC Code is required only for type "Bank"
      },
    },
    cardHolderName: {
      type: String,
      required: function () {
        return this.type === "Bank Card"; // Cardholder Name is required only for type "Card"
      },
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Withdraw = mongoose.model("Withdraw", withdrawSchema);
export default Withdraw;