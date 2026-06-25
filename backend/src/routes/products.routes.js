// const express = require('express');
// const {
//   getProducts,
//   getProduct,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// } = require('../controllers/products.controller');
// const authMiddleware = require('../middlewares/auth.middleware');
import express from "express";
import { getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,} from "../controllers/products.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const productsRoutes = express.Router();

// Public routes
productsRoutes.get('/', getProducts);
productsRoutes.get('/:id', getProduct);

// Protected routes (Admin only)
productsRoutes.post('/', authMiddleware, createProduct);
productsRoutes.put('/:id', authMiddleware, updateProduct);
productsRoutes.delete('/:id', authMiddleware, deleteProduct);

export default productsRoutes;
