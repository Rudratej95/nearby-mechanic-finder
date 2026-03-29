const mongoose = require('mongoose');

/**
 * SOS emergency alert schema.
 * Tracks user location, assigned mechanic, and alert status.
 */
const sosSchema = new mongoose.Schema({
  userName: { type: String, default: 'Anonymous' },
  phone: { type: String, default: '' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }     // [lng, lat]
  },
  message: { type: String, default: 'Emergency assistance needed!' },
  assignedMechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic', default: null },
  status: { type: String, enum: ['pending', 'accepted', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

sosSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('SOS', sosSchema);
