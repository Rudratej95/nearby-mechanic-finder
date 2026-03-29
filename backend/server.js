require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const mechanicRoutes = require('./routes/mechanics');
const authRoutes = require('./routes/auth');
const sosRoutes = require('./routes/sos');

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes);

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start Server ────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
