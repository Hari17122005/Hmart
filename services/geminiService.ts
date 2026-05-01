import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";
import { MOCK_PRODUCTS } from "../constants";

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const getShoppingAssistance = async (
  query: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const client = getAIClient();
    
    // Create a product context string to feed to the model
    const productContext = MOCK_PRODUCTS.map(
      (p) => `- ${p.name} ($${p.price}/${p.unit}): ${p.description}`
    ).join("\n");

    const systemInstruction = `You are "H Mart Assistant", a helpful AI shop assistant for H Mart. 
    You help customers find products, suggest recipes based on our inventory, and answer questions about food.
    
    Here is our current product inventory:
    ${productContext}
    
    Rules:
    1. Only suggest items that are in the inventory list above.
    2. If a user asks for a recipe, suggest one that uses our products if possible.
    3. Be concise, friendly, and helpful.
    4. Format your response in Markdown.
    5. If the user asks about a product we don't have, politely inform them we don't carry it yet.
    `;

    const chat = client.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const response = await chat.sendMessage({
      message: query,
    });

    return response.text || "I'm having trouble thinking right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am currently unavailable. Please check your internet connection or try again later.";
  }
};