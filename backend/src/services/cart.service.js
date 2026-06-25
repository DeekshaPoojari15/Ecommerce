import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

const handleCart = async (message, userId) => {

  const text = message.toLowerCase();

  // SHOW CART
  if (text.includes("show")) {

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    return {
      action: "SHOW_CART",
      cart,
    };
  }

  // ADD TO CART
  if (text.includes("add")) {

    const product = await Product.findOne({
      name: {
        $regex: message,
        $options: "i",
      },
    });

    if (!product) {
      return {
        message: "Product not found",
      };
    }

    let cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }

    cart.items.push({
      product: product._id,
      quantity: 1,
    });

    await cart.save();

    return {
      action: "ADD_TO_CART",
      message: `${product.name} added to cart`,
    };
  }

  return {
    message: "Cart action not recognized",
  };
};

export default handleCart;