// const express = require('express');
// const {
//   getOrders,
//   getOrder,
//   getMyOrders,
//   createOrder,
//   updateOrderStatus,
// } = require('../controllers/orders.controller');
// const authMiddleware = require('../middlewares/auth.middleware');

import express from "express";
import { getOrders,
  getOrder,
  getMyOrders,
  createOrder,
  updateOrderStatus,} from "../controllers/orders.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const ordersRoutes = express.Router();

// All routes require authentication
ordersRoutes.use(authMiddleware);

// User routes
ordersRoutes.get('/myorders', getMyOrders);
ordersRoutes.post('/', createOrder);
ordersRoutes.get('/:id', getOrder);

// Admin routes
ordersRoutes.get('/', getOrders);
ordersRoutes.put('/:id', updateOrderStatus);

export default ordersRoutes;
