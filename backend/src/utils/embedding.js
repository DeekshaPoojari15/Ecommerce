import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

const generateEmbedding = async (text) => {
  const embedding = await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: text,
  });

  return Array.from(embedding);
};

export default generateEmbedding;