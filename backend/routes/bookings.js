const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');

// Middleware to verify JWT
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Get all bookings for current user
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.userId });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Sync bookings (create new, delete old if not in list) - for bulk updates
router.post('/sync', auth, async (req, res) => {
    try {
        const { bookings } = req.body; // Array of booking objects

        // Simple implementation: delete all and re-insert for simplicity in this task
        // Real world would be more efficient
        await Booking.deleteMany({ userId: req.userId });

        const bookingsToSave = bookings.map(b => ({
            ...b,
            userId: req.userId
        }));

        const saved = await Booking.insertMany(bookingsToSave);
        res.json(saved);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
