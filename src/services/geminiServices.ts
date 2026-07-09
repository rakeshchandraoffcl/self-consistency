import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const getGeminiResponse = async (prompt: string) => {
	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: prompt,
	});
	return response?.text ?? null;
};
