const express = require('express');

const router = express.Router();
const {protect, admin} = require('../middleware/auth');
const { bookEvent, sendBookingOTP, getMyBookings, confirmBooking, cancelBooking } = require('../controllers/bookingContoller');
router.post('/',protect,bookEvent);
router.post('/send-otp',protect,sendBookingOTP);
router.get('/my',protect,getMyBookings);
router.put('/:id/confirm',protect,admin,confirmBooking);
router.delete('/:id',protect,admin,cancelBooking);
module.exports = router;
