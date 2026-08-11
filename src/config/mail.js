import nodemailer from 'nodemailer';
import env from './env.js';

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth:{
        user: env.SMTP_EMAIL,
        pass: env.SMTP_PASSWORD
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,   // 10 seconds
    socketTimeout: 10000      // 10 seconds
});

export default transporter;