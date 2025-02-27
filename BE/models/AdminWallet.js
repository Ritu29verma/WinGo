import mongoose from "mongoose";

const AdminWalletSchema = new mongoose.Schema({

  balance: {
    type: Number,
    required: true,
    default: 0,
    set: (v) => Math.round(v * 100) / 100, 
  },
  reservePercentage: {
    type: Number,
    required: true,
    default: 30,
    set: (v) => Math.round(v * 100) / 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminWallet = mongoose.model("AdminWallet", AdminWalletSchema);
export default AdminWallet;
