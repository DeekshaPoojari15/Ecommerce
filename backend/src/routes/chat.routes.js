const express = require('express');
const {
  sendMessage,
  getChatHistory,
  clearChatHistory,
} = require('../controllers/chat.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', sendMessage);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);

module.exports = router;
