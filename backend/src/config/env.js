require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  ML_API_URL: process.env.ML_API_URL || 'http://localhost:5001',
};
