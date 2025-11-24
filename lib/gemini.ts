import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ Missing GEMINI_API_KEY in .env.local");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash", // or gemini-2.5-flash-lite if you’re on free tier
});
