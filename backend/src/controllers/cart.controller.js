// const Cart = require('../models/Cart.model');
// const Product = require('../models/Product.model');
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      // Create empty cart if none exists
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const availableStock = product.stock ?? product.countInStock ?? product._doc?.countInStock ?? 0;
    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock (available: ${availableStock})`,
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;

        // Check stock again
        if (availableStock < existingItem.quantity) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient stock for requested quantity',
          });
        }
      } else {
        // Add new item
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    // Calculate total price
    await cart.populate('items.product');
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.productId;

    if (quantity <= 0) {
      return removeFromCart(req, res);
    }

    // Validate product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const availableStock = product.stock ?? product.countInStock ?? product._doc?.countInStock ?? 0;
    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock (available: ${availableStock})`,
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not in cart',
      });
    }

    item.quantity = quantity;

    // Recalculate total
    await cart.populate('items.product');
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    // Recalculate total
    await cart.populate('items.product');
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export  {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
