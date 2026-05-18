import { useState } from "react";
import { logFoodSmart } from "../api/nutrition.js";
import { MEAL_SLOTS, PROTEIN_TARGET } from "../constants/index.js";
import { Icon, Card, Ring, DateBar } from "./ui/index.jsx";
import MealSection from "./MealSection.jsx";

function TodayTab({ program: PROGRAM, currentDate, data, update, goal, goalMid, todayCal, todayProtein, todayEntries }) {
  const [aiInput, setAiInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [meal, setMeal] = useState("Breakfast");
  const goalMin = goal.calMin || 1900, goalMax = goal.calMax || 2100;
  const remaining = goalMid - todayCal;
  const todayWorkout = data.sessions.filter(s => s.date === currentDate && s.dayIndex >= 0);

   async function logFood() {
     if (!aiInput.trim()) return;
     setLoading(true);
     try {
       const result = await logFoodSmart(aiInput);
       if (!result) { alert("Couldn't recognize that food. Try: '2 eggs' or '100g chicken breast'"); setLoading(false); return; }
       const items = result.items || [result];
       const groupId = items.length > 1 ? `grp_${Date.now()}` : null;
       const newEntries = items.map((item, i) => ({ id: Date.now() + i, meal, groupId, ...item }));
       // DB-synced via addFood prop
       newEntries.forEach(e => addFood(currentDate, e));
       setAiInput("");
     } catch { alert("Couldn't parse — try being more specific!"); }
     setLoading(false);
   }

  return (
    <div>
      <DateBar date={currentDate} onChange={() => {}} />
      {todayEntries.length === 0 && (
        <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 12, background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "#FF6B35" }}>No data for today? Clear stale cache.</div>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ background: "#FF6B35", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 800, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>Reset</button>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 20 }}>
        <div style={{ textAlign: "center" }}>
          <Ring value={todayCal} max={goalMax} color="#FF6B35" size={110} label="kcal" sub={`/ ${goalMax}`} />
          <div style={{ fontSize: 11, color: remaining >= 0 ? "#888" : "#f87171", marginTop: 6 }}>{remaining >= 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over`}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <Ring value={todayProtein} max={PROTEIN_TARGET.max} color="#784CF4" size={110} label="protein" sub={`/ ${PROTEIN_TARGET.max}g`} />
          <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>{Math.max(PROTEIN_TARGET.max - todayProtein, 0)}g to go</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 110, height: 110, borderRadius: "50%", border: `7px solid ${todayWorkout.length ? "#00D4AA44" : "rgba(255,255,255,0.07)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: todayWorkout.length ? "rgba(0,212,170,0.08)" : "rgba(255,255,255,0.02)" }}>
            <Icon name={todayWorkout.length ? "check-circle" : "moon"} size={30} color={todayWorkout.length ? "#00D4AA" : "#333"} strokeWidth={1.5} />
            <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 5 }}>{todayWorkout.length ? "Trained" : "Rest"}</div>
          </div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>{todayWorkout.length ? `Day ${PROGRAM[todayWorkout[0].dayIndex]?.day}` : "No workout"}</div>
        </div>
      </div>

      <Card style={{ marginBottom: 14, padding: "12px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: "#777" }}>Daily target</span>
          <span style={{ color: "#888" }}>{goalMin}–{goalMax} kcal</span>
        </div>
        <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", position: "relative" }}>
          <div style={{ height: "100%", width: `${Math.min((todayCal / goalMax) * 100, 100)}%`, borderRadius: 99, background: todayCal > goalMax ? "#f87171" : "linear-gradient(90deg,#FF6B35,#FF3CAC)", transition: "width .4s" }} />
          <div style={{ position: "absolute", left: `${(goalMin / goalMax) * 100}%`, top: -2, width: 2, height: 10, background: "#00D4AA44" }} />
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
          <Icon name="spark" size={14} color="#FF6B35" strokeWidth={2} /> Quick Log
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          {MEAL_SLOTS.map(m => (
            <button key={m} onClick={() => setMeal(m)} style={{ background: meal === m ? "rgba(255,60,172,0.18)" : "rgba(255,255,255,0.04)", border: `1px solid ${meal === m ? "#FF3CAC" : "rgba(255,255,255,0.08)"}`, color: meal === m ? "#FF3CAC" : "#666", padding: "5px 12px", borderRadius: 99, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600 }}>{m}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && logFood()} placeholder="e.g. 2 scrambled eggs and toast"
            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#F0EDE8", borderRadius: 10, padding: "9px 12px", fontSize: 13, fontFamily: "inherit" }} />
          <button onClick={logFood} disabled={loading} style={{ background: loading ? "#333" : "linear-gradient(135deg,#FF6B35,#FF3CAC)", border: "none", borderRadius: 10, color: "#fff", padding: "9px 16px", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{loading ? "..." : "Log"}</button>
        </div>
      </Card>

      {todayEntries.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Today's Food</div>
          {MEAL_SLOTS.map(m => {
            const mEntries = todayEntries.filter(e => e.meal === m);
            if (!mEntries.length) return null;
            const mCal = mEntries.reduce((s, e) => s + (e.calories || 0), 0);
            const mProt = mEntries.reduce((s, e) => s + (e.protein || 0), 0);
            return <MealSection key={m} label={m} entries={mEntries} totalCal={mCal} totalProtein={mProt}
              onDelete={id => deleteFood(currentDate, id)} />;
          })}
        </div>
      )}
    </div>
  );
}
