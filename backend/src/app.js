import express from "express";
import cors from "cors";
import env from "./config/env.js";
import authRoutes from './routes/auth.routes.js';
import cartRoutes from './routes/cart.routes.js';
import productsRoutes from './routes/products.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import chatRoutes from './routes/chat.routes.js';

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
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', chatRoutes);
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

export default app;
