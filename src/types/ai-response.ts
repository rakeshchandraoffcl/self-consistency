import { z } from "zod";

export const StructuredResponseSchema = z.object({
	answer: z.string(),
	sources: z.array(z.string()),
});

export type StructuredResponse = z.infer<typeof StructuredResponseSchema>;

export const StructuredResponseJsonSchema: z.core.JSONSchema.JSONSchema = {
	type: "object",
	properties: {
		answer: {
			type: "string",
		},
		sources: {
			type: "array",
			items: { type: "string" },
		},
	},
	required: ["answer", "sources"],
};

export type ProviderResponse<T> = T | null;
