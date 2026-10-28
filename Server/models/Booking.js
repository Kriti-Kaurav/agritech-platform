const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingId: String,
  productName: String,
  bookingDate: String,
  quantity: Number,
  price: Number,
  status: { type: String, default: 'Confirmed' },
  buyerEmail: String
});

module.exports = mongoose.model('Booking', BookingSchema);