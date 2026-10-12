const express = require('express');
const router = express.Router();

// In-memory store for labour/equipment bookings
const bookings = [];

// @desc    Create labour / equipment rental booking & dispatch notification message
// @route   POST /api/labour/book
// @access  Public
router.post('/book', (req, res) => {
  const {
    serviceTitle,
    serviceRate,
    providerName,
    providerPhone,
    farmerName,
    farmerPhone,
    location,
    date,
    workers
  } = req.body;

  if (!farmerName || !farmerPhone || !location || !date) {
    return res.status(400).json({ message: 'All booking fields are required.' });
  }

  const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;
  const newBooking = {
    id: bookingId,
    serviceTitle: serviceTitle || 'Agricultural Equipment/Labour',
    serviceRate: serviceRate || 'Standard Rate',
    providerName: providerName || 'Service Provider',
    providerPhone: providerPhone || '+91-9876501234',
    farmerName,
    farmerPhone,
    location,
    date,
    workers: workers || '1',
    status: 'DISPATCHED',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);

  console.log(`[LABOUR/RENTAL DISPATCH] 🚜 Notification sent:`);
  console.log(`  To Provider: ${newBooking.providerName} (${newBooking.providerPhone})`);
  console.log(`  From Farmer: ${newBooking.farmerName} (${newBooking.farmerPhone})`);
  console.log(`  Service: ${newBooking.serviceTitle} | Date: ${newBooking.date} | Loc: ${newBooking.location}`);

  return res.json({
    success: true,
    message: `Booking request dispatched to ${newBooking.providerName} (${newBooking.providerPhone})`,
    booking: newBooking
  });
});

// @desc    Get recent bookings
// @route   GET /api/labour/bookings
// @access  Public
router.get('/bookings', (req, res) => {
  res.json({ bookings });
});

module.exports = router;
