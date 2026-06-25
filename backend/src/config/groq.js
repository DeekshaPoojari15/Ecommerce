import OpenAI from "openai";
const env = require('./env');

const groq = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export default groq;