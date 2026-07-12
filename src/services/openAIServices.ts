import { OpenAI } from "openai";

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const getOpenAIResponse = async (prompt: string) => {
	const response = await client.responses.create({
		model: "gpt-5-nano",
		input: [{ role: "user", content: prompt }],
		max_output_tokens: 1000,
	});
	// console.log("OpenAI Response OP:", JSON.stringify(response, null, 2));
	return response.output_text ?? null;
};
