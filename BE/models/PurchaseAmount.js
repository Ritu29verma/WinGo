import mongoose from "mongoose";

const PurchasedAmountSchema = new mongoose.Schema(
    {
        date: {
          type: Date,
          default: new Date().setHours(0, 0, 0, 0),
        },

        totalAmount : {
          type: Number,
         default: 0,
        }
      },
      { timestamps: true }
    );

const PurchasedAmount = mongoose.model("PurchasedAmount", PurchasedAmountSchema);
export default PurchasedAmount;