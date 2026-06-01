const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const analyticsOwnerEmail = import.meta.env.VITE_ANALYTICS_OWNER_EMAIL as string | undefined;

export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);
export const configuredAnalyticsOwnerEmail = analyticsOwnerEmail?.trim().toLowerCase() || "";

let supabaseClientPromise: Promise<any | null> | null = null;

export function isAnalyticsOwnerSession(session: any) {
  if (!configuredAnalyticsOwnerEmail) return Boolean(session);
  const sessionEmail = session?.user?.email?.trim().toLowerCase();
  return sessionEmail === configuredAnalyticsOwnerEmail;
}

export async function getSupabaseClient() {
  if (!isSupabaseEnabled) return null;

  supabaseClientPromise ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }),
  );

  return supabaseClientPromise;
}
