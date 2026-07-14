const form = document.getElementById("chat-form");
const questionInput = document.getElementById("question");
const submitBtn = document.getElementById("submit-btn");
const loadingEl = document.getElementById("loading");
const finalOutputCard = document.getElementById("final-output");
const openaiCard = document.getElementById("openai-response");
const geminiCard = document.getElementById("gemini-response");
const responsesSection = document.getElementById("responses");

function getAnswer(text) {
	if (text && typeof text === "object" && typeof text.answer === "string") {
		return text.answer;
	}
	return "No response returned.";
}

function renderFinalOutput(claude) {
	const content = finalOutputCard.querySelector("[data-content]");

	if (claude && typeof claude.answer === "string") {
		content.className =
			"whitespace-pre-wrap text-sm leading-relaxed text-slate-800";
		content.textContent = claude.answer;
	} else {
		content.className =
			"rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700";
		content.textContent = "No final answer returned.";
	}

	finalOutputCard.classList.remove("hidden");
}

function renderFinalOutputError(message) {
	const content = finalOutputCard.querySelector("[data-content]");
	content.className = "rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700";
	content.textContent = message;
	finalOutputCard.classList.remove("hidden");
}

function renderProviderCard(card, label, badgeClass, result) {
	const badge = card.querySelector("[data-badge]");
	const content = card.querySelector("[data-content]");

	badge.textContent = label;
	badge.className = `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`;

	if (result.ok) {
		content.className =
			"border-t border-slate-200 px-4 py-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700";
		content.textContent = getAnswer(result.text);
	} else {
		content.className =
			"border-t border-slate-200 px-4 py-3 text-sm text-red-700";
		content.innerHTML = "";
		const errorBox = document.createElement("div");
		errorBox.className = "rounded-lg bg-red-50 px-3 py-2";
		errorBox.textContent = result.error;
		content.appendChild(errorBox);
	}

	card.open = false;
	card.classList.remove("hidden");
}

function setLoading(isLoading) {
	submitBtn.disabled = isLoading;
	questionInput.disabled = isLoading;
	loadingEl.classList.toggle("hidden", !isLoading);
	submitBtn.textContent = isLoading ? "Asking..." : "Ask";
}

function resetResponseUi() {
	responsesSection.classList.remove("hidden");

	const finalContent = finalOutputCard.querySelector("[data-content]");
	finalContent.className = "text-sm text-slate-500";
	finalContent.textContent = "Waiting...";
	finalOutputCard.classList.remove("hidden");

	for (const card of [openaiCard, geminiCard]) {
		const content = card.querySelector("[data-content]");
		content.className =
			"border-t border-slate-200 px-4 py-3 text-sm text-slate-500";
		content.textContent = "Waiting...";
		card.open = false;
		card.classList.remove("hidden");
	}
}

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const question = questionInput.value.trim();
	if (!question) return;

	setLoading(true);
	resetResponseUi();

	try {
		const response = await fetch("/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ question }),
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			const message = error.error ?? `Request failed (${response.status})`;
			renderFinalOutputError(message);
			renderProviderCard(
				openaiCard,
				"OpenAI",
				"bg-emerald-100 text-emerald-800",
				{ ok: false, error: message },
			);
			renderProviderCard(geminiCard, "Gemini", "bg-blue-100 text-blue-800", {
				ok: false,
				error: message,
			});
			return;
		}

		const data = await response.json();
		renderFinalOutput(data.claude);
		renderProviderCard(
			openaiCard,
			"OpenAI",
			"bg-emerald-100 text-emerald-800",
			data.openai,
		);
		renderProviderCard(
			geminiCard,
			"Gemini",
			"bg-blue-100 text-blue-800",
			data.gemini,
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		renderFinalOutputError(message);
		renderProviderCard(
			openaiCard,
			"OpenAI",
			"bg-emerald-100 text-emerald-800",
			{ ok: false, error: message },
		);
		renderProviderCard(geminiCard, "Gemini", "bg-blue-100 text-blue-800", {
			ok: false,
			error: message,
		});
	} finally {
		setLoading(false);
	}
});
