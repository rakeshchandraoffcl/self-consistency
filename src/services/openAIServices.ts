import { OpenAI } from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import {
	type ProviderResponse,
	type StructuredResponse,
	StructuredResponseSchema,
} from "../types/index.ts";
import { SYSTEM_PROMPT } from "../utils/constant.ts";

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const getOpenAIResponse = async (
	prompt: string,
): Promise<ProviderResponse<StructuredResponse>> => {
	const response = await client.responses.parse({
		model: "gpt-5-nano",
		input: [
			{ role: "system", content: SYSTEM_PROMPT.FETCHER_PROMPT },
			{ role: "user", content: prompt },
		],
		text: {
			format: zodTextFormat(StructuredResponseSchema, "answer"),
		},
	});
	// console.log("OpenAI Response OP:", JSON.stringify(response, null, 2));
	return response.output_parsed;
};
