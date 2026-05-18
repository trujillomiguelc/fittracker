import { useState, useEffect } from "react";

// ─── API ──────────────────────────────────────────────────────────────────────
import { saveSession, loadSession, clearSession, getSessionFromUrl, verifyToken, cleanLegacyProfile } from "./api/auth.js";
import { DB } from "./api/db.js";

// ─── UTILS ────────────────────────────────────────────────────────────────────
import { todayStr, calcTDEE } from "./utils/helpers.js";
import { initData, saveData, saveProfile, loadProfile } from "./utils/storage.js";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
import { TOP_TABS, GOALS, PROTEIN_TARGET, GOAL_OPTIONS } from "./constants/index.js";

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
import AuthScreen from "./components/AuthScreen.jsx";
import OnboardingScreen from "./components/OnboardingScreen.jsx";
import ProfileScreen from "./components/ProfileScreen.jsx";
import TodayTab from "./components/TodayTab.jsx";
import NutritionTab from "./components/NutritionTab.jsx";
import WorkoutTab from "./components/WorkoutTab.jsx";
import ProgressTab from "./components/ProgressTab.jsx";
import HistoryTab from "./components/HistoryTab.jsx";
import { Icon } from "./components/ui/index.jsx";

// ─── PROGRAM BUILDER ─────────────────────────────────────────────────────────
// (kept here since it depends on DEFAULT_PROGRAM data; could be moved to constants/programs.js)
import { buildProgram } from "./constants/programs.js";

