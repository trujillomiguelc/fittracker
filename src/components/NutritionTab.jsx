import { useState } from "react";
import { logFoodSmart } from "../api/nutrition.js";
import { MEAL_SLOTS, GOALS, PROTEIN_TARGET } from "../constants/index.js";
import { Icon, Card, Ring, MacroBar, DateBar } from "./ui/index.jsx";
import MealSection from "./MealSection.jsx";

function NutritionTab({ currentDate, data, update, addFood, deleteFood, goal }) {
  const [selDate, setSelDate] = useState(currentDate);
  const [aiInput, setAiInput] = useState(""), [loading, setLoading] = useState(false), [meal, setMeal] = useState("Lunch");
  const [goalMode, setGoalMode] = useState(data.goalMode);

  const entries = data.calorieLog[selDate] || [];
  const cal = entries.reduce((s, e) => s + (e.calories || 0), 0);
  const protein = entries.reduce((s, e) => s + (e.protein || 0), 0);
  const carbs = entries.reduce((s, e) => s + (e.carbs || 0), 0);
  const fat = entries.reduce((s, e) => s + (e.fat || 0), 0);
  const goalMax = goal.calMax || 2100, goalMin = goal.calMin || 1900;

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
       newEntries.forEach(e => addFood(selDate, e));
       setAiInput("");
     } catch { alert("Couldn't parse — try being more specific!"); }
     setLoading(false);
   }

  function switchGoal(mode) { setGoalMode(mode); update(prev => ({ ...prev, goalMode: mode, customGoal: null })); }

  return (
    <div>
      <DateBar date={selDate} onChange={setSelDate} />
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {Object.entries(GOALS).map(([k, g]) => (
          <button key={k} onClick={() => switchGoal(k)} style={{ flex: 1, padding: "8px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700, background: goalMode === k ? g.color + "22" : "rgba(255,255,255,0.03)", border: `1px solid ${goalMode === k ? g.color : "rgba(255,255,255,0.08)"}`, color: goalMode === k ? g.color : "#555" }}>
            {g.label}<div style={{ fontSize: 10, fontWeight: 400, color: goalMode === k ? g.color + "99" : "#333" }}>{g.calMin}–{g.calMax}</div>
          </button>
        ))}
      </div>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div><div style={{ fontSize: 28, fontWeight: 900, color: cal > goalMax ? "#f87171" : "#FF6B35", fontFamily: "monospace" }}>{cal}</div><div style={{ fontSize: 11, color: "#555" }}>of {goalMin}–{goalMax} kcal</div></div>
          <Ring value={cal} max={goalMax} color="#FF6B35" size={80} />
        </div>
        <MacroBar label="Protein" value={protein} max={PROTEIN_TARGET.max} color="#784CF4" />
        <MacroBar label="Carbs"   value={carbs}   max={250}               color="#FF6B35" />
        <MacroBar label="Fat"     value={fat}     max={70}                color="#00D4AA" />
      </Card>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
          <Icon name="robot" size={15} color="#FF6B35" strokeWidth={1.75} /> AI Food Logger
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          {MEAL_SLOTS.map(m => <button key={m} onClick={() => setMeal(m)} style={{ background: meal === m ? "rgba(255,60,172,0.18)" : "rgba(255,255,255,0.04)", border: `1px solid ${meal === m ? "#FF3CAC" : "rgba(255,255,255,0.08)"}`, color: meal === m ? "#FF3CAC" : "#666", padding: "5px 10px", borderRadius: 99, cursor: "pointer", fontSize: 11, fontFamily: "inherit", fontWeight: 600 }}>{m}</button>)}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && logFood()} placeholder="Describe your meal..."
            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#F0EDE8", borderRadius: 10, padding: "9px 12px", fontSize: 13, fontFamily: "inherit" }} />
          <button onClick={logFood} disabled={loading} style={{ background: loading ? "#333" : "linear-gradient(135deg,#FF6B35,#FF3CAC)", border: "none", borderRadius: 10, color: "#fff", padding: "9px 16px", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{loading ? "..." : "Log"}</button>
        </div>
      </Card>
      {MEAL_SLOTS.map(m => {
        const mE = entries.filter(e => e.meal === m);
        if (!mE.length) return null;
        const mCal = mE.reduce((s, e) => s + (e.calories || 0), 0);
        const mProt = mE.reduce((s, e) => s + (e.protein || 0), 0);
        return <MealSection key={m} label={m} entries={mE} totalCal={mCal} totalProtein={mProt}
          onDelete={id => deleteFood(selDate, id)} />;
      })}
    </div>
  );
}

