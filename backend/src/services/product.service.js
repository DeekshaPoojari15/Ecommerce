// import Product from "../models/Product.model.js";
// import generateEmbedding from "../utils/embedding.js";

// const searchProducts = async (message) => {

//   const queryEmbedding = await generateEmbedding(message);

//   const products = await Product.aggregate([
//     {
//       $vectorSearch: {
//         index: "product_vector_index",
//         path: "embedding",
//         queryVector: queryEmbedding,
//         numCandidates: 100,
//         limit: 5,
//       },
//     },
//   ]);

//   return products;
// };

// export default searchProducts;


import Product from "../models/Product.model.js";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

const searchProducts = async (query) => {
  try {

    const queryEmbedding =
      await hf.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: query,
      });

    const products =
      await Product.aggregate([
        {
          $vectorSearch: {
            index: "product_vector_index",
            path: "embedding",
            queryVector: Array.from(queryEmbedding),
            numCandidates: 100,
            limit: 5
          }
        },
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            category: 1,
            images: 1,
            score: {
              $meta: "vectorSearchScore"
            }
          }
        }
      ]);

    return products;

  } catch (error) {
    console.log(error);
    return [];
  }
};

export default searchProducts;