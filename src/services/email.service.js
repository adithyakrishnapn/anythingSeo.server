import nodemailer from 'nodemailer';
import transporter from "../config/mail.js";
import env from "../config/env.js";
import UserSettings from "../models/UserSettings.js";
import { decrypt } from "../utils/encryption.js";

const sendEmail = async (to, subject, html, text = "", ownerId = null) => {
    try {
        if (ownerId) {
            const settings = await UserSettings.findOne({ ownerId });
            if (settings?.email?.address && settings.email?.appPassword) {
                try {
                    const decryptedPassword = decrypt(settings.email.appPassword);
                    if (decryptedPassword && decryptedPassword.trim() !== '') {
                        const userTransporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: settings.email.address,
                                pass: decryptedPassword
                            }
                        });

                        console.log(`Sending email using custom configuration for owner: ${ownerId}`);
                        return await userTransporter.sendMail({
                            from: settings.email.address,
                            to,
                            subject,
                            html,
                            text
                        });
                    }
                } catch (decErr) {
                    console.error("Failed to decrypt custom Gmail App Password, using default SMTP fallback:", decErr);
                }
            }
        }

        console.log("Sending email using default SMTP fallback transporter.");
        return await transporter.sendMail({
            from: env.EMAIL_FROM,
            to,
            subject,
            html,
            text
        });
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

export { sendEmail };