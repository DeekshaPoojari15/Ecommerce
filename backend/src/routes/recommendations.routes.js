const express = require('express');
const {
  getRecommendations,
  getSimilarProducts,
  updatePreferences,
} = require('../controllers/recommendations.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.get('/similar/:productId', getSimilarProducts);

// Protected routes
router.use(authMiddleware);
router.get('/', getRecommendations);
router.post('/preferences', updatePreferences);

module.exports = router;
