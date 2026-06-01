import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

type AnalyticsEventName = "visit" | "quiz_started" | "quiz_completed";

type AnalyticsEventPayload = {
  sessionId?: unknown;
  event?: unknown;
  path?: unknown;
  timestamp?: unknown;
  resultProgramId?: unknown;
  stepCount?: unknown;
  rawAnswers?: unknown;
  readableAnswers?: unknown;
  recommendations?: unknown;
  profile?: unknown;
  context?: unknown;
};

const allowedEvents = new Set<AnalyticsEventName>(["visit", "quiz_started", "quiz_completed"]);
const maxBodyBytes = 60_000;
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function cleanJson(value: unknown, maxChars: number) {
  if (value == null) return null;
  const serialized = JSON.stringify(value);
  if (!serialized || serialized.length > maxChars) return null;
  return JSON.parse(serialized);
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "";
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "";
}

function getTimestamp(value: unknown) {
  if (typeof value !== "string") return new Date().toISOString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  if (date.getTime() > now + 5 * 60 * 1000 || date.getTime() < now - oneDay) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > maxBodyBytes) return jsonResponse({ error: "Payload too large" }, 413);

  let payload: AnalyticsEventPayload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const sessionId = cleanString(payload.sessionId, 80);
  const event = cleanString(payload.event, 40) as AnalyticsEventName | null;
  if (!sessionId || !event || !allowedEvents.has(event)) {
    return jsonResponse({ error: "Invalid analytics event" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Analytics function is not configured" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const userAgent = req.headers.get("user-agent") || "";
  const fingerprintSalt = Deno.env.get("ANALYTICS_FINGERPRINT_SALT") || serviceRoleKey;
  const requestFingerprint = await sha256Hex(`${fingerprintSalt}:${getClientIp(req)}:${userAgent}`);
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60_000).toISOString();
  const oneHourAgo = new Date(now.getTime() - 60 * 60_000).toISOString();

  const [sessionMinute, sessionHour, fingerprintMinute, fingerprintHour] = await Promise.all([
    supabase.from("quiz_events").select("id", { count: "exact", head: true }).eq("session_id", sessionId).gte("created_at", oneMinuteAgo),
    supabase.from("quiz_events").select("id", { count: "exact", head: true }).eq("session_id", sessionId).gte("created_at", oneHourAgo),
    supabase.from("quiz_events").select("id", { count: "exact", head: true }).eq("request_fingerprint", requestFingerprint).gte("created_at", oneMinuteAgo),
    supabase.from("quiz_events").select("id", { count: "exact", head: true }).eq("request_fingerprint", requestFingerprint).gte("created_at", oneHourAgo),
  ]);

  if (
    (sessionMinute.count ?? 0) >= 8 ||
    (sessionHour.count ?? 0) >= 40 ||
    (fingerprintMinute.count ?? 0) >= 20 ||
    (fingerprintHour.count ?? 0) >= 160
  ) {
    return jsonResponse({ error: "Rate limit exceeded" }, 429);
  }

  const rawAnswers = isPlainObject(payload.rawAnswers) ? payload.rawAnswers : {};
  const row = {
    session_id: sessionId,
    event,
    path: cleanString(payload.path, 500) || "/",
    occurred_at: getTimestamp(payload.timestamp),
    result_program_id: cleanString(payload.resultProgramId, 120),
    step_count: typeof payload.stepCount === "number" && Number.isFinite(payload.stepCount) ? Math.trunc(payload.stepCount) : null,
    country: cleanString(rawAnswers.country, 120),
    gender: cleanString(rawAnswers.gender, 120),
    age: cleanString(rawAnswers.age, 120),
    raw_answers: cleanJson(payload.rawAnswers, 20_000),
    readable_answers: cleanJson(payload.readableAnswers, 20_000),
    recommendations: cleanJson(payload.recommendations, 20_000),
    profile: cleanJson(payload.profile, 10_000),
    context: cleanJson(payload.context, 10_000),
    request_fingerprint: requestFingerprint,
  };

  const { error } = await supabase.from("quiz_events").insert(row);
  if (error) {
    console.error("analytics insert failed", error);
    return jsonResponse({ error: "Analytics insert failed" }, 500);
  }

  return jsonResponse({ ok: true });
});
