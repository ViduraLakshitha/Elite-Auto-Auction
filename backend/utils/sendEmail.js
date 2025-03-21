import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();  // Load environment variables

const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
        user: "apikey",  // Always 'apikey' for SendGrid
        pass: process.env.SENDGRID_API_KEY  // Get API Key from .env
    }
});

// Asynchronous function with try-catch for better error handling
export const sendVerificationEmail = async (userEmail, verificationToken) => {
    const url = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
        from: 'sasindaprabhath5@gmail.com',
        to: userEmail,
        subject: "Verify Your Email",
        text: `Please verify your email by clicking the link: ${url}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
