// const express = require('express');
// const {
//   sendMessage,
//   getChatHistory,
//   clearChatHistory,
// } = require('../controllers/chat.controller');
// const authMiddleware = require('../middlewares/auth.middleware');

// import authMiddleware from "../middlewares/auth.middleware.js";

// const router = express.Router();

// // All routes require authentication
// router.use(authMiddleware);

// router.post('/', sendMessage);
// router.get('/history', getChatHistory);
// router.delete('/history', clearChatHistory);

// module.exports = router;


import express from "express";
import { chatbot } from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const chatRoutes = express.Router();

// All routes require authentication
chatRoutes.use(authMiddleware);

chatRoutes.post("/", chatbot);

export default chatRoutes;
