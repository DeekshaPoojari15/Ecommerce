const env = require('./config/env');

const mongoose = require("mongoose");

const Product = require("./models/Product.model");
const products = require("./data/products");

mongoose.connect(env.MONGO_URI);

const importData = async () => {
  try {
     await Product.deleteMany();

    console.log(products);

    await Product.insertMany(products);

    console.log("Data Imported");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

importData();