require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");


exports.sendEmailService = async (user) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: '"ReadUp" <nbrain1912@gmail.com>',
        to: user.email,
        subject: 'Reset your password',
        html: `
                <h3>Reset Password Request</h3>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link will expire in 1 hour.</p>
            `,
    });

    return info;
}
