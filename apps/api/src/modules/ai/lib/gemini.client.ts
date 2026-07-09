import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../../config/env.js";

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!env.GOOGLE_GEMINI_API_KEY) throw new Error("GOOGLE_GEMINI_API_KEY tidak diset");
  client ??= new GoogleGenerativeAI(env.GOOGLE_GEMINI_API_KEY);
  return client;
}

export async function generateGeminiNarrative(prompt: string): Promise<string> {
  const model = getClient().getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
