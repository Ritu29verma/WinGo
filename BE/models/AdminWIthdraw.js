import mongoose from "mongoose";

const AdminWithdrawSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Assuming there is an Admin model
      required: true,
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

const AdminWithdraw = mongoose.model("AdminWithdraw", AdminWithdrawSchema);
export default AdminWithdraw;
