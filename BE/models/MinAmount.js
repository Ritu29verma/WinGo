import mongoose from 'mongoose';

const MinAmountSchema = new mongoose.Schema({
    value: {
      type: Number,
      required: true,
      default: 100,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const MinAmount = mongoose.model("MinAmount", MinAmountSchema);
  export default MinAmount;
  