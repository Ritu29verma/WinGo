import mongoose from "mongoose";

// MongoDB Schemas
const UserSchema = new mongoose.Schema({
  phoneNo: String,
  countryCode: String,
  password: { type: String, required: true},
  inviteCode: String,
  totalWinAmount: { type: Number, default: 0 },
  totalLossAmount: { type: Number, default: 0 },
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
export default User;
