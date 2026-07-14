# RefineChat

Ask a coding or engineering question and get one refined final answer.

RefineChat queries **OpenAI** and **Gemini** in parallel, then uses **Claude** to compare those responses and produce a clearer, more accurate final answer. The focus is the refined reply you see first — not which model “won.”

## How it works

1. You submit a question through the chat UI.
2. OpenAI and Gemini each produce a structured answer (content + related tech stack).
3. Claude evaluates both responses and either selects the stronger one or synthesizes a better combined answer.
4. The UI highlights the **final answer**, with optional expandable views of each model’s raw response.

This follows a self-consistency style approach: multiple independent answers → one refined result.

## Stack

- **Runtime:** Node.js + TypeScript
- **Server:** [Hono](https://hono.dev/)
- **Models:** OpenAI, Google Gemini, Anthropic Claude
- **Validation:** Zod structured outputs
- **UI:** Static HTML + Tailwind CSS

## Prerequisites

- Node.js 20+
- API keys for:
  - OpenAI
  - Google Gemini
  - Anthropic Claude

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

```env
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key
```

## Run

Development (server + Tailwind watch):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build and start:

```bash
npm start
```

Optional: set `PORT` in the environment (defaults to `3000`).

## Docker

With `.env` filled in:

```bash
docker compose up --build
```

Or without Compose:

```bash
docker build -t refinechat .
docker run -p 3000:3000 --env-file .env refinechat
```

Open [http://localhost:3000](http://localhost:3000).

## API

### `POST /api/chat`

Request body:

```json
{
  "question": "How does React reconciliation work?"
}
```

Response shape (simplified):

```json
{
  "openai": { "ok": true, "text": { "answer": "...", "techStack": ["React"] } },
  "gemini": { "ok": true, "text": { "answer": "...", "techStack": ["React"] } },
  "claude": {
    "answer": "...",
    "techStack": ["React"],
    "winner": "openai" | "gemini" | "both",
    "reasoning": "..."
  }
}
```

`claude` is the refined final answer shown in the UI. `winner` / `reasoning` are internal comparison metadata.

## Project structure

```
src/
  index.ts              # Hono server + static UI
  routes/chat.ts        # Parallel fetch + refine pipeline
  services/             # OpenAI, Gemini, Claude clients
  types/                # Zod schemas for structured responses
  utils/constant.ts     # System prompts
public/                 # Chat UI
```

## Scope

RefineChat is tuned for **coding and engineering** questions. Off-topic prompts may be declined or scored poorly by the models’ system instructions.

## License

ISC
