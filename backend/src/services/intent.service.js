// const detectIntent = (message) => {
//   const query = message.toLowerCase();

//   const recommendationKeywords = [
//     "recommend",
//     "suggest",
//     "best",
//     "top",
//     "good",
//     "should i buy",
//     "which is better",
//     "help me choose",
//     "looking for",
//     "need a",
//     "need an"
//   ];

//   const orderKeywords = [
//     "order",
//     "delivery",
//     "tracking",
//     "shipment"
//   ];

//   const cartKeywords = [
//     "cart",
//     "basket",
//     "checkout"
//   ];

//   if (
//     recommendationKeywords.some(keyword =>
//       query.includes(keyword)
//     )
//   ) {
//     return "RECOMMENDATION";
//   }

//   if (
//     orderKeywords.some(keyword =>
//       query.includes(keyword)
//     )
//   ) {
//     return "ORDER";
//   }

//   if (
//     cartKeywords.some(keyword =>
//       query.includes(keyword)
//     )
//   ) {
//     return "CART";
//   }

//   return "PRODUCT";
// };

// export default detectIntent;


import detectIntentRule from "./intentRule.service.js";
import { detectIntentAI } from "./intentAI.service.js";

const detectIntent = async (message) => {

  const ruleIntent =
    detectIntentRule(message);

  if (ruleIntent) {
    return ruleIntent;
  }

  return await detectIntentAI(message);
};

export default detectIntent;