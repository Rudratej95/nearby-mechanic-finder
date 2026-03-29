const mongoose = require('mongoose');

/**
 * Review sub-schema embedded in Mechanic documents.
 */
const reviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  date: { type: Date, default: Date.now }
});

/**
 * Mechanic schema with GeoJSON location for geospatial queries.
 */
const mechanicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  experience: { type: Number, default: 0 },           // years
  rating: { type: Number, default: 0, min: 0, max: 5 },
  availability: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
  services: [{ type: String }],
  specialization: { type: String, default: 'General Mechanic' },
  address: { type: String, default: '' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }     // [lng, lat]
  },
  reviews: [reviewSchema],
  createdAt: { type: Date, default: Date.now }
});

// 2dsphere index enables geospatial queries like $near
mechanicSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Mechanic', mechanicSchema);
