import { useState } from "react";
import { EX_INFO } from "../constants/index.js";

const WK_TABS = [
  { id: "week",    label: "Week",    icon: "check-circle" },
  { id: "program", label: "Program", icon: "dumbbell"     },
  { id: "log",     label: "Log",     icon: "edit"         },
  { id: "burn",    label: "Burn",    icon: "flame"        },
  { id: "prs",     label: "PRs",     icon: "trophy"       },
];
import { suggestWeight, getWeekKey, getWeekNumber, formatDate } from "../utils/helpers.js";
import { Icon, Card, Badge, DayIcon, DateBar } from "./ui/index.jsx";

function WorkoutTab({ program: PROGRAM, currentDate, data, update, addSession, removeSession, savePRs }) {
  const [wkTab, setWkTab] = useState("program");
  return (
    <div>
      <DateBar date={currentDate} onChange={() => {}} />
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto" }}>
        {WK_TABS.map(t => (
          <button key={t.id} onClick={() => setWkTab(t.id)} style={{
            flexShrink: 0, background: wkTab === t.id ? "rgba(255,107,53,0.18)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${wkTab === t.id ? "#FF6B35" : "rgba(255,255,255,0.08)"}`,
            color: wkTab === t.id ? "#FF6B35" : "#555", padding: "8px 10px", borderRadius: 10,
            cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <Icon name={t.icon} size={12} color={wkTab === t.id ? "#FF6B35" : "#555"} strokeWidth={2} />{t.label}
          </button>
        ))}
      </div>
      {wkTab === "week"    && <WeekPanel    program={PROGRAM} currentDate={currentDate} data={data} />}
      {wkTab === "program" && <ProgramPanel program={PROGRAM} data={data} />}
      {wkTab === "log"     && <LogPanel addSession={addSession} savePRs={savePRs}     program={PROGRAM} currentDate={currentDate} data={data} update={update} />}
      {wkTab === "burn"    && <BurnPanel    program={PROGRAM} data={data} />}
      {wkTab === "prs"     && <PRsPanel     program={PROGRAM} data={data} />}
    </div>
  );
}

// ─── WEEK PANEL ───────────────────────────────────────────────────────────────
}

function WeekPanel({ program: PROGRAM, currentDate, data }) {
  const WK = "week_tracker_v1";
  const [weeks, setWeeks] = useState(() => { try { return JSON.parse(localStorage.getItem(WK) || "{}"); } catch { return {}; } });

  const wkNum = getWeekNumber(currentDate);
  const wkKey = `week_${wkNum}`;
  const cw = weeks[wkKey] || { completed: [], locked: false };
  const done = cw.completed || [];
  const allDone = done.length === PROGRAM.length;

  function toggle(i) {
    const updated = done.includes(i) ? done.filter(d => d !== i) : [...done, i];
    const next = { ...weeks, [wkKey]: { ...cw, completed: updated } };
    setWeeks(next); localStorage.setItem(WK, JSON.stringify(next));
  }
  function lockWeek() {
    const next = { ...weeks, [wkKey]: { ...cw, locked: true, lockedDate: currentDate } };
    setWeeks(next); localStorage.setItem(WK, JSON.stringify(next));
  }

  const PROG_RULES = { landmine_goblet: 2.5, landmine_rdl: 2.5, landmine_squat: 2.5, landmine_hip_thrust: 2.5, landmine_rdl2: 2.5, cable_kickback: 2.5, cable_kickback2: 2.5, cable_pull_through: 2.5, cable_row: 2.5, hip_thrust_bench: 5, hip_thrust_bar: 5, glute_bridge: 5, rdl_bar: 5, back_squat: 5 };
  const nextProgressions = allDone || cw.locked ? PROGRAM.flatMap(day =>
    day.exercises.filter(ex => ex.unit === "lb" && PROG_RULES[ex.id]).map(ex => ({
      name: ex.name, dayLabel: day.label, color: day.color,
      current: ex.startWeight + Math.max(0, (wkNum - 2)) * PROG_RULES[ex.id],
      next: ex.startWeight + Math.max(0, (wkNum - 1)) * PROG_RULES[ex.id],
    })).filter(p => p.next > p.current)
  ) : [];

  const weekHistory = Object.entries(weeks).sort(([a], [b]) => b > a ? 1 : -1).filter(([k]) => k !== wkKey).slice(0, 4);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>Week {wkNum}</div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{done.length} of {PROGRAM.length} days completed{allDone && !cw.locked ? <span style={{ color: "#00D4AA", marginLeft: 8 }}>— All done!</span> : null}</div>
        </div>
        {allDone && !cw.locked && (
          <button onClick={lockWeek} style={{ background: "linear-gradient(135deg,#00D4AA,#784CF4)", border: "none", borderRadius: 10, color: "#fff", padding: "8px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>Complete Week</button>
        )}
      </div>
      <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.07)", marginBottom: 16, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, width: `${(done.length / PROGRAM.length) * 100}%`, background: allDone ? "#00D4AA" : "linear-gradient(90deg,#FF6B35,#FF3CAC)", transition: "width .4s" }} />
      </div>
      <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
        {PROGRAM.map((day, i) => {
          const isDone = done.includes(i);
          return (
            <div key={i} onClick={() => !cw.locked && toggle(i)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, cursor: cw.locked ? "default" : "pointer", background: isDone ? day.color + "15" : "rgba(255,255,255,0.03)", border: `1px solid ${isDone ? day.color + "55" : "rgba(255,255,255,0.07)"}`, transition: "all .2s" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: isDone ? day.color : "rgba(255,255,255,0.06)", border: `2px solid ${isDone ? day.color : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {isDone && <Icon name="check-circle" size={14} color="#fff" strokeWidth={2.5} />}
              </div>
              <DayIcon dayIndex={i} color={day.color} size={34} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: isDone ? "#F0EDE8" : "#888" }}>Day {day.day} — {day.label}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{day.exercises.length} exercises</div>
              </div>
              {isDone && <Badge color={day.color}>Done</Badge>}
            </div>
          );
        })}
      </div>
      {nextProgressions.length > 0 && (
        <Card style={{ marginBottom: 16, borderColor: "#00D4AA44", background: "rgba(0,212,170,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Icon name="chart" size={15} color="#00D4AA" strokeWidth={2} />
            <div style={{ fontSize: 13, fontWeight: 800, color: "#00D4AA" }}>Week {wkNum + 1} Progressive Overload</div>
          </div>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 10 }}>Completed all {PROGRAM.length} days — target weights for next week:</div>
          {nextProgressions.map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", borderRadius: 8, background: "rgba(255,255,255,0.03)", marginBottom: 4 }}>
              <div><div style={{ fontSize: 12, fontWeight: 600, color: "#ccc" }}>{p.name}</div><div style={{ fontSize: 10, color: "#555" }}>{p.dayLabel}</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#666" }}>{p.current}lb</span>
                <span style={{ color: "#00D4AA" }}>→</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#00D4AA" }}>{p.next}lb</span>
              </div>
            </div>
          ))}
        </Card>
      )}
      {weekHistory.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "#888" }}>Previous Weeks</div>
          {weekHistory.map(([key, wk]) => {
            const n = parseInt(key.replace("week_", ""));
            return (
              <Card key={key} style={{ marginBottom: 8, padding: "12px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontSize: 13, fontWeight: 700 }}>Week {n}</div><div style={{ fontSize: 11, color: "#555" }}>{wk.completed?.length || 0} / {PROGRAM.length} days</div></div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {PROGRAM.map((_, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: wk.completed?.includes(i) ? PROGRAM[i].color : "rgba(255,255,255,0.1)" }} />)}
                  </div>
                  {wk.locked && <Badge color="#00D4AA">Complete</Badge>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PROGRAM PANEL ────────────────────────────────────────────────────────────
function ProgramPanel({ program: PROGRAM, data }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [expandedEx, setExpandedEx] = useState(null);

  return (
    <div>
      <div style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>5-day split · Home gym only · Tap a day to expand · Tap any exercise for full description</div>
      {PROGRAM.map((day, i) => (
        <Card key={day.day} style={{ marginBottom: 10, borderColor: expandedDay === i ? day.color + "44" : undefined }}
          onClick={() => { setExpandedDay(expandedDay === i ? null : i); setExpandedEx(null); }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <DayIcon dayIndex={i} color={day.color} size={40} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>Day {day.day}</span>
                  <Badge color={day.color}>{day.label}</Badge>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#555", marginTop: 2 }}>
                  <Icon name="home" size={11} color="#555" strokeWidth={2} />
                  Home · {day.exercises.length} exercises
                </div>
              </div>
            </div>
            <Icon name={expandedDay === i ? "chevron-up" : "chevron-down"} size={16} color={day.color} strokeWidth={2.5} />
          </div>
          {expandedDay === i && (
            <div style={{ marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
              {day.note && (
                <div style={{ padding: "8px 12px", borderRadius: 8, background: day.color + "0e", border: `1px solid ${day.color}22`, marginBottom: 10, fontSize: 11, color: "#aaa", lineHeight: 1.5 }}>
                  <span style={{ color: day.color, fontWeight: 700 }}>Strategy: </span>{day.note}
                </div>
              )}
              {day.exercises.map(ex => {
                const suggested = suggestWeight(ex.id, data.sessions, ex.startWeight);
                const info = EX_INFO[ex.id];
                const exKey = `${i}_${ex.id}`;
                const isOpen = expandedEx === exKey;
                return (
                  <div key={ex.id} style={{ marginBottom: 6 }}>
                    <div onClick={e => { e.stopPropagation(); setExpandedEx(isOpen ? null : exKey); }}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 10px", borderRadius: isOpen ? "8px 8px 0 0" : 8, background: ex.primary ? day.color + "15" : "rgba(255,255,255,0.03)", borderLeft: `3px solid ${ex.primary ? day.color : "transparent"}`, cursor: "pointer" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: ex.primary ? 700 : 500 }}>
                          {ex.primary && <Icon name="star" size={11} color={day.color} strokeWidth={2} />}
                          {ex.name}
                          {info && <span style={{ fontSize: 9, color: day.color, background: day.color + "22", padding: "1px 6px", borderRadius: 99, marginLeft: 4 }}>INFO</span>}
                        </div>
                        <div style={{ fontSize: 13, color: "#ccc", fontWeight: 600, marginTop: 2 }}>{ex.sets}×{ex.reps}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: day.color }}>{suggested}{suggested > 0 ? ` ${ex.unit}` : ex.unit}</div>
                        <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={13} color="#555" strokeWidth={2.5} />
                      </div>
                    </div>
                    {isOpen && info && (
                      <div onClick={e => e.stopPropagation()} style={{ padding: "12px 14px", borderRadius: "0 0 8px 8px", background: "rgba(255,255,255,0.03)", border: `1px solid ${day.color}33`, borderTop: "none" }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                          <div style={{ padding: "3px 10px", borderRadius: 99, background: day.color + "20", fontSize: 11, color: day.color, fontWeight: 600 }}>💪 {info.muscles}</div>
                          <div style={{ padding: "3px 10px", borderRadius: 99, background: "rgba(255,255,255,0.06)", fontSize: 11, color: "#888" }}>🔧 {info.equipment}</div>
                        </div>
                        <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.6, marginBottom: 10 }}>{info.description}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: day.color, marginBottom: 6 }}>Form cues:</div>
                        {info.cues.map((cue, ci) => (
                          <div key={ci} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: day.color, marginTop: 5, flexShrink: 0 }} />
                            <div style={{ fontSize: 11, color: "#999", lineHeight: 1.5 }}>{cue}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ─── LOG PANEL ────────────────────────────────────────────────────────────────
function LogPanel({ program: PROGRAM, currentDate, data, update, addSession, savePRs }) {
  const bikeModes = ["Manual", "Interval", "Hill", "Random", "Program"];
  const cardioTypes = [
    { id: "bike",        icon: "bike",     label: "Bike"        },
    { id: "elliptical",  icon: "activity", label: "Elliptical"  },
    { id: "stairmaster", icon: "stairs",   label: "Stairmaster" },
    { id: "treadmill",   icon: "run",      label: "Treadmill"   },
    { id: "swim",        icon: "waves",    label: "Swim"        },
    { id: "other",       icon: "zap",      label: "Other"       },
  ];
  const [selDay, setSelDay] = useState(0);
  const [date, setDate] = useState(() => currentDate);
  const [logs, setLogs] = useState({});
  const [sessionNotes, setSessionNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [warmupOpen, setWarmupOpen] = useState(true);
  const [warmup, setWarmup] = useState({ type: "bike", duration: "", resistance: "", miles: "", bikeCalories: "", bikeMode: "Manual" });
  const day = PROGRAM[selDay];

  function handleLog(exId, field, val) { setLogs(p => ({ ...p, [exId]: { ...p[exId], [field]: val } })); }

  function saveSession() {
    const logArr = Object.entries(logs).map(([exId, l]) => ({ exId, ...l }));
    const cardioLog = warmup.duration ? {
      type: warmup.type, duration: warmup.duration, intensity: warmup.resistance,
      miles: warmup.miles, bikeCalories: warmup.bikeCalories, bikeMode: warmup.bikeMode,
    } : null;
    const newSession = { id: Date.now(), date, dayIndex: selDay, logs: logArr, sessionNotes, cardioLog };
    // Collect new PRs
    const newPrs = {};
    logArr.forEach(l => {
      const w = parseFloat(l.weight) || 0;
      if (w > 0 && (!data.prs[l.exId] || w > data.prs[l.exId].weight)) newPrs[l.exId] = { weight: w, date };
    });
    // Use DB-synced helpers (addSession writes to Supabase)
    if (typeof addSession === 'function') {
      addSession(newSession);
    } else {
      update(prev => ({ ...prev, sessions: [...prev.sessions, newSession] }));
    }
    if (Object.keys(newPrs).length > 0) {
      if (typeof savePRs === 'function') {
        savePRs(newPrs);
      } else {
        update(prev => ({ ...prev, prs: { ...prev.prs, ...newPrs } }));
      }
    }
    setSaved(true); setTimeout(() => setSaved(false), 2500);
    setLogs({}); setSessionNotes(""); setWarmup({ duration: "", resistance: "", miles: "", bikeCalories: "", bikeMode: "Manual" });
  }

  const inputStyle = { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "#F0EDE8", borderRadius: 8, padding: "7px 10px", fontSize: 12, fontFamily: "inherit" };
  const labelStyle = { fontSize: 10, color: "#555", display: "block", marginBottom: 3 };

  return (
    <div>
      {/* Day selector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
        {PROGRAM.map((d, i) => (
          <button key={i} onClick={() => setSelDay(i)} style={{ background: selDay === i ? d.color + "22" : "rgba(255,255,255,0.03)", border: `1px solid ${selDay === i ? d.color : "rgba(255,255,255,0.08)"}`, color: selDay === i ? d.color : "#555", padding: "8px 6px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
            <DayIcon dayIndex={i} color={d.color} size={26} />
            <div style={{ textAlign: "left" }}><div style={{ fontSize: 11, fontWeight: 700 }}>Day {d.day}</div><div style={{ fontSize: 10, marginTop: 1, color: selDay === i ? d.color + "cc" : "#555" }}>{d.label}</div></div>
          </button>
        ))}
      </div>

      {/* Date picker */}
      <input type="date" value={date} onChange={e => setDate(e.target.value)}
        style={{ ...inputStyle, marginBottom: 12, colorScheme: "dark", color: "#F0EDE8", borderRadius: 10, padding: "8px 12px", fontSize: 13 }} />

      {/* ── WARM-UP / BIKE BOX ── */}
      <Card style={{ marginBottom: 12, borderColor: warmupOpen ? "#00D4AA44" : "rgba(255,255,255,0.08)" }}>
        <div onClick={() => setWarmupOpen(o => !o)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: warmupOpen ? 12 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(0,212,170,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={cardioTypes.find(t => t.id === warmup.type)?.icon || "bike"} size={15} color="#00D4AA" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#00D4AA" }}>Warm-up · {cardioTypes.find(t => t.id === warmup.type)?.label || "Bike"}</div>
              {!warmupOpen && warmup.duration && <div style={{ fontSize: 11, color: "#555" }}>{warmup.duration} min{warmup.miles ? ` · ${warmup.miles} mi` : ""}{warmup.bikeCalories ? ` · ${warmup.bikeCalories} cal` : ""}</div>}
            </div>
          </div>
          <Icon name={warmupOpen ? "chevron-up" : "chevron-down"} size={15} color="#00D4AA" strokeWidth={2.5} />
        </div>

        {warmupOpen && (
          <>
            {/* Cardio type selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
              {cardioTypes.map(t => (
                <button key={t.id} onClick={() => setWarmup(w => ({ ...w, type: t.id }))} style={{ background: warmup.type === t.id ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${warmup.type === t.id ? "#00D4AA" : "rgba(255,255,255,0.08)"}`, color: warmup.type === t.id ? "#00D4AA" : "#555", padding: "7px 4px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <Icon name={t.icon} size={12} color={warmup.type === t.id ? "#00D4AA" : "#555"} strokeWidth={2} />{t.label}
                </button>
              ))}
            </div>
            {/* Duration + Resistance */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div><label style={labelStyle}>Duration (min)</label>
                <input value={warmup.duration} onChange={e => setWarmup(w => ({ ...w, duration: e.target.value }))} placeholder="15" style={inputStyle} /></div>
              <div><label style={labelStyle}>Resistance/Level</label>
                <input value={warmup.resistance} onChange={e => setWarmup(w => ({ ...w, resistance: e.target.value }))} placeholder="8" style={inputStyle} /></div>
            </div>
            {/* Miles + Calories */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div><label style={labelStyle}>Miles traveled</label>
                <input value={warmup.miles} onChange={e => setWarmup(w => ({ ...w, miles: e.target.value }))} placeholder="3.2" style={inputStyle} /></div>
              <div><label style={labelStyle}>Calories (from bike)</label>
                <input value={warmup.bikeCalories} onChange={e => setWarmup(w => ({ ...w, bikeCalories: e.target.value }))} placeholder="120" style={inputStyle} /></div>
            </div>
            {/* Bike mode */}
            <div>
              <label style={labelStyle}>Bike mode</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {bikeModes.map(m => (
                  <button key={m} onClick={() => setWarmup(w => ({ ...w, bikeMode: m }))} style={{ padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: warmup.bikeMode === m ? "rgba(0,212,170,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${warmup.bikeMode === m ? "#00D4AA" : "rgba(255,255,255,0.08)"}`, color: warmup.bikeMode === m ? "#00D4AA" : "#555" }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>

      {/* ── EXERCISES ── */}
      {day.exercises.filter(ex => ex.unit !== "BW" || ex.id.includes("cable") || ex.id.includes("landmine") || ex.id.includes("hip") || ex.id.includes("rdl") || ex.id.includes("glute") || ex.id.includes("bench") || ex.id.includes("squat") || ex.id.includes("pushup") || ex.id.includes("row") || ex.id.includes("lunge") || ex.id.includes("step") || ex.id.includes("split") || ex.id.includes("single") || ex.id.includes("walking") || ex.id.includes("knee") || ex.id.includes("pike") || ex.id.includes("curtsy") || ex.id.includes("dip")).map(ex => {
        const suggested = suggestWeight(ex.id, data.sessions, ex.startWeight);
        const log = logs[ex.id] || {};
        const pr = data.prs[ex.id];
        const isNewPr = parseFloat(log.weight) > (pr?.weight || 0);
        const isBW = ex.unit === "BW";
        return (
          <Card key={ex.id} style={{ marginBottom: 10, borderColor: ex.primary ? day.color + "44" : undefined }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 700, fontSize: 13 }}>
                  {ex.primary && <Icon name="star" size={11} color={day.color} strokeWidth={2} />}{ex.name}
                </div>
                <div style={{ fontSize: 13, color: "#aaa" }}>Target: <span style={{ color: "#F0EDE8", fontWeight: 700 }}>{ex.sets}×{ex.reps}</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                {isNewPr && <div style={{ fontSize: 11, color: "#FFD700", fontWeight: 700 }}>🏆 New PR!</div>}
                <div style={{ fontSize: 12, color: "#888" }}>Last: <span style={{ color: "#ccc", fontWeight: 600 }}>{suggested}{!isBW ? ex.unit : " BW"}</span></div>
              </div>
            </div>
            {isBW ? (
              /* Bodyweight — just sets + reps + completed toggle */
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
                {[["sets", "Sets", ex.sets], ["reps", "Reps", "—"]].map(([f, lbl, ph]) => (
                  <div key={f}><label style={labelStyle}>{lbl}</label>
                    <input value={log[f] || ""} onChange={e => handleLog(ex.id, f, e.target.value)} placeholder={String(ph)}
                      style={inputStyle} />
                  </div>
                ))}
                <div><label style={labelStyle}>Done</label>
                  <button onClick={() => handleLog(ex.id, "done", !log.done)} style={{ width: "100%", padding: "7px", borderRadius: 8, border: `1px solid ${log.done ? day.color : "rgba(255,255,255,0.09)"}`, background: log.done ? day.color + "22" : "rgba(255,255,255,0.04)", color: log.done ? day.color : "#555", fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    {log.done ? "✓ Done" : "Mark"}
                  </button>
                </div>
              </div>
            ) : (
              /* Weighted — sets + reps + weight */
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
                {[["weight", `Wt (${ex.unit})`, suggested], ["sets", "Sets", ex.sets], ["reps", "Reps", "—"]].map(([f, lbl, ph]) => (
                  <div key={f}><label style={labelStyle}>{lbl}</label>
                    <input value={log[f] || ""} onChange={e => handleLog(ex.id, f, e.target.value)} placeholder={String(ph)}
                      style={inputStyle} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}

      <textarea value={sessionNotes} onChange={e => setSessionNotes(e.target.value)} placeholder="Session notes..." rows={2}
        style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#aaa", borderRadius: 10, padding: "10px", fontSize: 13, fontFamily: "inherit", marginBottom: 12, resize: "vertical" }} />
      <button onClick={saveSession} style={{ width: "100%", padding: "13px", background: saved ? "#00D4AA" : "linear-gradient(135deg,#FF6B35,#FF3CAC)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Icon name="save" size={16} color="#fff" strokeWidth={2} />
        {saved ? "Saved!" : "Save Session"}
      </button>
    </div>
  );
}


// ─── BURN PANEL ───────────────────────────────────────────────────────────────
const DEFAULT_BURN = [
  {
    dayIndex: 0, label: "Day 1 — Glute Focus", color: "#FF6B35",
    exercises: [
      { id: "b_bike1",        name: "Stationary Bike Warm-up",         met: 5.0, duration: 15, unit: "min" },
      { id: "b_lm_goblet",    name: "Landmine Goblet Squats (BW)",     met: 4.0, sets: 3, reps: 12, restSec: 60 },
      { id: "b_lm_rdl",       name: "Landmine RDLs (BW)",              met: 4.0, sets: 3, reps: 12, restSec: 60 },
      { id: "b_split_squat",  name: "Bulgarian Split Squats (BW)",     met: 4.0, sets: 3, reps: 16, restSec: 60 },
      { id: "b_glute_bridge", name: "Glute Bridges Floor (2s hold)",   met: 3.5, sets: 3, reps: 20, restSec: 45 },
    ],
  },
  {
    dayIndex: 1, label: "Day 2 — Cable & Pump", color: "#FF3CAC",
    exercises: [
      { id: "b_bike2",        name: "Stationary Bike Warm-up",         met: 5.0, duration: 10, unit: "min" },
      { id: "b_cable_kick",   name: "Cable Kickbacks",                 met: 3.5, sets: 4, reps: 17, restSec: 45 },
      { id: "b_pull_through", name: "Cable Pull-Throughs",             met: 4.0, sets: 3, reps: 15, restSec: 45 },
      { id: "b_hip_thrust_b", name: "Hip Thrusts (BW)",                met: 3.5, sets: 4, reps: 12, restSec: 60 },
      { id: "b_curtsy",       name: "Curtsy Lunges (BW)",              met: 4.0, sets: 3, reps: 12, restSec: 45 },
      { id: "b_glute_br2",    name: "Glute Bridges (BW)",              met: 3.5, sets: 3, reps: 15, restSec: 45 },
    ],
  },
  {
    dayIndex: 2, label: "Day 3 — Strength & Power", color: "#784CF4",
    exercises: [
      { id: "b_bike3",        name: "Stationary Bike Warm-up",         met: 5.0, duration: 10, unit: "min" },
      { id: "b_lm_squat",     name: "Landmine Squats (BW)",            met: 4.5, sets: 4, reps: 11, restSec: 60 },
      { id: "b_lm_hip",       name: "Landmine Hip Thrusts (BW)",       met: 4.0, sets: 4, reps: 12, restSec: 60 },
      { id: "b_step_up",      name: "Step Ups onto bench",             met: 4.5, sets: 3, reps: 12, restSec: 45 },
      { id: "b_walk_lunge",   name: "Walking Lunges (BW)",             met: 4.5, sets: 3, reps: 20, restSec: 45 },
      { id: "b_knee_pushup",  name: "Knee Push-ups",                   met: 3.0, sets: 3, reps: 11, restSec: 30 },
    ],
  },
  {
    dayIndex: 3, label: "Day 4 — Active Recovery", color: "#00D4AA",
    exercises: [
      { id: "b_bike4",        name: "Stationary Bike (steady state)",  met: 5.5, duration: 27, unit: "min" },
      { id: "b_cable_kick2",  name: "Cable Kickbacks (light)",         met: 3.5, sets: 3, reps: 20, restSec: 30 },
      { id: "b_sl_rdl",       name: "Single Leg RDL (BW)",             met: 4.0, sets: 3, reps: 10, restSec: 45 },
      { id: "b_glute_pulse",  name: "Glute Bridge Pulses (3s hold)",   met: 3.0, sets: 3, reps: 25, restSec: 30 },
      { id: "b_cable_row",    name: "Cable Rows (light)",              met: 3.0, sets: 3, reps: 15, restSec: 45 },
    ],
  },
  {
    dayIndex: 4, label: "Day 5 — Full Glute + Compound", color: "#FFD700",
    exercises: [
      { id: "b_bike5",        name: "Stationary Bike Warm-up",         met: 5.0, duration: 10, unit: "min" },
      { id: "b_hip_thrust5",  name: "Hip Thrusts (add plates)",        met: 4.0, sets: 4, reps: 9,  restSec: 75 },
      { id: "b_rdl5",         name: "RDLs (bar when ready)",           met: 4.5, sets: 3, reps: 11, restSec: 75 },
      { id: "b_squat5",       name: "Back Squats (bar when ready)",    met: 5.0, sets: 3, reps: 9,  restSec: 75 },
      { id: "b_lm_rdl2",      name: "Landmine RDLs single leg",        met: 4.0, sets: 3, reps: 10, restSec: 60 },
      { id: "b_bridge_heavy", name: "Glute Bridges (add plates)",      met: 3.5, sets: 3, reps: 12, restSec: 60 },
    ],
  },
];

const BW_KG = 71.7;
function calcBurn(ex, ov) {
  const met = ov.met ?? ex.met;
  if (ex.unit === "min") return met * BW_KG * ((ov.duration ?? ex.duration) / 60);
  const sets = ov.sets ?? ex.sets, reps = ov.reps ?? ex.reps, rest = ov.restSec ?? ex.restSec;
  const mins = (sets * reps * 3) / 60 + (sets * rest) / 60;
  return met * BW_KG * (mins / 60);
}

function BurnPanel({ program: PROGRAM }) {
  const BK = "burn_overrides_v1";
  const [overrides, setOverrides] = useState(() => { try { return JSON.parse(localStorage.getItem(BK) || "{}"); } catch { return {}; } });
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(0);

  function getOv(di, id) { return overrides[`${di}_${id}`] || {}; }
  function setOv(di, id, field, val) {
    const key = `${di}_${id}`;
    const next = { ...overrides, [key]: { ...getOv(di, id), [field]: parseFloat(val) || 0 } };
    setOverrides(next); localStorage.setItem(BK, JSON.stringify(next));
  }
  function resetOv(di, id) {
    const key = `${di}_${id}`;
    const next = { ...overrides }; delete next[key];
    setOverrides(next); localStorage.setItem(BK, JSON.stringify(next));
  }

  const dayBurns = DEFAULT_BURN.map(day => Math.round(day.exercises.reduce((sum, ex) => sum + calcBurn(ex, getOv(day.dayIndex, ex.id)), 0)));
  const weeklyBurn = dayBurns.reduce((a, b) => a + b, 0);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Estimated Calorie Burn</div>
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>Based on 158lb using MET values. Tap any exercise to adjust. Estimates only — actual burn varies by effort.</div>
      </div>
      <Card style={{ marginBottom: 16, background: "linear-gradient(135deg,rgba(255,107,53,0.1),rgba(255,60,172,0.08))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Weekly Burn Estimate</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#FF6B35", fontFamily: "monospace" }}>{weeklyBurn} cal</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {DEFAULT_BURN.map((day, i) => (
            <div key={i} style={{ padding: "8px 12px", borderRadius: 10, background: day.color + "15", border: `1px solid ${day.color}30` }}>
              <div style={{ fontSize: 11, color: day.color, fontWeight: 700 }}>Day {day.dayIndex + 1}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#F0EDE8", fontFamily: "monospace" }}>{dayBurns[i]}</div>
              <div style={{ fontSize: 10, color: "#555" }}>cal estimated</div>
            </div>
          ))}
        </div>
      </Card>
      {DEFAULT_BURN.map((day, di) => (
        <Card key={di} style={{ marginBottom: 12, borderColor: expanded === di ? day.color + "44" : undefined }}>
          <div onClick={() => setExpanded(expanded === di ? null : di)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <DayIcon dayIndex={di} color={day.color} size={38} />
              <div><div style={{ fontSize: 13, fontWeight: 800 }}>{day.label}</div><div style={{ fontSize: 11, color: "#555" }}>{day.exercises.length} exercises</div></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 20, fontWeight: 900, color: day.color, fontFamily: "monospace" }}>{dayBurns[di]}</div><div style={{ fontSize: 10, color: "#555" }}>cal</div></div>
              <Icon name={expanded === di ? "chevron-up" : "chevron-down"} size={16} color={day.color} strokeWidth={2.5} />
            </div>
          </div>
          {expanded === di && (
            <div style={{ marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
              {day.exercises.map(ex => {
                const ov = getOv(di, ex.id);
                const isCardio = ex.unit === "min";
                const editKey = `${di}_${ex.id}`;
                const isEditing = editing === editKey;
                const isOverridden = Object.keys(ov).length > 0;
                const burnVal = Math.round(calcBurn(ex, ov));
                return (
                  <div key={ex.id} style={{ marginBottom: 8 }}>
                    <div onClick={e => { e.stopPropagation(); setEditing(isEditing ? null : editKey); }}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: isEditing ? "8px 8px 0 0" : 9, background: "rgba(255,255,255,0.03)", cursor: "pointer", border: `1px solid ${isEditing ? day.color + "44" : "transparent"}` }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#ccc", display: "flex", alignItems: "center", gap: 6 }}>
                          {ex.name}
                          {isOverridden && <span style={{ fontSize: 9, color: day.color, background: day.color + "22", padding: "1px 6px", borderRadius: 99 }}>EDITED</span>}
                        </div>
                        <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
                          {isCardio ? `${ov.duration ?? ex.duration} min` : `${ov.sets ?? ex.sets}×${ov.reps ?? ex.reps} · ${ov.restSec ?? ex.restSec}s rest`} · MET {ov.met ?? ex.met}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: day.color, fontFamily: "monospace" }}>{burnVal}</div>
                        <Icon name={isEditing ? "chevron-up" : "chevron-down"} size={13} color="#555" strokeWidth={2.5} />
                      </div>
                    </div>
                    {isEditing && (
                      <div onClick={e => e.stopPropagation()} style={{ padding: "10px 12px", borderRadius: "0 0 9px 9px", background: "rgba(255,255,255,0.03)", border: `1px solid ${day.color}22`, borderTop: "none" }}>
                        <div style={{ display: "grid", gridTemplateColumns: isCardio ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                          {(isCardio ? [["duration", "Duration (min)", ov.duration ?? ex.duration], ["met", "Intensity (MET)", ov.met ?? ex.met]] : [["sets", "Sets", ov.sets ?? ex.sets], ["reps", "Reps", ov.reps ?? ex.reps], ["restSec", "Rest (sec)", ov.restSec ?? ex.restSec], ["met", "MET", ov.met ?? ex.met]]).map(([field, lbl, val]) => (
                            <div key={field}><label style={{ fontSize: 10, color: "#666", display: "block", marginBottom: 3 }}>{lbl}</label>
                              <input type="number" defaultValue={val} onChange={e => setOv(di, ex.id, field, e.target.value)}
                                style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#F0EDE8", borderRadius: 7, padding: "6px 8px", fontSize: 12, fontFamily: "inherit" }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ fontSize: 10, color: "#555", marginBottom: 8 }}>MET guide: Bike easy 4–5 · Lifting 3–5 · Stairmaster 8–10 · Swimming 6–8</div>
                        {isOverridden && <button onClick={e => { e.stopPropagation(); resetOv(di, ex.id); setEditing(null); }} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#666", borderRadius: 7, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Reset to default</button>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ─── PRs PANEL ────────────────────────────────────────────────────────────────
function PRsPanel({ program: PROGRAM, data }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>Auto-tracked from your logged sessions</div>
      {PROGRAM.flatMap(d => d.exercises).map(ex => {
        const pr = data.prs[ex.id];
        const day = PROGRAM.find(d => d.exercises.some(e => e.id === ex.id));
        return (
          <Card key={ex.id} style={{ marginBottom: 8, padding: "12px 16px", borderColor: pr ? day?.color + "33" : undefined }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: pr ? 700 : 500, color: pr ? "#F0EDE8" : "#444" }}>
                  {ex.primary && <Icon name="star" size={11} color={day?.color || "#888"} strokeWidth={2} />}{ex.name}
                </div>
                {pr && <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>{formatDate(pr.date)}</div>}
              </div>
              {pr ? <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}><span style={{ fontSize: 20, fontWeight: 900, color: "#FFD700", fontFamily: "monospace" }}>{pr.weight}</span><span style={{ fontSize: 11, color: "#FFD70088" }}>{ex.unit}</span></div> : <span style={{ fontSize: 12, color: "#333" }}>—</span>}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── PROGRESS TAB ─────────────────────────────────────────────────────────────
