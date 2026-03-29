const express = require('express');
const Mechanic = require('../models/Mechanic');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/mechanics
 * Fetch all mechanics. Supports optional query params:
 *   ?lat=&lng=&radius=  — geospatial filter (radius in km, default 50)
 *   ?search=            — name search (case-insensitive)
 *   ?rating=            — minimum rating filter
 *   ?availability=      — filter by availability status
 */
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius, search, rating, availability } = req.query;
    let filter = {};

    // Geospatial: find mechanics near a point
    if (lat && lng) {
      const maxDistance = (parseFloat(radius) || 50) * 1000; // km → m
      filter.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: maxDistance
        }
      };
    }

    // Text search on name
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Minimum rating
    if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }

    // Availability status
    if (availability) {
      filter.availability = availability;
    }

    const mechanics = await Mechanic.find(filter);
    res.json(mechanics);
  } catch (error) {
    console.error('Error fetching mechanics:', error);
    res.status(500).json({ message: 'Server error fetching mechanics' });
  }
});

/**
 * GET /api/mechanics/count
 * Returns the count of mechanics near a specific coordinate.
 */
router.get('/count', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) return res.json({ count: 0 });

    const rad = parseFloat(radius) || 100;
    // $centerSphere expects [lng, lat] and radius in radians (radius in km / 6378.1)
    const count = await Mechanic.countDocuments({
      location: {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], rad / 6378.1]
        }
      }
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error counting mechanics' });
  }
});

/**
 * GET /api/mechanics/:id
 * Fetch a single mechanic by ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) return res.status(404).json({ message: 'Mechanic not found' });
    res.json(mechanic);
  } catch (error) {
    console.error('Error fetching mechanic:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/mechanics
 * Add a new mechanic (requires authentication).
 */
router.post('/', auth, async (req, res) => {
  try {
    const mechanic = new Mechanic(req.body);
    await mechanic.save();
    res.status(201).json(mechanic);
  } catch (error) {
    console.error('Error creating mechanic:', error);
    res.status(400).json({ message: error.message });
  }
});

/**
 * POST /api/mechanics/:id/reviews
 * Add a review to a mechanic.
 */
router.post('/:id/reviews', async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) return res.status(404).json({ message: 'Mechanic not found' });

    mechanic.reviews.push(req.body);

    // Recalculate average rating
    const totalRating = mechanic.reviews.reduce((sum, r) => sum + r.rating, 0);
    mechanic.rating = parseFloat((totalRating / mechanic.reviews.length).toFixed(1));

    await mechanic.save();
    res.status(201).json(mechanic);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
