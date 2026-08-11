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

        // If Resend API Key is configured, use the HTTPS API (ideal for Render/Railway where SMTP ports are blocked)
        if (env.RESEND_API_KEY) {
            console.log("Sending email using Resend HTTP API.");
            
            // On Resend free tier/onboarding, you can only send from onboarding@resend.dev unless you verify your domain
            let fromEmail = "AnythingCRM <onboarding@resend.dev>";
            if (env.EMAIL_FROM && !env.EMAIL_FROM.includes("gmail") && env.EMAIL_FROM.includes("@")) {
                fromEmail = env.EMAIL_FROM;
            }

            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${env.RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: fromEmail,
                    to: [to],
                    subject: subject,
                    html: html,
                    text: text || undefined
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Resend API returned status ${response.status}`);
            }
            return data;
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