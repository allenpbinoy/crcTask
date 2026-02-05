const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    topic: { type: String, required: true },
    batchId: { type: String, required: true }, // e.g., '1', '2', '3'
    month: { type: String, required: true }      // e.g., '2024-10'
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
