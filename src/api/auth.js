import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase.js";

async function authFetch(path, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function signUp(email, password, name) {
  return authFetch("signup", { email, password, data: { full_name: name } });
}
export async function signIn(email, password) {
  return authFetch("token?grant_type=password", { email, password });
}
export async function signOut(accessToken) {
  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}` },
  });
}
export async function signInWithGoogle() {
  const redirectTo = "https://trujillomiguelc.github.io/fittracker/";
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
}

export function saveSession(session) {
  localStorage.setItem("ft_session", JSON.stringify(session));
}
export function loadSession() {
  try { return JSON.parse(localStorage.getItem("ft_session")); } catch { return null; }
}
export function clearSession() {
  localStorage.removeItem("ft_session");
}

export function getSessionFromUrl() {
  try {
    const hash = window.location.hash;
    if (!hash) return null;
    const params = new URLSearchParams(hash.replace("#", ""));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    if (!access_token) return null;
    window.history.replaceState(null, "", window.location.pathname);
    return { access_token, refresh_token };
  } catch { return null; }
}

export async function verifyToken(access_token) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${access_token}` },
  });
  const user = await res.json();
  return user?.id ? user : null;
}

// Bug 1 fix: wipe profiles that predate the stack-based onboarding format
export function cleanLegacyProfile() {
  try {
    const raw = localStorage.getItem("ft_profile");
    if (!raw) return;
    const p = JSON.parse(raw);
    if (!p?.completedOnboarding || !p?.stack) {
      localStorage.removeItem("ft_profile");
    }
  } catch {
    localStorage.removeItem("ft_profile");
  }
}
