const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const { connectDB } = require('./db');

const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/adminAuth');
const foodRoutes = require('./routes/food');
const adminFoodRoutes = require('./routes/adminFood');
const ordersRoutes = require('./routes/orders');
const adminOrdersRoutes = require('./routes/adminOrders');
const ratingsRoutes = require('./routes/ratings');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Serve uploaded food images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/admin/food', adminFoodRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin/orders', adminOrdersRoutes);
app.use('/api/ratings', ratingsRoutes);

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', message: 'TuckIN API is running 🚀' })
);

// ── Start ─────────────────────────────────────────────────────
connectDB()
  .then(() => {
    if (require.main === module) {
      // Started directly (e.g., node server.js)
      app.listen(PORT, () =>
        console.log(`🚀 TuckIN backend running on http://localhost:${PORT}`)
      );
    }
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    if (require.main === module) process.exit(1);
  });

// Export for Vercel serverless
module.exports = app;
