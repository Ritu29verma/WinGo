import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  phoneNo: {
    type: String,
    required: true,
    unique: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  inviteCode: {
    type: String,
  },
  totalWinAmount: {
    type: Number,
    default: 0, // Initialize with 0
  },
  totalLossAmount: {
    type: Number,
    default: 0, // Initialize with 0
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

const User = mongoose.model("User", UserSchema);
export default User;
