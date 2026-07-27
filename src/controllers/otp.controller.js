import * as otpService from "../services/otp.service.js";
import { sendEmail } from "../services/email.service.js";
import otpTemplate from "../templates/otp.templates.js";

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = await otpService.createOTP(email);

        const subject = "Your OTP Code For Registration";
        const html = otpTemplate(otp);
        const text = `Your OTP is: ${otp}. This OTP expires in 5 minutes.`;

        await sendEmail(email, subject, html, text);
        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending OTP", error: error.message });
    }
}