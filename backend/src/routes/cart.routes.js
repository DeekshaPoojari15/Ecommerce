// const express = require('express');
// const {
//   getCart,
//   addToCart,
//   updateCartItem,
//   removeFromCart,
//   clearCart,
// } = require('../controllers/cart.controller');
// const authMiddleware = require('../middlewares/auth.middleware');

import express from "express";
import {   getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,} from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const cartRoutes = express.Router();

// All routes require authentication
cartRoutes.use(authMiddleware);

cartRoutes.get('/', getCart);
cartRoutes.post('/', addToCart);
cartRoutes.put('/:productId', updateCartItem);
cartRoutes.delete('/:productId', removeFromCart);
cartRoutes.delete('/', clearCart);

export default cartRoutes;
