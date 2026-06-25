import { HfInference } from "@huggingface/inference";

const hf = new HfInference(
  process.env.HF_TOKEN
);

export const detectIntentAI = async (message) => {

  const prompt = `
You are an ecommerce intent classifier.

Possible intents:

PRODUCT
RECOMMENDATION
ORDER
CART

Examples:

"show laptops"
PRODUCT

"find wireless headphones"
PRODUCT

"best laptop under 50000"
RECOMMENDATION

"recommend a phone"
RECOMMENDATION

"where is my order"
ORDER

"track my shipment"
ORDER

"show my cart"
CART

User Query:
${message}

Return ONLY one intent.
`;

  const response =
    await hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 10
    });

  return response.choices[0]
    .message.content
    .trim()
    .toUpperCase();
};