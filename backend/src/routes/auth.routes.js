// const express = require('express');
// const { register, login, getMe } = require('../controllers/auth.controller');
// const authMiddleware = require('../middlewares/auth.middleware');

import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const authRoutes = express.Router();

// Public routes
authRoutes.post('/register', register);
authRoutes.post('/login', login);

// Protected routes
authRoutes.get('/me', authMiddleware, getMe);

export default authRoutes;
