const express = require('express');
const cors = require('cors');
const env = require('./config/env');

const app = express();

// Middleware
// CORS: Allow frontend to make requests
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// JSON body parser: Convert request body to JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running ✅' });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/orders', require('./routes/orders.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
// app.use('/api/recommendations', require('./routes/recommendations.routes'));
// app.use('/api/chat', require('./routes/chat.routes'));
// app.use('/api/users', require('./routes/users.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;
