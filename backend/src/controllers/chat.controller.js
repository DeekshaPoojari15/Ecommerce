

import detectIntent from "../services/intent.service.js";

import searchProducts from "../services/product.service.js";

import getOrders from "../services/order.service.js";

import handleCart from "../services/cart.service.js";

import { recommendProducts } from "../services/recommendation.service.js";

export const chatbot = async (req, res) => {
  try {

    const { message, userId } = req.body;
    console.log("Received message:", message, "from user:", userId);

    // Detect intent
    const intent =
  await detectIntent(message);;
    console.log("Detected intent:", intent);

    // PRODUCT
    if (intent === "PRODUCT") {

      const products =
        await searchProducts(message);

      return res.json({
        success: true,
        type: "products",
        products
      });
    }

    // ORDER
    if (intent === "ORDER") {

      const orders =
        await getOrders(userId);

      return res.json({
        intent,
        orders,
        type: "orders"
      });
    }

    // CART
    if (intent === "CART") {

      const cartResponse =
        await handleCart(message, userId);

      return res.json({
        intent,
        ...cartResponse,
        type: "cart"
      });
    }

    if (intent === "RECOMMENDATION") {

  const products =
    await searchProducts(message);

  const recommendation =
    await recommendProducts(
      message,
      products
    );

  return res.json({
    success: true,
    type: "recommendation",
    recommendation,
    products
  });
}

    // UNKNOWN
    return res.json({
      intent: "UNKNOWN",
      message:
        "Sorry, I could not understand.",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// export  default { chatbot };