import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  // 1. Check for the new custom key first (to avoid reserved name issues)
  // We check both process.env and import.meta.env for maximum compatibility
  const customKey = process.env.VITE_GEMINI_API_KEY || (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY);
  if (customKey && customKey !== "undefined" && customKey.trim() !== "") {
    return customKey;
  }

  // 2. Fallback to the standard key
  const key = process.env.GEMINI_API_KEY;
  if (key && key !== "undefined" && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
    return key;
  }
  
  return null;
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface AnalysisResult {
  credibilityScore: number; // 0-100
  verdict: "Reliable" | "Unreliable" | "Mixed" | "Satire" | "Opinion";
  keyFindings: string[];
  potentialBiases: string[];
  indicators: {
    label: string;
    description: string;
    severity: "Low" | "Medium" | "High";
  }[];
  reasoning: string;
  sourcesToVerify?: string[];
}

export async function analyzeNews(content: string): Promise<AnalysisResult> {
  if (!ai) {
    throw new Error("Gemini API Key is missing or invalid. Please ensure you have created a .env file with your GEMINI_API_KEY.");
  }

  const model = "gemini-3-flash-preview";
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [{ text: `Analyze the following news content for credibility, potential misinformation, and bias. 
          Provide a structured analysis including specific indicators or patterns that led to your conclusion (e.g., sensationalist language, unreliable sources, logical fallacies, emotional manipulation).
          
          Content:
          ${content}
          ` }]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            credibilityScore: { type: Type.NUMBER, description: "A score from 0 to 100 where 100 is highly credible." },
            verdict: { type: Type.STRING, enum: ["Reliable", "Unreliable", "Mixed", "Satire", "Opinion"] },
            keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
            potentialBiases: { type: Type.ARRAY, items: { type: Type.STRING } },
            indicators: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "The name of the indicator (e.g., Sensationalist Language)." },
                  description: { type: Type.STRING, description: "A brief explanation of where and how this indicator appears in the text." },
                  severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
                },
                required: ["label", "description", "severity"]
              }
            },
            reasoning: { type: Type.STRING },
            sourcesToVerify: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["credibilityScore", "verdict", "keyFindings", "potentialBiases", "indicators", "reasoning"]
        }
      }
    });

    if (!response.text) {
      throw new Error("The AI returned an empty response. Please try again with different content.");
    }

    const result = JSON.parse(response.text);
    return result as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Your Gemini API Key is invalid. Please check your .env file and ensure the key is correct.");
    }
    
    if (error.message?.includes("quota")) {
      throw new Error("API quota exceeded. Please try again later or check your Google AI Studio billing.");
    }

    throw new Error(error.message || "Failed to analyze news content. Please check your internet connection and API key.");
  }
}
