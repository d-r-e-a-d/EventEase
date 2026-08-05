const Booking = require('../models/Bookings.js');
const OTP = require('../models/OTP');
const Event = require('../models/Event');
const {sendOTPEmail, sendBookingEmail} = require('../utils/email');
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
exports.sendBookingOTP = async (req, res) => {
    try {
        const otp = generateOTP();
        await OTP.findOneAndDelete({ email: req.user.email, action: 'event_booking' });
        await OTP.create({ email: req.user.email, otp, action: 'event_booking' });
        await sendOTPEmail(req.user.email, otp, 'event_booking');
        res.json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Unable to send OTP', error: error.message });
    }
};
exports.bookEvent = async (req, res) => {
    try {
        const { eventId, seats, otp } = req.body;
        const seatCount = Number(seats);
        if (!Number.isInteger(seatCount) || seatCount < 1) {
            return res.status(400).json({ message: 'Seats must be a positive whole number' });
        }

        const otpRecord = await OTP.findOne({ email: req.user.email, action: 'event_booking' });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.availableSeats < seatCount) {
            return res.status(400).json({ message: 'Not enough seats available for this event' });
        }

        const existingBooking = await Booking.findOne({ userId: req.user.id, eventId });
        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked this event' });
        }

        const booking = await Booking.create({
            userId: req.user.id,
            eventId,
            status: 'pending',
            paymentStatus: 'non_paid',
            seats: seatCount,
            amount: event.ticketPrice * seatCount
        });
        await OTP.deleteMany({ email: req.user.email, action: 'event_booking' });
        await sendBookingEmail(req.user.email, event.title, booking.amount);
        res.status(201).json({ message: 'Booking created. Please proceed to payment.', bookingId: booking._id });
    } catch (error) {
        res.status(500).json({ message: 'Unable to create booking', error: error.message });
    }
};
exports.confirmBooking = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        if (!['paid', 'non_paid'].includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status' });
        }

        const booking = await Booking.findById(req.params.id).populate('eventId userId', 'title availableSeats email');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.status === 'confirmed') {
            return res.status(400).json({ message: 'Booking is already confirmed' });
        }

        const event = booking.eventId;
        if (!event || event.availableSeats < booking.seats) {
            return res.status(400).json({ message: 'Not enough seats available for this event' });
        }

        booking.status = 'confirmed';
        booking.paymentStatus = paymentStatus;
        event.availableSeats -= booking.seats;
        await Promise.all([booking.save(), event.save()]);
        await sendBookingEmail(booking.userId.email, event.title, booking.amount);
        res.json({ message: 'Booking confirmed', booking });
    } catch (error) {
        res.status(500).json({ message: 'Unable to confirm booking', error: error.message });
    }
};
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).populate('eventId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Unable to get bookings', error: error.message });
    }
};
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.userId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
        }
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        const wasConfirmed = booking.status === 'confirmed';
        booking.status = 'cancelled';
        await booking.save();
        if (wasConfirmed) {
            await Event.findByIdAndUpdate(booking.eventId, { $inc: { availableSeats: booking.seats } });
        }
        res.json({ message: 'Booking cancelled' });
    } catch (error) {
        res.status(500).json({ message: 'Unable to cancel booking', error: error.message });
    }
};
