import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
// Initialize blindly; errors caught at call site if key missing.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export const generateFairyStatus = async (mood: string): Promise<string> => {
  if (!apiKey) return "✨ Error: No API Key found! ✨";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, cute, sparkly, Y2K-style social media status update (under 280 chars) based on this mood: "${mood}". Use lots of emojis like ✨💖🦋👾.`,
    });
    return response.text || "✨ Sparkles empty... try again! ✨";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "☁️ The fairy dust ran out... (API Error) ☁️";
  }
};

export const chatWithFairyGodmother = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  if (!apiKey) return "✨ I need an API key to speak! ✨";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a digital Fairy Godmother from the year 2005. You love neon, glitter, and encouraging the user. You speak in a cute, supportive, and slightly 'internet slang' (lol, omg, yay) way. Keep responses relatively short and very aesthetic.",
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "✨ *silence* ✨";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "💔 Connection lost to the glitter realm. Try again later! 💔";
  }
};
