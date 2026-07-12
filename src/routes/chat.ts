import { Hono } from "hono";
import { geminiServices, openAIServices } from "../services/index.ts";

type ProviderResult =
	| { ok: true; text: string | null }
	| { ok: false; error: string };

function formatResult(result: PromiseSettledResult<string | null>): ProviderResult {
	if (result.status === "fulfilled") {
		return { ok: true, text: result.value };
	}
	const error =
		result.reason instanceof Error
			? result.reason.message
			: String(result.reason);
	return { ok: false, error };
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

	return c.json({
		openai: formatResult(openAIResponse),
		gemini: formatResult(geminiResponse),
	});
});
