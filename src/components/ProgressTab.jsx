import { useState } from "react";
import { getWeek7, getWeekKey, formatDate } from "../utils/helpers.js";
import { PROTEIN_TARGET } from "../constants/index.js";
import { Ring, MacroBar, Card, DateBar, Icon } from "./ui/index.jsx";

function ProgressTab({ program: PROGRAM, currentDate, data, goal }) {
  const [selEx, setSelEx] = useState("hip_thrust_bar");
  const goalMin = goal.calMin || 1900, goalMax = goal.calMax || 2100;
  const week7 = getWeek7(currentDate);

  const weekCalData = week7.map(d => {
    const e = data.calorieLog[d] || [];
    return { date: d, cal: e.reduce((s, x) => s + (x.calories || 0), 0), protein: e.reduce((s, x) => s + (x.protein || 0), 0) };
  });

  const allEx = PROGRAM.flatMap(d => d.exercises);
  const exPoints = data.sessions
    .filter(s => s.logs?.some(l => l.exId === selEx))
    .sort((a, b) => a.date > b.date ? 1 : -1)
    .map(s => ({ date: s.date, weight: parseFloat(s.logs.find(l => l.exId === selEx)?.weight) || 0 }))
    .filter(p => p.weight > 0);

  const maxCal = Math.max(...weekCalData.map(d => d.cal), goalMax);
  const maxExW = exPoints.length ? Math.max(...exPoints.map(p => p.weight)) : 100;
  const minExW = exPoints.length ? Math.min(...exPoints.map(p => p.weight)) : 0;
  const exRange = maxExW - minExW || 20;

  const weeklyVol = {};
  data.sessions.forEach(s => { const wk = getWeekKey(s.date); weeklyVol[wk] = (weeklyVol[wk] || 0) + (s.logs?.reduce((a, l) => a + (parseInt(l.sets) || 0), 0) || 0); });
  const wkKeys = Object.keys(weeklyVol).sort().slice(-6);

  return (
    <div>
      <DateBar date={currentDate} onChange={() => {}} />
      <h2 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 16px" }}>Progress</h2>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
          <Icon name="bar-chart" size={14} color="#FF6B35" strokeWidth={2} /> 7-Day Calories
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
          {weekCalData.map(d => {
            const h = maxCal > 0 ? (d.cal / maxCal) * 70 : 0;
            const inRange = d.cal >= goalMin && d.cal <= goalMax;
            const over = d.cal > goalMax;
            const isToday = d.date === currentDate;
            return (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                {d.cal > 0 && <span style={{ fontSize: 8, color: over ? "#f87171" : inRange ? "#00D4AA" : "#666" }}>{d.cal}</span>}
                <div style={{ width: "100%", height: Math.max(h, d.cal > 0 ? 4 : 0), borderRadius: "3px 3px 0 0", background: over ? "#f87171" : inRange ? "#00D4AA" : "rgba(255,107,53,0.45)", boxShadow: isToday ? "0 0 0 1px #FF6B35" : "none" }} />
                <span style={{ fontSize: 8, color: isToday ? "#FF6B35" : "#333" }}>{new Date(d.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 10 }}>
          <span style={{ color: "#00D4AA" }}>● In range</span>
          <span style={{ color: "#f87171" }}>● Over</span>
          <span style={{ color: "#555" }}>● Under</span>
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
          <Icon name="protein" size={14} color="#784CF4" strokeWidth={2} /> 7-Day Protein
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
          {weekCalData.map(d => {
            const h = (d.protein / PROTEIN_TARGET.max) * 55;
            const hit = d.protein >= PROTEIN_TARGET.min;
            return (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                {d.protein > 0 && <span style={{ fontSize: 8, color: hit ? "#784CF4" : "#444" }}>{d.protein}g</span>}
                <div style={{ width: "100%", height: Math.max(h, d.protein > 0 ? 3 : 0), borderRadius: "3px 3px 0 0", background: hit ? "#784CF4" : "rgba(120,76,244,0.25)" }} />
              </div>
            );
          })}
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13 }}>
            <Icon name="barbell" size={14} color="#FF6B35" strokeWidth={2} /> Lift Progress
          </div>
          <select value={selEx} onChange={e => setSelEx(e.target.value)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", borderRadius: 8, padding: "4px 8px", fontSize: 11, fontFamily: "inherit" }}>
            {allEx.filter(e => e.unit === "lb").map(e => <option key={e.id} value={e.id} style={{ background: "#1a1a1f" }}>{e.name}</option>)}
          </select>
        </div>
        {exPoints.length < 2
          ? <div style={{ textAlign: "center", padding: "24px", color: "#333", fontSize: 12 }}>Log 2+ sessions to see your progress chart</div>
          : (
            <svg width="100%" height={100} viewBox={`0 0 ${Math.max(exPoints.length * 55, 280)} 100`} preserveAspectRatio="none">
              <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF6B35" stopOpacity="0.3"/><stop offset="100%" stopColor="#FF6B35" stopOpacity="0"/></linearGradient></defs>
              <polyline points={exPoints.map((p, i) => `${25 + i * 55},${85 - ((p.weight - minExW) / exRange) * 70}`).join(" ") + ` ${25 + (exPoints.length - 1) * 55},95 25,95`} fill="url(#eg)" stroke="none"/>
              <polyline points={exPoints.map((p, i) => `${25 + i * 55},${85 - ((p.weight - minExW) / exRange) * 70}`).join(" ")} fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              {exPoints.map((p, i) => { const x = 25 + i * 55, y = 85 - ((p.weight - minExW) / exRange) * 70, isPR = p.weight === maxExW; return <g key={i}><circle cx={x} cy={y} r={isPR ? 5 : 3} fill={isPR ? "#FFD700" : "#FF6B35"}/><text x={x} y={y - 8} textAnchor="middle" fill={isPR ? "#FFD700" : "#888"} fontSize="9">{p.weight}</text></g>; })}
            </svg>
          )
        }
      </Card>

      {wkKeys.length > 0 && (
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
            <Icon name="activity" size={14} color="#FF3CAC" strokeWidth={2} /> Weekly Workout Volume
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
            {wkKeys.map(wk => {
              const vol = weeklyVol[wk], maxV = Math.max(...wkKeys.map(k => weeklyVol[k]));
              return (
                <div key={wk} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <span style={{ fontSize: 8, color: "#666" }}>{vol}</span>
                  <div style={{ width: "100%", height: (vol / maxV) * 50, borderRadius: "3px 3px 0 0", background: "linear-gradient(180deg,#FF3CAC,#784CF4)" }} />
                  <span style={{ fontSize: 8, color: "#333" }}>W{wk.split("-W")[1]}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

