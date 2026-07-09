import dotenv from "dotenv";
import readline from "node:readline";

dotenv.config();

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
		const question = prompt?.trim();
		if (question === "Hi") {
			console.log("Hello! How can I help you today?");
			return chat();
		}
	});
}

chat();
