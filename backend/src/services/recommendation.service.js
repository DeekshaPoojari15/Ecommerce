import { HfInference } from "@huggingface/inference";

const hf = new HfInference(
  process.env.HF_TOKEN
);

export const recommendProducts = async (
  query,
  products
) => {

  const context = products
    .map(product => `
      Product: ${product.name}
      Price: ${product.price}
      Description: ${product.description}
    `)
    .join("\n");

  const response =
    await hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [
        {
          role: "system",
          content:
            "You are an ecommerce assistant."
        },
        {
          role: "user",
          content: `
Products:

${context}

Question:

${query}
`
        }
      ]
    });

  return response.choices[0].message.content;
};