const detectIntentRule = (query) => {
  query = query.toLowerCase();

  if (
    query.includes("order") ||
    query.includes("track") ||
    query.includes("delivery")
  ) {
    return "ORDER";
  }

  if (
    query.includes("cart") ||
    query.includes("checkout")
  ) {
    return "CART";
  }

  if (
    query.includes("recommend") ||
    query.includes("best") ||
    query.includes("suggest")
  ) {
    return "RECOMMENDATION";
  }

  return null;
};

export default detectIntentRule;