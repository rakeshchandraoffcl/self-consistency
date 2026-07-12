import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	throw new Error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey });

export const getGeminiResponse = async (prompt: string) => {
	const response = await ai.models.generateContent({
		model: "gemini-3.1-flash-lite",
		contents: prompt,
		config: {
			maxOutputTokens: 1000,
		},
	});
	return response?.text ?? null;
};
