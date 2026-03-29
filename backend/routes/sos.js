const express = require('express');
const SOS = require('../models/SOS');
const Mechanic = require('../models/Mechanic');

const router = express.Router();

/**
 * POST /api/sos
 * Create an SOS emergency alert.
 * Finds the nearest available mechanic and assigns them.
 * Body: { userName?, phone?, longitude, latitude, message? }
 */
router.post('/', async (req, res) => {
  try {
    const { userName, phone, longitude, latitude, message } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Location coordinates are required' });
    }

    // Find nearest available mechanic within 50 km
    const nearestMechanic = await Mechanic.findOne({
      availability: 'available',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: 50000 // 50 km
        }
      }
    });

    // Create SOS record
    const sos = new SOS({
      userName: userName || 'Anonymous',
      phone: phone || '',
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      message: message || 'Emergency assistance needed!',
      assignedMechanic: nearestMechanic ? nearestMechanic._id : null,
      status: nearestMechanic ? 'accepted' : 'pending'
    });
    await sos.save();

    // Populate mechanic details in response
    await sos.populate('assignedMechanic');

    res.status(201).json({
      message: nearestMechanic
        ? 'Help is on the way! A mechanic has been notified.'
        : 'SOS alert created. Searching for available mechanics...',
      sos,
      mechanic: nearestMechanic || null
    });
  } catch (error) {
    console.error('SOS error:', error);
    res.status(500).json({ message: 'Server error processing SOS alert' });
  }
});

/**
 * GET /api/sos
 * Get all SOS alerts (for admin/dashboard purposes).
 */
router.get('/', async (req, res) => {
  try {
    const alerts = await SOS.find().populate('assignedMechanic').sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching SOS alerts' });
  }
});

module.exports = router;
