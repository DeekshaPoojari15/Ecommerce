const express = require('express');
const {
  getOrders,
  getOrder,
  getMyOrders,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orders.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// User routes
router.get('/myorders', getMyOrders);
router.post('/', createOrder);
router.get('/:id', getOrder);

// Admin routes
router.get('/', getOrders);
router.put('/:id', updateOrderStatus);

module.exports = router;
