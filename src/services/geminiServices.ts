import { GoogleGenAI } from "@google/genai";
import {
	type ProviderResponse,
	type StructuredResponse,
	StructuredResponseJsonSchema,
	StructuredResponseSchema,
} from "../types/index.ts";
import { SYSTEM_PROMPT } from "../utils/constant.ts";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	throw new Error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey });

export const getGeminiResponse = async (
	prompt: string,
): Promise<ProviderResponse<StructuredResponse>> => {
	const response = await ai.interactions.create({
		model: "gemini-3.1-flash-lite",
		input: prompt,
		system_instruction: SYSTEM_PROMPT.FETCHER_PROMPT,
		response_format: {
			type: "text",
			mime_type: "application/json",
			schema: StructuredResponseJsonSchema,
		},
	});
	if (!response?.output_text) {
		return null;
	}

	const parsed: unknown = JSON.parse(response.output_text);
	return StructuredResponseSchema.parse(parsed);
};