// ════════════════════════════════════════════════════════════════════════════
// ROOT — handles auth check (spinner → auth screen → app)
// ════════════════════════════════════════════════════════════════════════════
export default function FitTracker() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Bug 1 fix: wipe profiles that predate the stack-based onboarding format
    cleanLegacyProfile();

    async function checkAuth() {
      // 1. OAuth callback in URL hash
      const urlSession = getSessionFromUrl();
      if (urlSession) {
        const user = await verifyToken(urlSession.access_token);
        if (user) {
          const s = { ...urlSession, user };
          saveSession(s);
          setSession(s);
          setChecking(false);
          return;
        }
      }

      // 2. Saved session in localStorage
      const saved = loadSession();
      if (saved?.access_token) {
        const user = await verifyToken(saved.access_token);
        if (user) {
          setSession({ ...saved, user });
          setChecking(false);
          return;
        }
        // Token invalid — clear it and fall through to AuthScreen
        clearSession();
      }

      setChecking(false);
    }
    checkAuth();
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0D", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(255,107,53,0.2)", borderTopColor: "#FF6B35", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onAuth={s => { saveSession(s); setSession(s); }} />;
  }

  return <FitTrackerApp session={session} onSignOut={() => { clearSession(); setSession(null); }} />;
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP — all hooks run unconditionally, onboarding check AFTER hooks
// ════════════════════════════════════════════════════════════════════════════
function FitTrackerApp({ session, onSignOut }) {
  // userId flows cleanly from session into all DB calls
  const userId = session?.user?.id || "miguel";

  const [tab, setTab] = useState("today");
  const [data, setData] = useState(initData);
  const [dbLoaded, setDbLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => todayStr());
  const [showProfile, setShowProfile] = useState(false);

  // Profile state — null = needs onboarding
  const [profile, setProfile] = useState(() => {
    const p = loadProfile();
    // Reject old profiles without the stack-based onboarding format
    if (p && (!p.completedOnboarding || !p.stack)) return null;
    return p;
  });

  // ── ALL HOOKS MUST RUN BEFORE ANY CONDITIONAL RETURN ──────────────────────

  // Load from Supabase on mount
  useEffect(() => {
    DB.loadAll(userId).then(dbData => {
      if (dbData) {
        setData(prev => {
          const merged = JSON.parse(JSON.stringify(prev));
          Object.entries(dbData.calorieLog).forEach(([date, entries]) => {
            const existing = merged.calorieLog[date] || [];
            const existingIds = new Set(existing.map(e => e.id));
            merged.calorieLog[date] = [...existing, ...entries.filter(e => !existingIds.has(e.id))];
          });
          const sessionIds = new Set(merged.sessions.map(s => s.id));
          dbData.sessions.forEach(s => { if (!sessionIds.has(s.id)) merged.sessions.push(s); });
          Object.entries(dbData.prs).forEach(([k, v]) => {
            if (!merged.prs[k] || v.weight > merged.prs[k].weight) merged.prs[k] = v;
          });
          merged.goalMode = dbData.goalMode || merged.goalMode;
          return merged;
        });
      }
      setDbLoaded(true);
    });
  }, [userId]);

  // Push seed/localStorage data to Supabase once on first load
  useEffect(() => {
    if (!dbLoaded) return;
    ["2026-04-30","2026-05-01","2026-05-02","2026-05-03","2026-05-04","2026-05-05","2026-05-06"].forEach(date => {
      (data.calorieLog[date] || []).forEach(e => DB.upsertCalorieEntry(userId, e, date));
    });
    data.sessions.forEach(s => DB.upsertSession(userId, s));
    Object.entries(data.prs).forEach(([exId, pr]) => DB.upsertPR(userId, exId, pr.weight, pr.date));
  }, [dbLoaded]);

  // Keep date current (re-check every minute + on window focus)
  useEffect(() => {
    const tick = setInterval(() => setCurrentDate(todayStr()), 60000);
    const onFocus = () => setCurrentDate(todayStr());
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(tick); window.removeEventListener("focus", onFocus); };
  }, []);

  // ── CONDITIONAL RETURN AFTER ALL HOOKS ────────────────────────────────────
  // Bug 2 fix: this return is AFTER all hooks, not before any useEffect
  if (!profile) {
    return (
      <OnboardingScreen
        onComplete={p => { saveProfile(p); setProfile(p); }}
        existingProfile={null}
      />
    );
  }

  // Build dynamic program from profile
  const PROGRAM = buildProgram(profile.goal, profile.trainingDays);

  // ── LOCAL STATE HELPERS ───────────────────────────────────────────────────
  function update(fn) {
    setData(prev => { const next = fn(prev); saveData(next); return next; });
  }

  // DB-synced helpers — write to both local state and Supabase
  function addFoodEntry(date, entry) {
    update(prev => ({ ...prev, calorieLog: { ...prev.calorieLog, [date]: [...(prev.calorieLog[date]||[]), entry] } }));
    DB.upsertCalorieEntry(userId, entry, date);
  }
  function deleteFoodEntry(date, id) {
    update(prev => ({ ...prev, calorieLog: { ...prev.calorieLog, [date]: (prev.calorieLog[date]||[]).filter(e => e.id !== id) } }));
    DB.deleteCalorieEntry(userId, id);
  }
  function addWorkoutSession(session) {
    update(prev => ({ ...prev, sessions: [...prev.sessions, session] }));
    DB.upsertSession(userId, session);
  }
  function removeWorkoutSession(id) {
    update(prev => ({ ...prev, sessions: prev.sessions.filter(s => s.id !== id) }));
    DB.deleteSession(userId, id);
  }
  function savePRs(newPrs) {
    update(prev => ({ ...prev, prs: { ...prev.prs, ...newPrs } }));
    Object.entries(newPrs).forEach(([exId, pr]) => DB.upsertPR(userId, exId, pr.weight, pr.date));
  }

  // Derived today values
  const todayEntries = data.calorieLog[currentDate] || [];
  const todayCal     = todayEntries.reduce((s, e) => s + (e.calories || 0), 0);
  const todayProtein = todayEntries.reduce((s, e) => s + (e.protein  || 0), 0);
  const goal = {
    calMin:     profile.calMin     || 1900,
    calMax:     profile.calMax     || 2100,
    proteinMin: profile.proteinMin || 140,
    proteinMax: profile.proteinMax || 160,
  };
  const goalMid = Math.round((goal.calMin + goal.calMax) / 2);

  return (
    <div style={{ minHeight: "100vh", background: "#0C0C0F", color: "#F0EDE8", fontFamily: "'DM Sans','Segoe UI',sans-serif", maxWidth: 860, margin: "0 auto", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg,#1a0d22 0%,#0C0C0F 100%)", padding: "22px 20px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#FF6B35,#FF3CAC)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="target" size={18} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.5 }}>Body Recomp Hub</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>
                {profile.weight}lb · {goal.calMin}–{goal.calMax} cal · {goal.proteinMin}–{goal.proteinMax}g protein · {currentDate}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <button onClick={() => setShowProfile(true)} style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B35, #FF3CAC)", border: "2px solid rgba(255,255,255,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", boxShadow: "0 4px 12px rgba(255,107,53,0.3)" }}>
              {profile?.name?.[0]?.toUpperCase() || "👤"}
            </button>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#FF3CAC", fontFamily: "monospace" }}>{todayCal}</div>
              <div style={{ fontSize: 10, color: "#555" }}>cal today</div>
            </div>
            <button onClick={() => { if (confirm("Clear all cached data and reload fresh?")) { localStorage.clear(); window.location.reload(); } }}
              style={{ marginTop: 3, background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#444", fontSize: 9, padding: "2px 7px", cursor: "pointer", fontFamily: "inherit" }}>
              RESET
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 1 }}>
          {TOP_TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? "linear-gradient(135deg,#FF6B35,#FF3CAC)" : "transparent",
              border: "none", color: tab === t.id ? "#fff" : "#555",
              padding: "8px 12px", borderRadius: "10px 10px 0 0", cursor: "pointer",
              fontSize: 12, fontWeight: tab === t.id ? 700 : 500, whiteSpace: "nowrap",
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5,
            }}>
              <Icon name={t.icon} size={13} color={tab === t.id ? "#fff" : "#555"} strokeWidth={2} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {showProfile && (
          <ProfileScreen
            profile={profile}
            onUpdate={p => setProfile(p)}
            onClose={() => setShowProfile(false)}
            onSignOut={onSignOut}
            data={data}
            session={session}
          />
        )}
        {tab === "today"     && <TodayTab     program={PROGRAM} currentDate={currentDate} data={data} update={update} addFood={addFoodEntry} deleteFood={deleteFoodEntry} goal={goal} goalMid={goalMid} todayCal={todayCal} todayProtein={todayProtein} todayEntries={todayEntries} />}
        {tab === "nutrition" && <NutritionTab currentDate={currentDate} data={data} update={update} addFood={addFoodEntry} deleteFood={deleteFoodEntry} goal={goal} />}
        {tab === "workout"   && <WorkoutTab   program={PROGRAM} currentDate={currentDate} data={data} update={update} addSession={addWorkoutSession} removeSession={removeWorkoutSession} savePRs={savePRs} />}
        {tab === "progress"  && <ProgressTab  program={PROGRAM} currentDate={currentDate} data={data} goal={goal} />}
        {tab === "history"   && <HistoryTab   program={PROGRAM} currentDate={currentDate} data={data} update={update} removeSession={removeWorkoutSession} goal={goal} />}
      </div>
    </div>
  );
}
