const form = document.getElementById("chat-form");
const questionInput = document.getElementById("question");
const submitBtn = document.getElementById("submit-btn");
const loadingEl = document.getElementById("loading");
const openaiCard = document.getElementById("openai-response");
const geminiCard = document.getElementById("gemini-response");
const responsesSection = document.getElementById("responses");

function renderProviderCard(card, label, badgeClass, result) {
	const badge = card.querySelector("[data-badge]");
	const content = card.querySelector("[data-content]");

	badge.textContent = label;
	badge.className = `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`;

	if (result.ok) {
		content.className =
			"mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700";
		content.textContent = result.text ?? "No response returned.";
	} else {
		content.className =
			"mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700";
		content.textContent = result.error;
	}

	card.classList.remove("hidden");
}

function setLoading(isLoading) {
	submitBtn.disabled = isLoading;
	questionInput.disabled = isLoading;
	loadingEl.classList.toggle("hidden", !isLoading);
	submitBtn.textContent = isLoading ? "Asking..." : "Ask";
}

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const question = questionInput.value.trim();
	if (!question) return;

	setLoading(true);
	responsesSection.classList.remove("hidden");

	openaiCard.querySelector("[data-content]").textContent = "Waiting...";
	geminiCard.querySelector("[data-content]").textContent = "Waiting...";
	openaiCard.classList.remove("hidden");
	geminiCard.classList.remove("hidden");

	try {
		const response = await fetch("/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ question }),
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			const message = error.error ?? `Request failed (${response.status})`;
			renderProviderCard(
				openaiCard,
				"OpenAI",
				"bg-emerald-100 text-emerald-800",
				{
					ok: false,
					error: message,
				},
			);
			renderProviderCard(geminiCard, "Gemini", "bg-blue-100 text-blue-800", {
				ok: false,
				error: message,
			});
			return;
		}

		const data = await response.json();
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
		renderProviderCard(
			openaiCard,
			"OpenAI",
			"bg-emerald-100 text-emerald-800",
			{
				ok: false,
				error: message,
			},
		);
		renderProviderCard(geminiCard, "Gemini", "bg-blue-100 text-blue-800", {
			ok: false,
			error: message,
		});
	} finally {
		setLoading(false);
	}
});
