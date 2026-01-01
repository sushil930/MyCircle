import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // In a real app, handle missing key gracefully
const ai = new GoogleGenAI({ apiKey });

export const generateListingDescription = async (
  title: string, 
  category: string, 
  keyFeatures: string,
  imageBase64?: string | null
) => {
  if (!apiKey) {
    console.warn("API Key is missing for Gemini");
    return "Please configure your API key to use the AI assistant.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // Base prompt text
    const promptText = `
      You are an expert copywriter for a high-end neighborhood marketplace called "MyCircle".
      Write a compelling, concise, and trustworthy description for a listing.
      
      Item Title: ${title}
      Category: ${category}
      Key Features/Context: ${keyFeatures}
      
      ${imageBase64 ? "INSTRUCTION: Analyze the provided image to describe the item's color, material, and condition visually." : ""}

      Keep it under 300 characters. Tone: Warm, professional, neighborly.
      Do not include hashtags.
    `;

    const parts: any[] = [{ text: promptText }];

    // If image exists, add it to the payload
    if (imageBase64) {
      // Expecting data:image/png;base64,....
      const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const data = match[2];
        
        parts.unshift({
          inlineData: {
            mimeType,
            data
          }
        });
      }
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
    });

    return response.text?.trim() || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};