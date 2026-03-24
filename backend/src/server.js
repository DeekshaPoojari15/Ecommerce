const app = require('./app'); // Import Express app setup
const connectDB = require('./config/db');  // Import MongoDB connection
const env = require('./config/env');// Import configuration

// Connect to MongoDB
connectDB();

// Start server
const PORT = env.PORT;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = server;
