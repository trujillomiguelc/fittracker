import { APRIL_30, MAY_1, MAY_2, MAY_3, MAY_4, MAY_5, MAY_1_WORKOUT } from "../constants/seedData.js";

const STORAGE_KEY = "fittracker_clean_v1";

export function loadData() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
export function saveData(d) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {}
}

export function loadProfile() {
  try { return JSON.parse(localStorage.getItem("ft_profile")); } catch { return null; }
}
export function saveProfile(p) { localStorage.setItem("ft_profile", JSON.stringify(p)); }

function seedDate(base, date, entries) {
  if (!entries || entries.length === 0) return;
  const existing = base.calorieLog[date] || [];
  const existingIds = new Set(existing.map(e => e.id));
  const toAdd = entries.filter(e => !existingIds.has(e.id));
  if (toAdd.length > 0) base.calorieLog[date] = [...existing, ...toAdd];
}

export function initData() {
  const saved = loadData();
  const base = saved || { calorieLog: {}, goalMode: "gluteBuilding", customGoal: null, sessions: [], prs: {} };
  seedDate(base, "2026-04-30", APRIL_30);
  seedDate(base, "2026-05-01", MAY_1);
  seedDate(base, "2026-05-02", MAY_2);
  seedDate(base, "2026-05-03", MAY_3);
  seedDate(base, "2026-05-04", MAY_4);
  seedDate(base, "2026-05-05", MAY_5);
  if (!base.sessions.some(s => s.id === 5001)) {
    base.sessions = [MAY_1_WORKOUT, ...base.sessions];
  }
  saveData(base);
  return base;
}
