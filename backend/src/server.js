const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

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
