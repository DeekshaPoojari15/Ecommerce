const axios = require('axios');
const env = require('../config/env');

// @desc    Get product recommendations
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 5 } = req.query;

    // Call ML service for recommendations
    const response = await axios.get(`${env.ML_API_URL}/recommend`, {
      params: { userId, limit },
      timeout: 5000, // 5 second timeout
    });

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('ML Service Error:', error.message);

    // Return fallback recommendations or empty array
    res.status(200).json({
      success: true,
      data: [],
      message: 'Recommendation service temporarily unavailable',
    });
  }
};

// @desc    Get similar products
// @route   GET /api/recommendations/similar/:productId
// @access  Public
const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 5 } = req.query;

    // Call ML service for similar products
    const response = await axios.get(`${env.ML_API_URL}/similar`, {
      params: { productId, limit },
      timeout: 5000,
    });

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('ML Service Error:', error.message);

    res.status(200).json({
      success: true,
      data: [],
      message: 'Similar products service temporarily unavailable',
    });
  }
};

// @desc    Update user preferences for better recommendations
// @route   POST /api/recommendations/preferences
// @access  Private
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { preferences } = req.body; // Array of category preferences

    // Send to ML service to update user profile
    await axios.post(`${env.ML_API_URL}/preferences`, {
      userId,
      preferences,
    });

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('ML Service Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
    });
  }
};

module.exports = {
  getRecommendations,
  getSimilarProducts,
  updatePreferences,
};
