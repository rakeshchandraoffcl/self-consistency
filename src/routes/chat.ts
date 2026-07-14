import { Hono } from "hono";
import {
	claudeServices,
	geminiServices,
	openAIServices,
} from "../services/index.ts";
import {
	type ProviderResponse,
	type StructuredResponse,
} from "../types/index.ts";

type ProviderResult =
	| { ok: true; text: ProviderResponse<StructuredResponse> }
	| { ok: false; error: string };

function formatResult(
	result: PromiseSettledResult<ProviderResponse<StructuredResponse>>,
): ProviderResult {
	if (result.status === "fulfilled") {
		return { ok: true, text: result.value };
	}
	const error =
		result.reason instanceof Error
			? result.reason.message
			: String(result.reason);
	return { ok: false, error };
}

function getResponseValue(
	result: PromiseSettledResult<ProviderResponse<StructuredResponse>>,
) {
	if (result.status === "fulfilled") {
		return result.value;
	}
	return null;
}

export const chatRoutes = new Hono();

chatRoutes.post("/", async (c) => {
	const body = await c.req.json<{ question?: string }>();
	const question = body.question?.trim();

	if (!question) {
		return c.json({ error: "Question is required" }, 400);
	}

	const [openAIResponse, geminiResponse] = await Promise.allSettled([
		openAIServices.getOpenAIResponse(question),
		geminiServices.getGeminiResponse(question),
	]);

	const openAIValue = getResponseValue(openAIResponse);
	const geminiValue = getResponseValue(geminiResponse);

	if (!openAIValue || !geminiValue) {
		return c.json({ error: "Failed to get response from models" }, 500);
	}

	const compareResponse = await claudeServices.getClaudeResponse(
		JSON.stringify({
			question,
			openAI: openAIValue,
			gemini: geminiValue,
		}),
	);
	return c.json({
		openai: formatResult(openAIResponse),
		gemini: formatResult(geminiResponse),
		claude: compareResponse,
	});
});
