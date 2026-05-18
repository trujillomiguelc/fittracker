import { useState } from "react";
import { calcTDEE } from "../utils/helpers.js";
import { saveProfile } from "../utils/storage.js";
import { GOAL_OPTIONS, ACTIVITY_LEVELS } from "../constants/index.js";
import OnboardingScreen from "./OnboardingScreen.jsx";

// ═══════════════════════════════════════════════════════════════
// PROFILE SCREEN
// ═══════════════════════════════════════════════════════════════
function ProfileScreen({ profile, onUpdate, onClose, data, session }) {
  const [editing, setEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(profile);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const sessionCount = data.sessions.filter(s => s.dayIndex >= 0).length;
  const showWeightCheckIn = sessionCount >= 7 && !profile.currentWeightDate;

  function save() {
    const targets = editProfile.customTargets ? editProfile : calcTDEE(editProfile);
    const updated = { ...editProfile, ...targets };
    saveProfile(updated);
    onUpdate(updated);
    setEditing(false);
  }

  const statStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px" };
  const inputStyle = { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", fontSize: 14, fontFamily: "inherit", color: "#F0EDE8", outline: "none" };
  const labelStyle = { fontSize: 11, color: "#555", display: "block", marginBottom: 4, fontWeight: 600 };

  if (showOnboarding) return <OnboardingScreen existingProfile={profile} onComplete={p => { onUpdate(p); setShowOnboarding(false); }} />;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0C0C0F", zIndex: 1000, overflow: "auto", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 20px" }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, color: "#F0EDE8", padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 14 }}>
            ← Back
          </button>
          <div style={{ fontSize: 16, fontWeight: 800 }}>My Profile</div>
          <button onClick={() => setEditing(e => !e)} style={{ background: editing ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${editing ? "#FF6B35" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, color: editing ? "#FF6B35" : "#F0EDE8", padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 14 }}>
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* Avatar + Name */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B35, #FF3CAC)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 32 }}>
            {profile.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#F0EDE8" }}>{profile.name || "Your Name"}</div>
          <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{session?.user?.email}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, padding: "5px 14px", borderRadius: 99, background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.2)" }}>
            <span style={{ fontSize: 14 }}>{GOAL_OPTIONS.find(g => g.id === profile.goal)?.emoji}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#FF6B35" }}>{GOAL_OPTIONS.find(g => g.id === profile.goal)?.label}</span>
          </div>
        </div>

        {/* Weight check-in prompt */}
        {showWeightCheckIn && (
          <div style={{ padding: "16px", borderRadius: 16, background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.25)", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#00D4AA", marginBottom: 6 }}>⏱ Time for your first check-in!</div>
            <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>You've completed {sessionCount} workouts. How much do you weigh today?</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" placeholder={profile.startWeight} style={{ ...inputStyle, flex: 1 }}
                onKeyDown={e => { if (e.key === "Enter") {
                  const updated = { ...profile, currentWeight: e.target.value, currentWeightDate: new Date().toISOString().split("T")[0] };
                  saveProfile(updated); onUpdate(updated);
                }}} />
              <span style={{ display: "flex", alignItems: "center", color: "#555", fontSize: 13 }}>lbs</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            ["Starting Weight", `${profile.startWeight || "—"} lbs`],
            ["Current Weight",  `${profile.currentWeight || profile.startWeight || "—"} lbs`],
            ["Height",          `${profile.heightFt || "—"}'${profile.heightIn || "0"}"`],
            ["Age",             `${profile.age || "—"} yrs`],
          ].map(([label, val]) => (
            <div key={label} style={statStyle}>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 4, fontWeight: 600 }}>{label.toUpperCase()}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#F0EDE8" }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Targets */}
        <div style={{ ...statStyle, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 12, fontWeight: 600 }}>DAILY TARGETS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: "rgba(255,107,53,0.08)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#FF6B35", fontWeight: 700 }}>CALORIES</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#F0EDE8", marginTop: 2 }}>{profile.calMin}–{profile.calMax}</div>
            </div>
            <div style={{ background: "rgba(120,76,244,0.08)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#784CF4", fontWeight: 700 }}>PROTEIN</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#F0EDE8", marginTop: 2 }}>{profile.proteinMin}–{profile.proteinMax}g</div>
            </div>
          </div>
        </div>

        {/* Training info */}
        <div style={{ ...statStyle, marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 12, fontWeight: 600 }}>TRAINING</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><div style={{ fontSize: 11, color: "#555" }}>Days/week</div><div style={{ fontSize: 18, fontWeight: 800, color: "#F0EDE8" }}>{profile.trainingDays}</div></div>
            <div><div style={{ fontSize: 11, color: "#555" }}>Activity</div><div style={{ fontSize: 14, fontWeight: 700, color: "#F0EDE8" }}>{ACTIVITY_LEVELS.find(a => a.id === profile.activityLevel)?.label}</div></div>
            <div><div style={{ fontSize: 11, color: "#555" }}>Sessions done</div><div style={{ fontSize: 18, fontWeight: 800, color: "#00D4AA" }}>{sessionCount}</div></div>
          </div>
        </div>

        {/* Recalculate / redo onboarding */}
        <button onClick={() => setShowOnboarding(true)} style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, color: "#888", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
          ↺ Update my stats & goals
        </button>

        {editing && (
          <button onClick={save} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #FF6B35, #FF3CAC)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}

