import mongoose from 'mongoose';

const PaymentChannelSchema = new mongoose.Schema({
  channelName: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['E-Wallet', 'Paytm X QR', 'UPI X QR', 'USDT'], 
    required: true 
  },
  depositorId: { type: String, required: true },
  fromBalance: { type: String, required: true },
  toBalance: { type: String, required: true },
  qrImage: { type: String }, // Optional
}, { timestamps: true });

const PaymentChannel = mongoose.model('PaymentChannel', PaymentChannelSchema);

export default PaymentChannel;
