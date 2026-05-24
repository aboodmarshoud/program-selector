import { isSupabaseEnabled, supabase } from "./supabaseClient";

export type AnalyticsEventName = "visit" | "quiz_started" | "quiz_completed";

export type AnalyticsEventPayload = {
  sessionId: string;
  event: AnalyticsEventName;
  path: string;
  timestamp: string;
  resultProgramId?: string;
  stepCount?: number;
  rawAnswers?: Record<string, unknown>;
  readableAnswers?: Array<{
    id: string;
    title: string;
    value: unknown;
    label: string;
  }>;
  recommendations?: Array<{
    id: string;
    name: string;
    score?: number;
    badge?: string;
  }>;
  profile?: Record<string, unknown>;
  context?: {
    referrer: string;
    language: string;
    userAgent: string;
    viewport: string;
  };
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
const TABLE_NAME = "quiz_events";

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

function eventToRow(event: AnalyticsEventPayload) {
  const rawAnswers = event.rawAnswers || {};
  return {
    session_id: event.sessionId,
    event: event.event,
    path: event.path,
    occurred_at: event.timestamp,
    result_program_id: event.resultProgramId || null,
    step_count: event.stepCount || null,
    country: typeof rawAnswers.country === "string" ? rawAnswers.country : null,
    gender: typeof rawAnswers.gender === "string" ? rawAnswers.gender : null,
    age: typeof rawAnswers.age === "string" ? rawAnswers.age : null,
    raw_answers: event.rawAnswers || null,
    readable_answers: event.readableAnswers || null,
    recommendations: event.recommendations || null,
    profile: event.profile || null,
    context: event.context || null,
  };
}

function rowToEvent(row: any): AnalyticsEventPayload {
  return {
    sessionId: row.session_id,
    event: row.event,
    path: row.path,
    timestamp: row.occurred_at || row.created_at,
    resultProgramId: row.result_program_id || undefined,
    stepCount: row.step_count || undefined,
    rawAnswers: row.raw_answers || undefined,
    readableAnswers: row.readable_answers || undefined,
    recommendations: row.recommendations || undefined,
    profile: row.profile || undefined,
    context: row.context || undefined,
  };
}

export async function getAnalyticsSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signInToAnalytics(email: string) {
  if (!supabase) throw new Error("Supabase is not configured");
  const configuredRedirect = import.meta.env.VITE_AUTH_REDIRECT_URL as string | undefined;
  const redirectTo = configuredRedirect || `${window.location.origin}${window.location.pathname}?analytics=1`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
}

export async function signOutFromAnalytics() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function loadAnalyticsSummary(): Promise<AnalyticsSummary> {
  if (supabase) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("occurred_at", { ascending: true })
      .limit(5000);

    if (!error && data) return summarizeAnalytics(data.map(rowToEvent));
  }

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

  if (isSupabaseEnabled && supabase) {
    supabase.from(TABLE_NAME).insert(eventToRow(payload)).then(({ error }) => {
      if (error) console.warn("Supabase analytics insert failed", error.message);
    });
  }

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
