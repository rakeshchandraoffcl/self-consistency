import "./load-env.ts";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { chatRoutes } from "./routes/chat.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");
const port = Number(process.env.PORT) || 3000;

const app = new Hono();

app.route("/api/chat", chatRoutes);
app.use("/*", serveStatic({ root: publicDir }));
app.get("/", serveStatic({ path: "index.html", root: publicDir }));

serve({ fetch: app.fetch, port }, () => {
	console.log(`Server running at http://localhost:${port}`);
});
