import { Anthropic } from "@anthropic-ai/sdk";

const client = new Anthropic({
	apiKey: process.env.CLAUDE_API_KEY,
});

export const getClaudeResponse = async (prompt: string) => {
	const response = await client.messages.create({
		model: "claude-3-5-sonnet-20260620",
		messages: [{ role: "user", content: prompt }],
		max_tokens: 1000,
	});
	return response.content?.[0]?.type === "text"
		? response.content[0].text
		: null;
};
