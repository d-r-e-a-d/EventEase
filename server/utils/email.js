const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendBookingEmail = async (email, eventTitle, amount) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Booking Details',
        text: `Your booking for ${eventTitle} has been created. Total amount: ${amount}.`
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking email sent successfully');
    } catch (error) {
        console.error('Error sending booking email:', error);
    }
};

const sendOTPEmail = async (email, otp, type) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email service is not configured. Set EMAIL_USER and EMAIL_PASS in server/.env.');
    }
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your OTP for ${type}`,
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Unable to send the OTP email. Check the Gmail account and app password configuration.');
    }
};

module.exports = { sendOTPEmail, sendBookingEmail };
