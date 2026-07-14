import { z } from "zod";

export const StructuredResponseSchema = z.object({
	answer: z.string().describe("The answer to the question"),
	techStack: z
		.array(z.string())
		.describe("The question related to which tech stack"),
});

export const CompareResponseSchema = z.object({
	answer: z.string().describe("The answer to the question"),
	techStack: z
		.array(z.string())
		.describe("The question related to which tech stack"),
	winner: z
		.enum(["openai", "gemini", "both"])
		.describe("The winner of the comparison"),
	reasoning: z
		.string()
		.describe("One or two sentences explaining why this answer was chosen"),
});

export type CompareResponse = z.infer<typeof CompareResponseSchema>;
export type StructuredResponse = z.infer<typeof StructuredResponseSchema>;

export const StructuredResponseJsonSchema: z.core.JSONSchema.JSONSchema = {
	type: "object",
	properties: {
		answer: {
			type: "string",
			description: "The answer to the question",
		},
		techStack: {
			type: "array",
			items: { type: "string" },
			description: "The question related to which tech stack",
		},
	},
	required: ["answer", "techStack"],
};

export type ProviderResponse<T> = T | null;
