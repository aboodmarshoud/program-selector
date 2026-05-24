import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;
const dataDir = path.join(__dirname, "data");
const analyticsFile = path.join(dataDir, "analytics-events.json");

app.use(express.json({ limit: "256kb" }));

async function readEvents() {
  try {
    const content = await fs.readFile(analyticsFile, "utf8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeEvents(events) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(analyticsFile, JSON.stringify(events, null, 2));
}

function summarize(events) {
  const visitors = new Set(events.filter((item) => item.event === "visit").map((item) => item.sessionId));
  const starters = new Set(events.filter((item) => item.event === "quiz_started").map((item) => item.sessionId));
  const completers = new Set(events.filter((item) => item.event === "quiz_completed").map((item) => item.sessionId));
  const quizAbandoned = [...starters].filter((sessionId) => !completers.has(sessionId)).length;

  return {
    visitors: visitors.size,
    quizStarted: starters.size,
    quizCompleted: completers.size,
    quizAbandoned,
    completionRate: starters.size ? Math.round((completers.size / starters.size) * 100) : 0,
    events: events.slice(-100),
  };
}

app.post("/api/analytics", async (req, res) => {
  const event = req.body;
  const allowedEvents = new Set(["visit", "quiz_started", "quiz_completed"]);

  if (!event?.sessionId || !allowedEvents.has(event.event)) {
    res.status(400).json({ error: "Invalid analytics event" });
    return;
  }

  const events = await readEvents();
  events.push({
    sessionId: String(event.sessionId),
    event: event.event,
    path: String(event.path || "/"),
    timestamp: event.timestamp || new Date().toISOString(),
    resultProgramId: event.resultProgramId ? String(event.resultProgramId) : undefined,
    stepCount: Number.isFinite(event.stepCount) ? event.stepCount : undefined,
    rawAnswers: event.rawAnswers && typeof event.rawAnswers === "object" ? event.rawAnswers : undefined,
    readableAnswers: Array.isArray(event.readableAnswers) ? event.readableAnswers : undefined,
    recommendations: Array.isArray(event.recommendations) ? event.recommendations : undefined,
    profile: event.profile && typeof event.profile === "object" ? event.profile : undefined,
    context: event.context && typeof event.context === "object" ? event.context : undefined,
  });

  await writeEvents(events);
  res.status(204).end();
});

app.get("/api/analytics/summary", async (_req, res) => {
  const events = await readEvents();
  res.json(summarize(events));
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Program selector listening on port ${port}`);
});
