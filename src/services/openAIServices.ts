import { OpenAI } from "openai";

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const getOpenAIResponse = async (prompt: string) => {
	const response = await client.responses.create({
		model: "gpt-4o-mini",
		input: [{ role: "user", content: prompt }],
	});
	return response.output_text ?? null;
};
