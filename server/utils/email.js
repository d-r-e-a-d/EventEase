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
const sendBookingEmail = async (email, bookingDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Booking Details',
        text: `Your booking has been confirmed. Details: ${JSON.stringify(bookingDetails)}`
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking email sent successfully');
    } catch (error) {
        console.error('Error sending booking email:', error);
    }
};

exports.sendOtpEmail = async (email, otp, type) => {
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
    }
};
