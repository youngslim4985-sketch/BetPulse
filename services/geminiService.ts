import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAlphaInsights(gameInfo: any) {
  if (!process.env.GEMINI_API_KEY) return "Momentum Edge insights unavailable. API key not configured.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a sharp betting analysis for this NFL matchup: ${JSON.stringify(gameInfo)}. 
      Focus on why the Momentum Edge Score is ${gameInfo.alpha_score}/100. 
      Analyze the line movement and sharp money indicators provided in the data.
      Keep it brief, professional, and data-driven like a professional handicapper. 
      Limit to 2 sentences.`,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating analytical insights.";
  }
}
