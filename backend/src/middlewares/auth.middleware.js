// const jwt = require('jsonwebtoken');
// const env = require('../config/env');
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const authMiddleware = (req, res, next) => {
  // Checks if user has valid JWT token before allowing access to protected routes.
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract "Bearer token"

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export default authMiddleware;
