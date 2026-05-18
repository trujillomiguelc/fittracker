export const SUPABASE_URL = "https://pawkfpvalnoqqfgjivjs.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhd2tmcHZhbG5vcXFmZ2ppdmpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzQ3NzcsImV4cCI6MjA5MzY1MDc3N30.0qMDXw88HMfnDHDcO0SyhbuXE7ykQIsLgrsZ8RQFEPQ";

export function getAuthHeaders(token) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
  };
}

export async function sbFetch(path, options = {}, token = null) {
  const { prefer, headers: extraHeaders, body, method } = options;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: method || "GET",
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "application/json",
      Prefer: prefer || "return=minimal",
      ...extraHeaders,
    },
    ...(body ? { body } : {}),
  });
  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    console.error("Supabase error:", err);
    return null;
  }
  if (res.status === 204) return null;
  return res.json().catch(() => null);
}
