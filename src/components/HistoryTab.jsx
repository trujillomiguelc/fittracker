import { useState } from "react";
import { formatDate } from "../utils/helpers.js";
import { MEAL_SLOTS } from "../constants/index.js";
import { Icon, Card, Badge, DayIcon, DateBar } from "./ui/index.jsx";

// ─── HISTORY TAB ──────────────────────────────────────────────────────────────
function HistoryTab({ program: PROGRAM, currentDate, data, update, removeSession, goal }) {
  const [view, setView] = useState("nutrition");
  const [expandedDay, setExpandedDay] = useState(null);
  const goalMin = goal.calMin || 1900, goalMax = goal.calMax || 2100;

  const calDays = Object.entries(data.calorieLog)
    .sort(([a], [b]) => b > a ? 1 : -1)
    .slice(0, 30)
    .filter(([, e]) => e.length > 0);

  const workoutSessions = [...data.sessions]
    .filter(s => s.dayIndex >= 0)
    .sort((a, b) => b.date > a.date ? 1 : -1);

  return (
    <div>
      <DateBar date={currentDate} onChange={() => {}} />
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["nutrition", "flame", "Nutrition"], ["workouts", "dumbbell", "Workouts"]].map(([k, ico, lbl]) => (
          <button key={k} onClick={() => setView(k)} style={{ flex: 1, padding: "9px", background: view === k ? "rgba(255,60,172,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${view === k ? "#FF3CAC" : "rgba(255,255,255,0.08)"}`, color: view === k ? "#FF3CAC" : "#555", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <Icon name={ico} size={14} color={view === k ? "#FF3CAC" : "#555"} strokeWidth={2} />{lbl}
          </button>
        ))}
      </div>

      {view === "nutrition" && (
        calDays.length === 0
          ? <div style={{ textAlign: "center", padding: "50px", color: "#333" }}><div style={{ marginTop: 12 }}>No nutrition logged yet</div></div>
          : calDays.map(([date, entries]) => {
            const cal = entries.reduce((s, e) => s + (e.calories || 0), 0);
            const protein = entries.reduce((s, e) => s + (e.protein || 0), 0);
            const inRange = cal >= goalMin && cal <= goalMax, over = cal > goalMax;
            const isExpanded = expandedDay === date;
            return (
              <Card key={date} style={{ marginBottom: 10, borderColor: inRange ? "#00D4AA22" : over ? "#f8717122" : undefined, cursor: "pointer" }}
                onClick={() => setExpandedDay(isExpanded ? null : date)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{formatDate(date)}</div>
                    <div style={{ fontSize: 11, color: "#555" }}>{entries.length} items · tap to expand</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 17, fontWeight: 800, color: over ? "#f87171" : inRange ? "#00D4AA" : "#FF6B35", fontFamily: "monospace" }}>{cal}</div>
                      <div style={{ fontSize: 10, color: "#444" }}>kcal · {protein}g P</div>
                    </div>
                    <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color="#555" strokeWidth={2.5} />
                  </div>
                </div>
                <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min((cal / goalMax) * 100, 100)}%`, background: over ? "#f87171" : inRange ? "#00D4AA" : "#FF6B35", borderRadius: 99 }} />
                </div>
                {isExpanded && (
                  <div style={{ marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }} onClick={e => e.stopPropagation()}>
                    {MEAL_SLOTS.map(m => {
                      const mE = entries.filter(e => e.meal === m);
                      if (!mE.length) return null;
                      const mCal = mE.reduce((s, e) => s + (e.calories || 0), 0);
                      const mProt = mE.reduce((s, e) => s + (e.protein || 0), 0);
                      return (
                        <div key={m} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                            <span style={{ color: "#aaa" }}>{m}</span>
                            <div style={{ display: "flex", gap: 8 }}>
                              <span style={{ color: "#FF6B35" }}>{mCal} cal</span>
                              <span style={{ color: "#784CF4" }}>{Math.round(mProt)}g P</span>
                            </div>
                          </div>
                          {mE.map(e => <EntryRow key={e.id} e={e} />)}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })
      )}

      {view === "workouts" && (
        workoutSessions.length === 0
          ? <div style={{ textAlign: "center", padding: "50px", color: "#333" }}>No sessions logged yet</div>
          : workoutSessions.map(session => {
            const day = PROGRAM[session.dayIndex];
            return (
              <Card key={session.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <DayIcon dayIndex={session.dayIndex} color={day?.color || "#888"} size={34} />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{day?.label}</span>
                        <Badge color={day?.color || "#888"}>Day {(session.dayIndex ?? 0) + 1}</Badge>
                      </div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{formatDate(session.date)}</div>
                    </div>
                  </div>
                  <button onClick={() => { if (confirm("Delete this session?")) typeof removeSession === 'function' ? removeSession(session.id) : update(prev => ({ ...prev, sessions: prev.sessions.filter(s => s.id !== session.id) })); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
                    <Icon name="trash" size={15} color="#444" strokeWidth={2} />
                  </button>
                </div>
                {session.logs?.slice(0, 3).map(log => {
                  const ex = day?.exercises.find(e => e.id === log.exId);
                  return ex ? (
                    <div key={log.exId} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", borderRadius: 7, background: "rgba(255,255,255,0.02)", marginBottom: 3, fontSize: 12 }}>
                      <span style={{ color: "#aaa" }}>{ex.name}</span>
                      <span style={{ color: day?.color, fontWeight: 700 }}>{log.weight ? `${log.weight}${ex.unit !== "BW" ? ex.unit : ""} ` : ""}{log.sets && `${log.sets}×`}{log.reps || ""}</span>
                    </div>
                  ) : null;
                })}
                {session.logs?.length > 3 && <div style={{ fontSize: 11, color: "#444", textAlign: "center", marginTop: 4 }}>+{session.logs.length - 3} more exercises</div>}
              </Card>
            );
          })
      )}
    </div>
  );
}
