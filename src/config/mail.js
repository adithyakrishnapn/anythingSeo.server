import nodemailer from 'nodemailer';
import env from './env.js';

const transportConfig = {
    auth: {
        user: env.SMTP_EMAIL,
        pass: env.SMTP_PASSWORD
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,   // 10 seconds
    socketTimeout: 10000      // 10 seconds
};

if (env.SMTP_HOST && env.SMTP_HOST.includes('gmail')) {
    transportConfig.service = 'gmail';
} else {
    transportConfig.host = env.SMTP_HOST;
    transportConfig.port = env.SMTP_PORT;
    transportConfig.secure = env.SMTP_PORT == 465;
}

const transporter = nodemailer.createTransport(transportConfig);

export default transporter;