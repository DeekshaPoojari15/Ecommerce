// const Product = require('../models/Product.model');
import Product from '../models/Product.model.js';
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    console.log("Retrieved product:", product);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    // const product = await Product.create(req.body);
    const {
      name,
      description,
      category,
      price
    } = req.body;

    // Combine important fields
    const embeddingText = `
      ${name}
      ${description}
      ${category}
      ${price}
    `.trim();


    // Generate embedding ONCE
    const embedding = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: embeddingText,
    });
    // console.log("Generated embedding:", embedding);

     // Save product + embedding
    const product = await Product.create({
      ...req.body,
      embedding: Array.from(embedding),
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    // const product = await Product.create(req.body);
    const {
      name,
      description,
      category,
      price
    } = req.body;

    // Combine important fields
    const embeddingText = `
      ${name}
      ${description}
      ${category}
      ${price}
    `.trim();


    // Generate embedding ONCE
    const embedding = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: embeddingText,
    });
    // console.log("Generated embedding:", embedding);

     // Save product + embedding while updating as well
     const updatedData = {
      ...req.body,
      embedding: Array.from(embedding),
    };
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
