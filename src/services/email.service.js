import transporter from "../config/mail.js";
import env from "../config/env.js";
import otpTemplate from "../templates/otp.templates.js";
import { generateRandomOTP } from "../utils/generateOtp.js";

const sendEmail = async (to, subject, html, text="") => {
    return await transporter.sendMail({
        from: env.EMAIL_FROM,
        to,
        subject,
        html,
        text
    });
}




export { sendEmail };