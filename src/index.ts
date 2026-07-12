import "./load-env.ts";
import readline from "node:readline";
import { geminiServices, openAIServices } from "./services/index.ts";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

console.log("=================================");
console.log("      AI Terminal Chat");
console.log("Type 'quit' to quit");
console.log("=================================\n");

function chat() {
	rl.question("Ask your question: ", async (prompt) => {
		if (prompt?.trim().toLowerCase() === "quit") {
			rl.close();
			return;
		}
		try {
			const question = prompt?.trim();
			const [openAIResponse, geminiResponse] = await Promise.allSettled([
				openAIServices.getOpenAIResponse(question),
				geminiServices.getGeminiResponse(question),
			]);
			if (openAIResponse.status === "fulfilled") {
				console.log("OpenAI Response:", openAIResponse.value);
			} else {
				console.error("OpenAI Error:", openAIResponse.reason);
			}
			if (geminiResponse.status === "fulfilled") {
				console.log("Gemini Response:", geminiResponse.value);
			} else {
				console.error("Gemini Error:", geminiResponse.reason);
			}
		} catch (error) {
			console.error("Error:", error);
		}
		chat();
	});
}

chat();
