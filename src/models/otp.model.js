import mongoose from "mongoose";

const otpStructure = {
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}

const otpSchema = new mongoose.Schema(otpStructure);
const Otp = mongoose.model("OTP", otpSchema);

export default Otp;