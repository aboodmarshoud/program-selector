export type AnalyticsEventName = "visit" | "quiz_started" | "quiz_completed";

export type AnalyticsEventPayload = {
  sessionId: string;
  event: AnalyticsEventName;
  path: string;
  timestamp: string;
  resultProgramId?: string;
  stepCount?: number;
};

export type AnalyticsSummary = {
  visitors: number;
  quizStarted: number;
  quizCompleted: number;
  quizAbandoned: number;
  completionRate: number;
  events: AnalyticsEventPayload[];
};

const SESSION_KEY = "program_selector_session_id";
const LOCAL_EVENTS_KEY = "program_selector_analytics_events";

function getSessionId() {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function readLocalEvents(): AnalyticsEventPayload[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_EVENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalEvent(event: AnalyticsEventPayload) {
  const events = readLocalEvents();
  events.push(event);
  localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events.slice(-1000)));
}

export function summarizeAnalytics(events: AnalyticsEventPayload[]): AnalyticsSummary {
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
    events,
  };
}

export async function loadAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    const response = await fetch("/api/analytics/summary", { cache: "no-store" });
    if (response.ok) return response.json();
  } catch {
    // Static hosting fallback: show the data collected in this browser.
  }

  return summarizeAnalytics(readLocalEvents());
}

export function trackAnalyticsEvent(event: AnalyticsEventName, details: Partial<AnalyticsEventPayload> = {}) {
  const payload: AnalyticsEventPayload = {
    sessionId: getSessionId(),
    event,
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
    ...details,
  };

  saveLocalEvent(payload);

  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
