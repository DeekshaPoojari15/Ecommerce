const axios = require('axios');
const env = require('../config/env');

// @desc    Send chat message and get RAG response
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Call RAG service (assuming it runs on port 5002)
    const response = await axios.post(`${env.ML_API_URL}/chat`, {
      message: message.trim(),
      userId,
    }, {
      timeout: 10000, // 10 second timeout for LLM
    });

    res.status(200).json({
      success: true,
      data: {
        message: response.data.message,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('RAG Service Error:', error.message);

    // Fallback response
    res.status(200).json({
      success: true,
      data: {
        message: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
        timestamp: new Date(),
      },
    });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50 } = req.query;

    // Call RAG service for chat history
    const response = await axios.get(`${env.ML_API_URL}/chat/history`, {
      params: { userId, limit },
      timeout: 5000,
    });

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('RAG Service Error:', error.message);

    res.status(200).json({
      success: true,
      data: [],
      message: 'Chat history temporarily unavailable',
    });
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat/history
// @access  Private
const clearChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Call RAG service to clear history
    await axios.delete(`${env.ML_API_URL}/chat/history`, {
      data: { userId },
      timeout: 5000,
    });

    res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully',
    });
  } catch (error) {
    console.error('RAG Service Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to clear chat history',
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  clearChatHistory,
};
