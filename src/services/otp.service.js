import Otp from "../models/otp.model.js";
import { generateRandomOTP } from "../utils/generateOtp.js";
import { hashOTP } from "../utils/hashOTP.js";
import { compareOTP } from "../utils/compareOTP.js";

export const createOTP = async (email) => {    
    await Otp.deleteMany({ email });

    
    const otp = generateRandomOTP();
    const hashedOtp = await hashOTP(otp);

    const otpRecord = await Otp.create({
        email,
        otp: hashedOtp
    });

    if(!otpRecord) {
        throw new Error("Failed to create OTP record.");
    }
    
    return otp;
}


export const verifyOTP = async (email, otp) => {
    const otpRecord = await Otp.findOne({ email }).sort({ timestamp: -1 });
    if (!otpRecord) {
        throw new Error("No OTP found for this email.");
    }
 
    const OTP_EXPIRATION_TIME = 5 * 60 * 1000;
    const currentTime = new Date();

    if (currentTime - otpRecord.timestamp.getTime() > OTP_EXPIRATION_TIME) {
        await Otp.deleteOne({ _id: otpRecord._id });
        throw new Error("OTP has expired.");
    }


    const isMatch = await compareOTP(otp, otpRecord.otp);
    if (!isMatch) {
        throw new Error("Invalid OTP.");
    }
    await Otp.deleteOne({ _id: otpRecord._id });
    return true;
}