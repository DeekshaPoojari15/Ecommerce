import Order from "../models/Order.model.js";

const getOrders = async (userId) => {

  const orders = await Order.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .limit(5)
   ;

  return orders;
};

export default getOrders;