// geminiClient.js
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ Check for missing API key
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY not found in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ You can also switch to "gemini-1.5-pro" if needed
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = model;
