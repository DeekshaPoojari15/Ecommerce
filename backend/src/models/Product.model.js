// const mongoose = require("mongoose");
import mongoose from "mongoose";

const specificationSchema = new mongoose.Schema(
  {},
  { strict: false, _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
    },

    sku: {
      type: String,
      // required: [true, "Please provide product SKU"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      // required: [true, "Please provide product description"],
      trim: true,
    },

    longDescription: {
      type: String,
      // required: [true, "Please provide long description"],
    },

    price: {
      type: Number,
      required: [true, "Please provide product price"],
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Accessories",
        "Wearables",
        "Audio",
        "Photography",
        "Fashion",
        "Furniture",
        "Vehicles",
        "Home Appliances",
        "Other",
      ],
      default: "Other",
    },

    specifications: {
      type: specificationSchema,
      default: {},
    },

    images: [
      {
        type: String,
        // required: true,
      },
    ],

    stock: {
      type: Number,
      // required: [true, "Please provide stock quantity"],
      min: 0,
      default: 0,
    },

    countInStock: {
      type: Number,
      min: 0,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    tags: [
      {
        type: String,
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

     embedding: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);