import { Anthropic } from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "../utils/constant.ts";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { CompareResponseSchema } from "@types/ai-response.ts";

const client = new Anthropic({
	apiKey: process.env.CLAUDE_API_KEY,
});

export const getClaudeResponse = async (prompt: string) => {
	const response = await client.messages.parse({
		model: "claude-haiku-4-5",
		system: SYSTEM_PROMPT.FETCHER_PROMPT,
		messages: [{ role: "user", content: `${prompt}` }],
		max_tokens: 1000,
		output_config: {
			format: zodOutputFormat(CompareResponseSchema),
		},
	});
	console.log("Claude Response OP:", JSON.stringify(response, null, 2));
	return response.parsed_output;
};
