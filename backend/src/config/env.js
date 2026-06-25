import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://deeksha_db_user:DeekshaEcommerce@cluster0.iikpymg.mongodb.net/?appName=Cluster0',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  ML_API_URL: process.env.ML_API_URL || 'http://localhost:5001',
  GROQ_API_KEY: process.env.GROQ_API_KEY || 'your_groq_api_key_here',
  HF_TOKEN: process.env.HF_TOKEN || 'your_huggingface_token_here',
};
