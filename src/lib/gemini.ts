import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ThumbnailAnalysis {
  title: string;
  subtitle: string;
  colors: string[];
  imagePrompt: string;
  designTips: string[];
  mood: string;
  elements: string[];
}

export async function analyzeThumbnail(imageBuffer: string, mimeType: string): Promise<ThumbnailAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: imageBuffer,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this YouTube thumbnail and provide: 1. A catchy title suggestion. 2. A subtitle. 3. A list of 5 hex color codes representing the palette. 4. A detailed prompt for an AI image generator to recreate this style. 5. 3 design tips for why this style works. 6. The overall mood. 7. Key visual elements present.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          colors: { type: Type.ARRAY, items: { type: Type.STRING } },
          imagePrompt: { type: Type.STRING },
          designTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          mood: { type: Type.STRING },
          elements: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "subtitle", "colors", "imagePrompt", "designTips", "mood", "elements"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function generateThumbnailConcept(topic: string, style: string): Promise<ThumbnailAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a viral thumbnail concept for a video about "${topic}" in the style of "${style}". Provide a title, subtitle, color palette (5 hex codes), a detailed image generation prompt, 3 design tips, the mood, and key visual elements.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          colors: { type: Type.ARRAY, items: { type: Type.STRING } },
          imagePrompt: { type: Type.STRING },
          designTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          mood: { type: Type.STRING },
          elements: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "subtitle", "colors", "imagePrompt", "designTips", "mood", "elements"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function generateThumbnailImage(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
}
