import mongoose, { Schema, model } from "mongoose";
import { OTP } from "../types/types";

const OTPSchema = new Schema<OTP>({
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: 'user'
  },
  expireAt: {
    type: Date,
    required: true,
    expires: 0
  },
  attemps: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

export default model<OTP>('otp', OTPSchema);