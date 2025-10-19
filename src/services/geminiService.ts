
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVideoDescription = async (title: string): Promise<string> => {
  try {
    const prompt = `Generate a compelling, short, and engaging movie description for a title: "${title}". The description should be around 2-3 sentences long. Do not include the title in the description itself.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini API:", error);
    return "Failed to generate AI description. Please try again.";
  }
};

export const generateVideoMetadata = async (title: string, description: string): Promise<{ category: string; tags: string[] }> => {
  try {
    const prompt = `Based on the following movie title and description, suggest the most fitting genre/category and 5-7 relevant tags. Title: "${title}". Description: "${description}".`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: 'The single most fitting genre or category for this content.'
            },
            tags: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: 'An array of 5 to 7 relevant tags that describe the content.'
            }
          },
          required: ['category', 'tags']
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating metadata with Gemini API:", error);
    throw new Error("Failed to generate AI metadata.");
  }
};
