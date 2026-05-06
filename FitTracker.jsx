import { useState, useEffect } from "react";

// ─── DATE ─────────────────────────────────────────────────────────────────────
// Reads device clock in PST/PDT every time called. Never hardcoded.
function todayStr() {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      year: "numeric", month: "2-digit", day: "2-digit",
    }).format(new Date());
  } catch {
    const now = new Date();
    const offset = now.toLocaleString("en-US", { timeZone: "America/Los_Angeles", timeZoneName: "short" }).includes("PDT") ? 7 : 8;
    const pst = new Date(now.getTime() - offset * 3600000);
    return pst.toISOString().split("T")[0];
  }
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
function Icon({ name, size = 16, color = "currentColor", strokeWidth = 1.75 }) {
  const s = { width: size, height: size, display: "block", flexShrink: 0 };
  const p = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    sun: <><circle cx="12" cy="12" r="4" {...p}/><line x1="12" y1="2" x2="12" y2="6" {...p}/><line x1="12" y1="18" x2="12" y2="22" {...p}/><line x1="4.22" y1="4.22" x2="7.05" y2="7.05" {...p}/><line x1="16.95" y1="16.95" x2="19.78" y2="19.78" {...p}/><line x1="2" y1="12" x2="6" y2="12" {...p}/><line x1="18" y1="12" x2="22" y2="12" {...p}/><line x1="4.22" y1="19.78" x2="7.05" y2="16.95" {...p}/><line x1="16.95" y1="7.05" x2="19.78" y2="4.22" {...p}/></>,
    flame: <><path d="M8.5 14.5A2.5 2.5 0 0011 17c0 1.5-1 2.5-2 3 1.5 0 4.5-1 4.5-4.5 0-1.5-1-3-2-4 0 2-1 3-2 3v-1.5z" {...p}/><path d="M12 2C7 7 6 10 6 13a6 6 0 0012 0c0-3-1-6-6-11z" {...p}/></>,
    dumbbell: <><line x1="6.5" y1="6.5" x2="17.5" y2="17.5" {...p}/><path d="M8 8H4a2 2 0 000 4h4M16 16h4a2 2 0 000-4h-4" {...p}/><rect x="2" y="10" width="4" height="4" rx="1" {...p}/><rect x="18" y="10" width="4" height="4" rx="1" {...p}/><line x1="8" y1="12" x2="16" y2="12" {...p}/></>,
    chart: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" {...p}/></>,
    history: <><polyline points="1 4 1 10 7 10" {...p}/><path d="M3.51 15a9 9 0 102.13-9.36L1 10" {...p}/><polyline points="12 7 12 12 16 14" {...p}/></>,
    trophy: <><path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4" {...p}/><path d="M6 5h12v7a6 6 0 01-12 0V5z" {...p}/><line x1="12" y1="18" x2="12" y2="22" {...p}/><line x1="8" y1="22" x2="16" y2="22" {...p}/></>,
    barbell: <><line x1="4" y1="12" x2="20" y2="12" {...p}/><rect x="2" y="9" width="4" height="6" rx="1" {...p}/><rect x="18" y="9" width="4" height="6" rx="1" {...p}/><rect x="6" y="7" width="2" height="10" rx="1" {...p}/><rect x="16" y="7" width="2" height="10" rx="1" {...p}/></>,
    bolt: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...p}/></>,
    run: <><circle cx="13" cy="4" r="1.5" {...p}/><path d="M9 20l2-6H8l3-7h5l-1 4h3l-4 9" {...p}/></>,
    bike: <><circle cx="5.5" cy="17.5" r="3.5" {...p}/><circle cx="18.5" cy="17.5" r="3.5" {...p}/><path d="M15 6h-3l-2.5 6H15l1 5.5" {...p}/><path d="M5.5 17.5L9 10l3 3" {...p}/></>,
    stairs: <><polyline points="4 20 4 14 10 14 10 8 16 8 16 2 20 2 20 20 4 20" {...p}/></>,
    waves: <><path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" {...p}/><path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" {...p}/></>,
    activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" {...p}/></>,
    home: <><path d="M3 12L12 3l9 9" {...p}/><path d="M5 10v11h14V10" {...p}/><path d="M9 21V12h6v9" {...p}/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" {...p}/></>,
    "check-circle": <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" {...p}/><polyline points="22 4 12 14.01 9 11.01" {...p}/></>,
    moon: <><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" {...p}/></>,
    trash: <><polyline points="3 6 5 6 21 6" {...p}/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" {...p}/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" {...p}/><line x1="6" y1="6" x2="18" y2="18" {...p}/></>,
    "chevron-down": <><polyline points="6 9 12 15 18 9" {...p}/></>,
    "chevron-up": <><polyline points="18 15 12 9 6 15" {...p}/></>,
    save: <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" {...p}/><polyline points="17 21 17 13 7 13 7 21" {...p}/><polyline points="7 3 7 8 15 8" {...p}/></>,
    robot: <><rect x="3" y="9" width="18" height="12" rx="2" {...p}/><rect x="8" y="13" width="2" height="2" {...p}/><rect x="14" y="13" width="2" height="2" {...p}/><path d="M8 17h8" {...p}/><path d="M12 9V5" {...p}/><circle cx="12" cy="4" r="1.5" {...p}/><line x1="3" y1="13" x2="1" y2="13" {...p}/><line x1="21" y1="13" x2="23" y2="13" {...p}/></>,
    "bar-chart": <><line x1="18" y1="20" x2="18" y2="10" {...p}/><line x1="12" y1="20" x2="12" y2="4" {...p}/><line x1="6" y1="20" x2="6" y2="14" {...p}/><line x1="2" y1="20" x2="22" y2="20" {...p}/></>,
    target: <><circle cx="12" cy="12" r="10" {...p}/><circle cx="12" cy="12" r="6" {...p}/><circle cx="12" cy="12" r="2" {...p}/></>,
    protein: <><path d="M12 2C8 2 5 5.6 5 10c0 3 1.5 5.5 3.8 7" {...p}/><path d="M12 2c4 0 7 3.6 7 8 0 3-1.5 5.5-3.8 7" {...p}/><path d="M9 17c0 2.8 1.3 5 3 5s3-2.2 3-5" {...p}/><line x1="12" y1="12" x2="12" y2="17" {...p}/></>,
    spark: <><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" {...p}/></>,
  };
  return <svg viewBox="0 0 24 24" style={s}>{icons[name] || <circle cx="12" cy="12" r="10" {...p}/>}</svg>;
}

function DayIcon({ dayIndex, color, size = 40 }) {
  const names = ["barbell", "bolt", "run", "bike", "trophy"];
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.25), background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon name={names[dayIndex] || "dumbbell"} size={Math.round(size * 0.48)} color={color} strokeWidth={1.8} />
    </div>
  );
}

// ─── SMALL UI ─────────────────────────────────────────────────────────────────
function Card({ children, style = {}, onClick }) {
  return <div onClick={onClick} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "18px 20px", cursor: onClick ? "pointer" : undefined, ...style }}>{children}</div>;
}
function Badge({ color, children }) {
  return <span style={{ background: color + "22", color, border: `1px solid ${color}44`, padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{children}</span>;
}
function Ring({ value, max, color, size = 110, label, sub }) {
  const r = (size - 14) / 2, circ = 2 * Math.PI * r, pct = Math.min(value / max, 1), over = value > max;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={7}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={over ? "#f87171" : color} strokeWidth={7} strokeDasharray={`${pct*circ} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray .5s" }}/>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: over ? "#f87171" : color, fontFamily: "monospace" }}>{value.toLocaleString()}</div>
        {label && <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>}
        {sub && <div style={{ fontSize: 9, color: "#444" }}>{sub}</div>}
      </div>
    </div>
  );
}
function MacroBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100), over = value > max;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: "#999" }}>{label}</span>
        <span style={{ color: over ? "#f87171" : color, fontWeight: 700 }}>{value}g <span style={{ color: "#444", fontWeight: 400 }}>/ {max}g</span></span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: over ? "#f87171" : color, transition: "width .4s" }}/>
      </div>
    </div>
  );
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const GOALS = {
  gluteBuilding: { calMin: 1900, calMax: 2100, label: "Glute Building", color: "#FF3CAC" },
  weightLoss:    { calMin: 1700, calMax: 1800, label: "Weight Loss",    color: "#4ade80" },
};
const PROTEIN_TARGET = { min: 140, max: 160 };
const MEAL_SLOTS = ["Breakfast", "Lunch", "Dinner", "Snack"];

const PROGRAM = [
  { day: 1, label: "Glute Focus", location: "home", color: "#FF6B35",
    note: "Landmine cuts effective load ~50%. Prioritise glute squeeze and mind-muscle connection over load. Progress to free bar weeks 3–4.",
    exercises: [
      { id: "bike_warmup",        name: "Stationary Bike Warm-up",             sets: 1, reps: "15 min",    startWeight: 0,  unit: "BW", primary: false },
      { id: "landmine_goblet",    name: "Landmine Goblet Squats",              sets: 3, reps: "12",         startWeight: 22, unit: "lb", primary: true  },
      { id: "landmine_rdl",       name: "Landmine RDLs",                       sets: 3, reps: "12",         startWeight: 22, unit: "lb", primary: true  },
      { id: "split_squat",        name: "Bulgarian Split Squats (BW, cage)",   sets: 3, reps: "8 each",     startWeight: 0,  unit: "BW", primary: false },
      { id: "glute_bridge_floor", name: "Glute Bridges Floor (2s hold)",       sets: 3, reps: "20",         startWeight: 0,  unit: "BW", primary: true  },
    ],
  },
  { day: 2, label: "Cable & Pump", location: "home", color: "#FF3CAC",
    note: "Cable pulley isolation day. Slow and controlled — squeeze at peak contraction. These are your primary glute builders.",
    exercises: [
      { id: "bike_warmup2",       name: "Stationary Bike Warm-up",             sets: 1, reps: "10 min",    startWeight: 0,  unit: "BW", primary: false },
      { id: "cable_kickback",     name: "Cable Kickbacks (pulley)",             sets: 4, reps: "15–20 each",startWeight: 5,  unit: "lb", primary: true  },
      { id: "cable_pull_through", name: "Cable Pull-Throughs (pulley)",         sets: 3, reps: "15",         startWeight: 10, unit: "lb", primary: true  },
      { id: "hip_thrust_bench",   name: "Hip Thrusts (bench + plates)",         sets: 4, reps: "12",         startWeight: 10, unit: "lb", primary: true  },
      { id: "curtsy_lunge",       name: "Curtsy Lunges (BW)",                   sets: 3, reps: "12 each",   startWeight: 0,  unit: "BW", primary: false },
      { id: "glute_bridge",       name: "Glute Bridges (plate loaded)",         sets: 3, reps: "15",         startWeight: 10, unit: "lb", primary: false },
    ],
  },
  { day: 3, label: "Strength & Power", location: "home", color: "#784CF4",
    note: "Heavier landmine work with your 35lb plates. Upper body is knee push-ups — building pressing strength before eventually loading the bar.",
    exercises: [
      { id: "bike_warmup3",       name: "Stationary Bike Warm-up",             sets: 1, reps: "10 min",    startWeight: 0,  unit: "BW", primary: false },
      { id: "landmine_squat",     name: "Landmine Squats",                     sets: 4, reps: "10–12",     startWeight: 22, unit: "lb", primary: true  },
      { id: "landmine_hip_thrust",name: "Landmine Hip Thrusts (floor)",        sets: 4, reps: "12",         startWeight: 22, unit: "lb", primary: true  },
      { id: "step_up",            name: "Step Ups (cage for balance)",          sets: 3, reps: "12 each",   startWeight: 0,  unit: "BW", primary: false },
      { id: "walking_lunge",      name: "Walking Lunges (BW)",                 sets: 3, reps: "20 total",  startWeight: 0,  unit: "BW", primary: false },
      { id: "knee_pushup",        name: "Knee Push-ups",                       sets: 3, reps: "10–12",     startWeight: 0,  unit: "BW", primary: false },
    ],
  },
  { day: 4, label: "Active Recovery", location: "home", color: "#00D4AA",
    note: "Low intensity. 60–70% max heart rate. Drives fat loss through sustained cardio and flushes soreness from days 1–3. This is recovery, not a grind.",
    exercises: [
      { id: "bike_active",        name: "Stationary Bike (steady state)",      sets: 1, reps: "25–30 min", startWeight: 0,  unit: "BW", primary: false },
      { id: "cable_kickback2",    name: "Cable Kickbacks (light, pump focus)", sets: 3, reps: "20 each",   startWeight: 5,  unit: "lb", primary: true  },
      { id: "single_leg_rdl",     name: "Single Leg RDL (BW, balance)",        sets: 3, reps: "10 each",   startWeight: 0,  unit: "BW", primary: false },
      { id: "glute_bridge_pulse", name: "Glute Bridge Pulses (3s hold)",       sets: 3, reps: "25",         startWeight: 0,  unit: "BW", primary: true  },
      { id: "cable_row",          name: "Cable Rows (pulley, light)",          sets: 3, reps: "15",         startWeight: 10, unit: "lb", primary: false },
    ],
  },
  { day: 5, label: "Full Glute + Compound", location: "home", color: "#FFD700",
    note: "Heaviest day. Barbell hip thrusts and RDLs with full plate loading. By week 3–4 aim for 35lb plates each side on hip thrusts.",
    exercises: [
      { id: "bike_warmup5",       name: "Stationary Bike Warm-up",             sets: 1, reps: "10 min",    startWeight: 0,  unit: "BW", primary: false },
      { id: "hip_thrust_bar",     name: "Barbell Hip Thrusts (bench)",          sets: 4, reps: "8–10",      startWeight: 44, unit: "lb", primary: true  },
      { id: "rdl_bar",            name: "Romanian Deadlifts (barbell)",         sets: 3, reps: "10–12",     startWeight: 44, unit: "lb", primary: true  },
      { id: "back_squat",         name: "Back Squats (barbell, cage)",          sets: 3, reps: "8–10",      startWeight: 44, unit: "lb", primary: false },
      { id: "landmine_rdl2",      name: "Landmine RDLs (single leg)",          sets: 3, reps: "10 each",   startWeight: 22, unit: "lb", primary: true  },
      { id: "pike_pushup",        name: "Pike Push-ups",                        sets: 3, reps: "8–10",      startWeight: 0,  unit: "BW", primary: false },
    ],
  },
];

// ─── EXERCISE INFO ────────────────────────────────────────────────────────────
const EX_INFO = {
  bike_warmup:        { muscles: "Full body warm-up", equipment: "Stationary bike", description: "Ride at a comfortable pace to raise heart rate and warm up hips and knees. Keep resistance low. This preps glutes and hamstrings to fire properly.", cues: ["Sit upright, slight forward lean", "Push through full pedal circle", "Aim for light sweat by minute 10"] },
  bike_warmup2:       { muscles: "Full body warm-up", equipment: "Stationary bike", description: "10 min warm-up before cable isolation work. Gets blood flowing to hips and glutes.", cues: ["Low resistance", "Smooth steady pace", "Focus on hip rotation"] },
  bike_warmup3:       { muscles: "Full body warm-up", equipment: "Stationary bike", description: "10 min warm-up before heavier landmine work. Slightly higher resistance to prep for load.", cues: ["Moderate pace", "Full pedal stroke", "Light sweat before you start"] },
  bike_warmup5:       { muscles: "Full body warm-up", equipment: "Stationary bike", description: "10 min warm-up before your heaviest day. Barbell hip thrusts need fully warmed hips.", cues: ["Moderate effort", "Focus on hip looseness", "Don't rush this"] },
  bike_active:        { muscles: "Cardio, fat burn", equipment: "Stationary bike", description: "Steady-state cardio at 60–70% max heart rate. Active recovery — flush soreness, burn fat without breaking down further. Should feel like you could hold a conversation.", cues: ["Keep heart rate moderate", "25–30 minutes consistent pace", "Slight resistance so legs feel engaged"] },
  landmine_goblet:    { muscles: "Glutes, quads, core", equipment: "Barbell + landmine", description: "Hold the bar at chest height with both hands — like holding a goblet. Squat down keeping bar close to chest. The landmine guides movement and the floor takes ~half the bar weight, making this very manageable while still building serious glute strength.", cues: ["Hold bar at chest, elbows pointing down", "Push knees out as you descend", "Drive through heels on the way up", "Squeeze glutes hard at the top"] },
  landmine_rdl:       { muscles: "Glutes, hamstrings, lower back", equipment: "Barbell + landmine", description: "Hold the bar with both hands, stand tall, then hinge at hips — push them back like touching the wall behind you. Let bar travel down thighs. You should feel a deep stretch in hamstrings and glutes. Drive hips forward to come back up.", cues: ["Soft bend in knees throughout", "Push hips back — don't just bend forward", "Keep back flat, chest proud", "Feel the stretch in hamstrings", "Squeeze glutes hard at the top"] },
  landmine_squat:     { muscles: "Glutes, quads, hamstrings", equipment: "Barbell + landmine", description: "Hold bar at chest or shoulder height and squat. The landmine arc guides you into proper depth. Great for building quad and glute strength together.", cues: ["Chest up throughout", "Push knees out over toes", "Full depth — thighs parallel or below", "Explode up through heels"] },
  landmine_hip_thrust:{ muscles: "Glutes (primary), hamstrings", equipment: "Barbell + landmine", description: "Sit on floor with upper back against bench, knees bent, feet flat. Place landmine bar across hips (use towel for comfort). Drive hips up to ceiling until body forms straight line from knees to shoulders. Squeeze hard at the top.", cues: ["Upper back on bench edge", "Drive hips straight up", "Squeeze glutes at the top for 1–2 seconds", "Keep chin tucked"] },
  landmine_rdl2:      { muscles: "Glutes, hamstrings, balance", equipment: "Barbell + landmine", description: "Single-leg RDL using landmine. Stand on one leg and hinge forward. The working leg's glute and hamstring do all the work. Fixes left-right imbalances. Go slow — this is about control.", cues: ["Stand on one leg, soft knee", "Hinge at hip — back leg lifts as counterbalance", "Keep hips square", "Feel stretch in standing leg's hamstring"] },
  split_squat:        { muscles: "Glutes, quads, balance", equipment: "Power cage (for balance), bench", description: "Bulgarian Split Squat — put rear foot on your bench and lower front knee toward floor. Front leg does most work. Use cage frame to balance. The higher the front foot, the more glute activation.", cues: ["Front foot far enough forward that knee doesn't pass toes much", "Lower straight down", "Drive through front heel to come up", "Use cage for balance until comfortable"] },
  glute_bridge_floor: { muscles: "Glutes, hamstrings, core", equipment: "Floor", description: "Lie on back, knees bent, feet flat. Drive hips up by squeezing glutes hard. Hold at top for 2 seconds every rep. Do NOT bounce — the pause is what makes this effective.", cues: ["Feet flat, hip-width apart", "Drive hips up by squeezing glutes", "Hold 2 seconds at top", "Lower slowly"] },
  glute_bridge:       { muscles: "Glutes, hamstrings", equipment: "Weight plate", description: "Same as floor glute bridge but with a weight plate resting on hips for added resistance. Hold plate with both hands. This bridges the gap between bodyweight bridges and full barbell hip thrusts.", cues: ["Place plate just below hip bones", "Same squeeze and pause cues", "Keep core braced"] },
  glute_bridge_pulse: { muscles: "Glutes, hamstrings", equipment: "Floor", description: "Like a regular bridge but stay near the top and do small pulses with a 3-second hold at the peak of each pulse. Creates constant tension. You'll feel the burn fast.", cues: ["Stay near the top", "Tiny movements, big squeeze", "3-second hold at peak", "Burns fast — push through"] },
  hip_thrust_bench:   { muscles: "Glutes (primary), hamstrings", equipment: "Adjustable bench, weight plates", description: "The king of glute exercises. Upper back rests on bench edge, plate on hips. Drive hips to ceiling until body forms straight line from knees to shoulders. More effective than squats for direct glute growth.", cues: ["Upper back mid-scapula on bench", "Feet hip-width, toes slightly out", "Drive hips UP", "Squeeze at top — don't hyperextend lower back", "Lower slowly"] },
  hip_thrust_bar:     { muscles: "Glutes (primary), hamstrings, core", equipment: "Barbell, bench, 35lb plates", description: "Full barbell hip thrust — your heaviest glute exercise. Bar rolled over thighs to hip crease (use a towel for comfort). Drive hips up powerfully. With 44lb bar plus plates you're moving serious weight.", cues: ["Roll bar carefully to hips", "Use folded towel for comfort", "Plant feet firmly", "Explosive drive up, controlled down", "Hold 1 second at top, squeeze hard"] },
  rdl_bar:            { muscles: "Glutes, hamstrings, lower back", equipment: "Barbell", description: "Hold bar in front, push hips back as bar travels down thighs. Stop when you feel a strong hamstring stretch (around mid-shin). One of the best posterior chain builders you can do.", cues: ["Bar stays close to legs", "Push hips back — don't just fold forward", "Soft knee bend, back flat", "Feel hamstring stretch at bottom", "Drive hips forward to stand"] },
  back_squat:         { muscles: "Quads, glutes, hamstrings, core", equipment: "Barbell, power cage", description: "Classic back squat. Bar on upper back (not neck). Descend until thighs parallel or below. Cage lets you bail safely. Start with just the bar to nail form.", cues: ["Bar on upper traps, not neck", "Chest up, brace core before every rep", "Push knees out as you descend", "Drive through mid-foot on the way up"] },
  cable_kickback:     { muscles: "Glutes (isolation)", equipment: "Power cage cable pulley", description: "Attach cable to ankle. Stand facing cage, hold for balance, kick leg straight back squeezing glute hard at the top. Directly isolates glute. Slow and controlled — don't swing.", cues: ["Keep torso still — only leg moves", "Squeeze glute hard at peak", "Slow on the way back", "Don't lean forward"] },
  cable_kickback2:    { muscles: "Glutes (isolation)", equipment: "Power cage cable pulley", description: "Same as kickbacks but lighter on recovery day. Focus on mind-muscle connection. Higher reps, slower tempo.", cues: ["Light weight, perfect form", "Feel every rep in the glute", "Slow controlled movement"] },
  cable_pull_through: { muscles: "Glutes, hamstrings", equipment: "Power cage cable pulley", description: "Stand facing away from cage, reach between legs and grab cable handle. Hinge forward at hips, then drive hips forward powerfully to stand. The cable adds constant tension throughout. Excellent for glutes and hamstrings.", cues: ["Stand far enough for tension at start", "Push hips back on the hinge", "Drive hips forward explosively", "Squeeze glutes hard at the top"] },
  cable_row:          { muscles: "Upper back, rear delts, biceps", equipment: "Power cage cable pulley", description: "Pull cable toward belly button keeping elbows close to body. Squeeze shoulder blades together at end of pull. Builds upper back strength for future barbell work.", cues: ["Sit tall or stand with slight lean back", "Pull elbows back past torso", "Squeeze shoulder blades at end", "Control cable on the way out"] },
  curtsy_lunge:       { muscles: "Glutes, outer glute, quads", equipment: "Bodyweight", description: "Step one foot diagonally behind the other — like a curtsy. Lower back knee toward floor. Crossing the midline activates the outer glute (gluteus medius) more than regular lunges. Great for glute shape.", cues: ["Step back and across", "Keep front knee tracking over toes", "Torso upright", "Push through front heel to return"] },
  step_up:            { muscles: "Glutes, quads, balance", equipment: "Elevated surface, cage for balance", description: "Step up with one foot, drive through that heel to bring full body up, then lower with control. Higher step = more glute activation. Hold cage for balance if needed.", cues: ["Place whole foot on surface", "Drive through heel of stepping foot", "Don't push off back foot", "Control the descent"] },
  walking_lunge:      { muscles: "Glutes, quads, hamstrings, balance", equipment: "Bodyweight", description: "Step forward into lunge, lower back knee toward floor, then drive forward and continue walking. Alternate legs. Builds single-leg strength and glute endurance.", cues: ["Long stride for more glute, short for more quad", "Back knee lightly touches or hovers floor", "Torso stays upright", "Arms swing naturally for balance"] },
  single_leg_rdl:     { muscles: "Glutes, hamstrings, balance, core", equipment: "Bodyweight", description: "Stand on one leg, hinge forward at hip, back leg rises as counterbalance — body forms T-shape. Fixes left-right imbalances. Go slow. Hold something if needed at first.", cues: ["Stand tall before you start", "Hinge at hip — not just bending forward", "Keep hips square", "Feel stretch in standing leg's hamstring"] },
  knee_pushup:        { muscles: "Chest, shoulders, triceps, core", equipment: "Bodyweight", description: "Push-up with knees on floor instead of toes. Reduces load to ~60% bodyweight. Keep body straight from knees to head. When 3×15 feels easy, progress to mixing in full push-ups.", cues: ["Knees on floor, body straight knees to head", "Hands slightly wider than shoulder width", "Lower chest to floor — full range", "Don't let hips sag"] },
  pike_pushup:        { muscles: "Shoulders, triceps, upper chest", equipment: "Bodyweight", description: "Start in downward dog — hips high, body forming inverted V. Lower top of head toward floor, push back up. Targets shoulders more than regular push-up. Stepping stone toward overhead pressing.", cues: ["Hips high throughout", "Lower crown of head toward floor", "Elbows track back slightly", "Full range of motion"] },
};

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const APRIL_30 = [
  { id: 1001, meal: "Breakfast", name: "Non-fat Greek yogurt (194g)",                         calories: 114, protein: 20,  carbs: 8,  fat: 0   },
  { id: 1002, meal: "Breakfast", name: "Strawberries (57g)",                                   calories: 18,  protein: 0.5, carbs: 4,  fat: 0   },
  { id: 1003, meal: "Breakfast", name: "Blueberries (57g)",                                    calories: 33,  protein: 1,   carbs: 8,  fat: 0   },
  { id: 1004, meal: "Breakfast", name: "Kirkland Ancient Grain Probiotic Granola (29g)",       calories: 132, protein: 3,   carbs: 18, fat: 5   },
  { id: 1005, meal: "Breakfast", name: "Kirkland Variety Pastry (1 piece)",                    calories: 200, protein: 3,   carbs: 24, fat: 10  },
  { id: 1006, meal: "Lunch",     name: "Hard boiled eggs (2 whole)",                           calories: 140, protein: 12,  carbs: 1,  fat: 10  },
  { id: 1007, meal: "Lunch",     name: "Boudin sourdough bread (1 slice/47g)",                 calories: 120, protein: 4,   carbs: 23, fat: 1   },
  { id: 1008, meal: "Lunch",     name: "Principe Prosciutto di San Daniele (4 slices/56g)",    calories: 136, protein: 16,  carbs: 0,  fat: 8   },
  { id: 1009, meal: "Lunch",     name: "Queso fresco (30g)",                                   calories: 96,  protein: 6,   carbs: 1,  fat: 8   },
  { id: 1010, meal: "Dinner",    name: "Chicken breast, cooked (weighed portion)",             calories: 100, protein: 14,  carbs: 0,  fat: 1   },
  { id: 10101,meal: "Dinner",    name: "Golden potatoes, diced (weighed portion)",             calories: 45,  protein: 1.2, carbs: 10, fat: 0   },
  { id: 1011, meal: "Dinner",    name: "Carrots, chopped (weighed portion)",                   calories: 17,  protein: 0.4, carbs: 4,  fat: 0   },
  { id: 10111,meal: "Dinner",    name: "Celery (weighed portion)",                             calories: 5,   protein: 0.2, carbs: 1,  fat: 0   },
  { id: 10112,meal: "Dinner",    name: "Yellow onion (weighed portion)",                       calories: 18,  protein: 0.5, carbs: 4,  fat: 0   },
  { id: 10113,meal: "Dinner",    name: "Roma tomato (weighed portion)",                        calories: 4,   protein: 0.2, carbs: 1,  fat: 0   },
  { id: 10114,meal: "Dinner",    name: "Olive oil ~1 tsp (soup portion)",                      calories: 13,  protein: 0,   carbs: 0,  fat: 1.5 },
  { id: 10115,meal: "Dinner",    name: "Knorr chicken stock + spices",                         calories: 13,  protein: 3.5, carbs: 1,  fat: 0   },
  { id: 10116,meal: "Dinner",    name: "Bowtie pasta, cooked (35g)",                           calories: 52,  protein: 2,   carbs: 11, fat: 0   },
  { id: 1012, meal: "Snack",     name: "Mission Carb Balance flour tortillas (2/86g)",         calories: 140, protein: 12,  carbs: 22, fat: 4   },
  { id: 1013, meal: "Snack",     name: "Kirkland Monterey Jack cheese (46g)",                  calories: 100, protein: 14,  carbs: 1,  fat: 8   },
  { id: 1014, meal: "Snack",     name: "Principe Prosciutto di San Daniele (4 slices/56g)",    calories: 136, protein: 16,  carbs: 0,  fat: 8   },
  { id: 1015, meal: "Snack",     name: "Banana (1 medium/105g)",                               calories: 105, protein: 1,   carbs: 27, fat: 0   },
  { id: 1016, meal: "Snack",     name: "ON Gold Standard Whey (1 scoop/31g)",                  calories: 120, protein: 24,  carbs: 4,  fat: 1.5 },
  { id: 1017, meal: "Snack",     name: "Kirkland 2% Lactose Free Milk (12oz/355ml)",           calories: 195, protein: 12,  carbs: 18, fat: 8   },
];

const MAY_1 = [
  { id: 2001, meal: "Breakfast", name: "Whole eggs, cracked (4 eggs/~200g)",        calories: 280, protein: 24,  carbs: 2,  fat: 20  },
  { id: 2002, meal: "Breakfast", name: "Idaho Gold Potatoes (140g)",                calories: 104, protein: 2.8, carbs: 24, fat: 0   },
  { id: 2003, meal: "Breakfast", name: "Mission Carb Balance Tortilla (1/43g)",     calories: 70,  protein: 6,   carbs: 14, fat: 1   },
  { id: 2004, meal: "Breakfast", name: "Queso Fresco (17g)",                        calories: 55,  protein: 3.6, carbs: 0,  fat: 4   },
  { id: 2005, meal: "Breakfast", name: "Yellow onion (52g)",                        calories: 21,  protein: 0.6, carbs: 5,  fat: 0   },
  { id: 2006, meal: "Breakfast", name: "Roma tomato (99g)",                         calories: 18,  protein: 0.9, carbs: 4,  fat: 0   },
  { id: 2007, meal: "Breakfast", name: "Olive oil (1 tsp) + spices",               calories: 40,  protein: 0,   carbs: 0,  fat: 5   },
  { id: 2008, meal: "Breakfast", name: "Banana (1 medium)",                         calories: 105, protein: 1.3, carbs: 27, fat: 0   },
  { id: 2009, meal: "Breakfast", name: "Costco Pastry (1 piece)",                   calories: 155, protein: 3,   carbs: 22, fat: 6   },
  { id: 2010, meal: "Lunch",     name: "Non-fat Greek yogurt (206g)",               calories: 121, protein: 21.2,carbs: 8,  fat: 0   },
  { id: 2011, meal: "Lunch",     name: "Strawberries (58g)",                        calories: 19,  protein: 0.4, carbs: 5,  fat: 0   },
  { id: 2012, meal: "Lunch",     name: "Blueberries (69g)",                         calories: 39,  protein: 0.5, carbs: 10, fat: 0   },
  { id: 2013, meal: "Lunch",     name: "Kirkland Ancient Grain Granola (28g)",      calories: 128, protein: 2.9, carbs: 18, fat: 5   },
  { id: 2020, meal: "Dinner",    name: "Salmon fillet, pan seared (199g)",          calories: 372, protein: 44,  carbs: 0,  fat: 21  },
  { id: 2021, meal: "Dinner",    name: "Bell peppers (58g)",                        calories: 19,  protein: 0.6, carbs: 4,  fat: 0   },
  { id: 2022, meal: "Dinner",    name: "Cherry tomatoes (82g)",                     calories: 15,  protein: 0.7, carbs: 3,  fat: 0   },
  { id: 2023, meal: "Dinner",    name: "Carrots (118g)",                            calories: 41,  protein: 0.9, carbs: 10, fat: 0   },
  { id: 2024, meal: "Dinner",    name: "Celery (60g)",                              calories: 10,  protein: 0.4, carbs: 2,  fat: 0   },
  { id: 2025, meal: "Dinner",    name: "Corn (107g)",                               calories: 90,  protein: 3.4, carbs: 20, fat: 1   },
  { id: 2026, meal: "Dinner",    name: "Peas (50g)",                                calories: 42,  protein: 2.8, carbs: 7,  fat: 0   },
  { id: 2027, meal: "Dinner",    name: "Hellmann's Light Mayo (15g)",               calories: 45,  protein: 0,   carbs: 1,  fat: 4.5 },
  { id: 2028, meal: "Dinner",    name: "Vlasic Dill Pickles, 3 spears (28g)",       calories: 5,   protein: 0,   carbs: 1,  fat: 0   },
  { id: 2029, meal: "Dinner",    name: "Lemon juice + cilantro + spices",           calories: 5,   protein: 0.2, carbs: 1,  fat: 0   },
  { id: 2030, meal: "Snack",     name: "ON Gold Standard Whey (1 scoop/31g)",       calories: 120, protein: 24,  carbs: 4,  fat: 1.5 },
  { id: 2031, meal: "Snack",     name: "Kirkland 2% Lactose Free Milk (12oz/355ml)",calories: 195, protein: 12,  carbs: 18, fat: 8   },
];

const MAY_2 = [
  { id: 4001, meal: "Breakfast", name: "Banana (1 medium)",                 calories: 105, protein: 1.3, carbs: 27, fat: 0  },
  { id: 4002, meal: "Breakfast", name: "Peanut butter (1 tbsp)",            calories: 94,  protein: 4,   carbs: 3,  fat: 8  },
  { id: 4003, meal: "Breakfast", name: "Boudin sourdough bread (1 slice)",   calories: 120, protein: 4,   carbs: 23, fat: 1  },
  { id: 4004, meal: "Lunch",     name: "3x3 Campus Burger (est.)",          calories: 1400,protein: 65,  carbs: 80, fat: 75 },
  { id: 4005, meal: "Lunch",     name: "Campus Fries (est.)",               calories: 450, protein: 6,   carbs: 58, fat: 22 },
];

const MAY_3 = [
  { id: 3001, meal: "Breakfast", name: "Idaho Gold Potatoes (140g)",        calories: 104, protein: 2.8, carbs: 24, fat: 0 },
  { id: 3002, meal: "Breakfast", name: "Yellow onion (52g)",                calories: 21,  protein: 0.6, carbs: 5,  fat: 0 },
  { id: 3003, meal: "Breakfast", name: "Roma tomato (99g)",                 calories: 18,  protein: 0.9, carbs: 4,  fat: 0 },
  { id: 3004, meal: "Breakfast", name: "Queso Fresco (17g)",                calories: 55,  protein: 3.6, carbs: 0,  fat: 4 },
];

const MAY_4 = [
  { id: 6001, meal: "Dinner",    name: "Tri-color quinoa, cooked (half)",   calories: 170, protein: 6,   carbs: 30, fat: 1.5 },
  { id: 6002, meal: "Dinner",    name: "Carrots, chopped (~70g)",           calories: 29,  protein: 0.7, carbs: 7,  fat: 0   },
  { id: 6003, meal: "Dinner",    name: "Celery (~50g)",                     calories: 8,   protein: 0.3, carbs: 1,  fat: 0   },
  { id: 6004, meal: "Dinner",    name: "Peas (~50g)",                       calories: 42,  protein: 2.8, carbs: 7,  fat: 0   },
  { id: 6005, meal: "Dinner",    name: "Mini bell pepper (~30g)",           calories: 10,  protein: 0.4, carbs: 2,  fat: 0   },
  { id: 6006, meal: "Dinner",    name: "Kellogg's Club Crackers (15)",      calories: 263, protein: 1,   carbs: 34, fat: 11  },
];

const MAY_1_WORKOUT = {
  id: 5001, date: "2026-05-01", dayIndex: 0,
  sessionNotes: "First session back. Landmine strategy — 44lb bar too heavy, landmine cuts load ~50%. Focus on mind-muscle connection. Great glute pump. Bike warm-up helped joints.",
  logs: [
    { exId: "bike_warmup",        weight: 0,  sets: "1", reps: "15 min" },
    { exId: "landmine_goblet",    weight: 22, sets: "3", reps: "12"     },
    { exId: "landmine_rdl",       weight: 22, sets: "3", reps: "12"     },
    { exId: "split_squat",        weight: 0,  sets: "3", reps: "8 each" },
    { exId: "glute_bridge_floor", weight: 0,  sets: "3", reps: "20"     },
  ],
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "fittracker_clean_v1";

function loadData() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveData(d) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {}
}

// Seed a date — only adds entries missing by id, never deletes
function seedDate(base, date, entries) {
  if (!entries || entries.length === 0) return;
  const existing = base.calorieLog[date] || [];
  const existingIds = new Set(existing.map(e => e.id));
  const toAdd = entries.filter(e => !existingIds.has(e.id));
  if (toAdd.length > 0) base.calorieLog[date] = [...existing, ...toAdd];
}

function initData() {
  const saved = loadData();
  const base = saved || { calorieLog: {}, goalMode: "gluteBuilding", customGoal: null, sessions: [], prs: {} };
  // Seed all historical dates
  seedDate(base, "2026-04-30", APRIL_30);
  seedDate(base, "2026-05-01", MAY_1);
  seedDate(base, "2026-05-02", MAY_2);
  seedDate(base, "2026-05-03", MAY_3);
  seedDate(base, "2026-05-04", MAY_4);
  // Seed May 1 workout
  if (!base.sessions.some(s => s.id === 5001)) {
    base.sessions = [MAY_1_WORKOUT, ...base.sessions];
  }
  saveData(base);
  return base;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function formatDate(s) {
  return new Date(s + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function getWeek7(today) {
  const d = [];
  const base = new Date(today + "T12:00:00");
  for (let i = 6; i >= 0; i--) {
    const dt = new Date(base); dt.setDate(dt.getDate() - i);
    d.push(dt.toISOString().split("T")[0]);
  }
  return d;
}
function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const j = new Date(d.getFullYear(), 0, 1);
  const w = Math.ceil(((d - j) / 86400000 + j.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(w).padStart(2, "0")}`;
}
function suggestWeight(exId, sessions, startWeight) {
  const rel = sessions.filter(s => s.logs?.some(l => l.exId === exId)).sort((a, b) => b.date > a.date ? 1 : -1);
  if (!rel.length) return startWeight;
  return rel[0].logs.find(l => l.exId === exId)?.weight ?? startWeight;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const TOP_TABS = [
  { id: "today",     label: "Today",     icon: "sun"      },
  { id: "nutrition", label: "Nutrition", icon: "flame"    },
  { id: "workout",   label: "Workout",   icon: "dumbbell" },
  { id: "progress",  label: "Progress",  icon: "chart"    },
  { id: "history",   label: "History",   icon: "history"  },
];

export default function FitTracker() {
  const [tab, setTab] = useState("today");
  const [data, setData] = useState(initData);
  // currentDate: re-reads device clock in PST on mount and every 60s and on window focus
  const [currentDate, setCurrentDate] = useState(() => todayStr());

  useEffect(() => {
    const tick = setInterval(() => setCurrentDate(todayStr()), 60000);
    const onFocus = () => setCurrentDate(todayStr());
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(tick); window.removeEventListener("focus", onFocus); };
  }, []);

  function update(fn) {
    setData(prev => { const next = fn(prev); saveData(next); return next; });
  }

  const todayEntries = data.calorieLog[currentDate] || [];
  const todayCal     = todayEntries.reduce((s, e) => s + (e.calories || 0), 0);
  const todayProtein = todayEntries.reduce((s, e) => s + (e.protein  || 0), 0);
  const goal    = data.customGoal || GOALS[data.goalMode];
  const goalMid = Math.round(((goal.calMin || 1900) + (goal.calMax || 2100)) / 2);

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
              <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>158lb · 1900–2100 cal · 140–160g protein · {currentDate}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#FF3CAC", fontFamily: "monospace" }}>{todayCal}</div>
            <div style={{ fontSize: 10, color: "#555" }}>cal today</div>
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
        {tab === "today"     && <TodayTab     currentDate={currentDate} data={data} update={update} goal={goal} goalMid={goalMid} todayCal={todayCal} todayProtein={todayProtein} todayEntries={todayEntries} />}
        {tab === "nutrition" && <NutritionTab currentDate={currentDate} data={data} update={update} goal={goal} />}
        {tab === "workout"   && <WorkoutTab   currentDate={currentDate} data={data} update={update} />}
        {tab === "progress"  && <ProgressTab  currentDate={currentDate} data={data} goal={goal} />}
        {tab === "history"   && <HistoryTab   data={data} update={update} goal={goal} />}
      </div>
    </div>
  );
}

// ─── MEAL SECTION ─────────────────────────────────────────────────────────────
function EntryRow({ e, onDelete, indent = false }) {
  return (
    <div style={{ padding: indent ? "6px 10px 6px 20px" : "8px 12px", borderRadius: 9, background: indent ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)", marginBottom: 3, borderLeft: indent ? "2px solid rgba(255,255,255,0.08)" : "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <span style={{ color: indent ? "#999" : "#ccc", fontSize: 12, lineHeight: 1.4, flex: 1 }}>{e.name}</span>
        {onDelete && (
          <button onClick={() => onDelete(e.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Icon name="x" size={12} color="#444" strokeWidth={2.5} />
          </button>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 3, flexWrap: "wrap" }}>
        <span style={{ color: "#FF6B35", fontWeight: 700, fontSize: 11 }}>{e.calories} cal</span>
        <span style={{ color: "#784CF4", fontSize: 11 }}>{e.protein}g P</span>
        {e.carbs > 0 && <span style={{ color: "#FF6B3577", fontSize: 11 }}>{e.carbs}g C</span>}
        {e.fat > 0 && <span style={{ color: "#00D4AA77", fontSize: 11 }}>{e.fat}g F</span>}
      </div>
    </div>
  );
}

function MealSection({ label, entries, totalCal, totalProtein, onDelete }) {
  const [expandedGroups, setExpandedGroups] = useState({});
  const ungrouped = entries.filter(e => !e.groupId);
  const groups = {};
  entries.filter(e => e.groupId).forEach(e => { if (!groups[e.groupId]) groups[e.groupId] = []; groups[e.groupId].push(e); });
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{label}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ color: "#FF6B35", fontSize: 12, fontWeight: 700 }}>{totalCal} cal</span>
          <span style={{ color: "#784CF4", fontSize: 12 }}>{Math.round(totalProtein)}g P</span>
        </div>
      </div>
      {ungrouped.map(e => <EntryRow key={e.id} e={e} onDelete={onDelete} />)}
      {Object.entries(groups).map(([gid, items]) => {
        const gCal = items.reduce((s, e) => s + (e.calories || 0), 0);
        const gProt = items.reduce((s, e) => s + (e.protein || 0), 0);
        const open = expandedGroups[gid];
        return (
          <div key={gid} style={{ marginBottom: 4 }}>
            <div onClick={() => setExpandedGroups(p => ({ ...p, [gid]: !p[gid] }))}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 9, background: "rgba(255,255,255,0.04)", cursor: "pointer", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name={open ? "chevron-up" : "chevron-down"} size={13} color="#888" strokeWidth={2.5} />
                  <span style={{ color: "#ccc", fontSize: 12, fontWeight: 600 }}>{items[0].name.split("(")[0].trim()}{items.length > 1 ? ` + ${items.length - 1} more` : ""}</span>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 3, marginLeft: 19 }}>
                  <span style={{ color: "#FF6B35", fontWeight: 700, fontSize: 11 }}>{gCal} cal</span>
                  <span style={{ color: "#784CF4", fontSize: 11 }}>{Math.round(gProt)}g P</span>
                  <span style={{ fontSize: 11, color: "#555" }}>{items.length} ingredients</span>
                </div>
              </div>
              <button onClick={e2 => { e2.stopPropagation(); if (onDelete) items.forEach(i => onDelete(i.id)); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
                <Icon name="x" size={13} color="#444" strokeWidth={2.5} />
              </button>
            </div>
            {open && <div style={{ marginTop: 2 }}>{items.map(e => <EntryRow key={e.id} e={e} onDelete={onDelete} indent />)}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── TODAY TAB ────────────────────────────────────────────────────────────────
function TodayTab({ currentDate, data, update, goal, goalMid, todayCal, todayProtein, todayEntries }) {
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
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800,
          messages: [{ role: "user", content: `Estimate nutrition for: "${aiInput}". If single item: {"items":[{"name":"...","calories":0,"protein":0,"carbs":0,"fat":0}]}. If multiple ingredients, break each out separately. Return ONLY JSON, no markdown.` }] })
      });
      const json = await res.json();
      const parsed = JSON.parse((json.content?.[0]?.text || "").replace(/```json|```/g, "").trim());
      const items = parsed.items || [parsed];
      const groupId = items.length > 1 ? `grp_${Date.now()}` : null;
      const newEntries = items.map((item, i) => ({ id: Date.now() + i, meal, groupId, ...item }));
      update(prev => ({ ...prev, calorieLog: { ...prev.calorieLog, [currentDate]: [...(prev.calorieLog[currentDate] || []), ...newEntries] } }));
      setAiInput("");
    } catch { alert("Couldn't parse — try being more specific!"); }
    setLoading(false);
  }

  return (
    <div>
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
              onDelete={id => update(prev => ({ ...prev, calorieLog: { ...prev.calorieLog, [currentDate]: (prev.calorieLog[currentDate] || []).filter(x => x.id !== id) } }))} />;
          })}
        </div>
      )}
    </div>
  );
}

// ─── NUTRITION TAB ────────────────────────────────────────────────────────────
function NutritionTab({ currentDate, data, update, goal }) {
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
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800,
          messages: [{ role: "user", content: `Estimate nutrition for: "${aiInput}". If single item: {"items":[{"name":"...","calories":0,"protein":0,"carbs":0,"fat":0}]}. If multiple ingredients break each out. ONLY JSON, no markdown.` }] })
      });
      const json = await res.json();
      const parsed = JSON.parse((json.content?.[0]?.text || "").replace(/```json|```/g, "").trim());
      const items = parsed.items || [parsed];
      const groupId = items.length > 1 ? `grp_${Date.now()}` : null;
      const newEntries = items.map((item, i) => ({ id: Date.now() + i, meal, groupId, ...item }));
      update(prev => ({ ...prev, calorieLog: { ...prev.calorieLog, [selDate]: [...(prev.calorieLog[selDate] || []), ...newEntries] } }));
      setAiInput("");
    } catch { alert("Couldn't parse — try being more specific!"); }
    setLoading(false);
  }

  function switchGoal(mode) { setGoalMode(mode); update(prev => ({ ...prev, goalMode: mode, customGoal: null })); }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Nutrition</h2>
        <input type="date" value={selDate} onChange={e => setSelDate(e.target.value)}
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontFamily: "inherit" }} />
      </div>
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
          onDelete={id => update(prev => ({ ...prev, calorieLog: { ...prev.calorieLog, [selDate]: prev.calorieLog[selDate].filter(x => x.id !== id) } }))} />;
      })}
    </div>
  );
}

// ─── WORKOUT TAB ──────────────────────────────────────────────────────────────
const WK_TABS = [
  { id: "week",    label: "Week",    icon: "check-circle" },
  { id: "program", label: "Program", icon: "target"       },
  { id: "log",     label: "Log",     icon: "save"         },
  { id: "cardio",  label: "Cardio",  icon: "activity"     },
  { id: "burn",    label: "Burn",    icon: "flame"        },
  { id: "prs",     label: "PRs",     icon: "trophy"       },
];

function WorkoutTab({ currentDate, data, update }) {
  const [wkTab, setWkTab] = useState("program");
  return (
    <div>
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
      {wkTab === "week"    && <WeekPanel    currentDate={currentDate} data={data} />}
      {wkTab === "program" && <ProgramPanel data={data} />}
      {wkTab === "log"     && <LogPanel     currentDate={currentDate} data={data} update={update} />}
      {wkTab === "cardio"  && <CardioPanel  currentDate={currentDate} data={data} update={update} />}
      {wkTab === "burn"    && <BurnPanel    data={data} />}
      {wkTab === "prs"     && <PRsPanel     data={data} />}
    </div>
  );
}

// ─── WEEK PANEL ───────────────────────────────────────────────────────────────
function getWeekNumber(dateStr) {
  const start = new Date("2026-05-01T00:00:00");
  const d = new Date(dateStr + "T00:00:00");
  return Math.max(1, Math.floor((d - start) / (7 * 24 * 3600 * 1000)) + 1);
}

function WeekPanel({ currentDate, data }) {
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
function ProgramPanel({ data }) {
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
                        <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{ex.sets}×{ex.reps}</div>
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
function LogPanel({ currentDate, data, update }) {
  const [selDay, setSelDay] = useState(0);
  const [date, setDate] = useState(currentDate);
  const [logs, setLogs] = useState({});
  const [sessionNotes, setSessionNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const day = PROGRAM[selDay];

  function handleLog(exId, field, val) { setLogs(p => ({ ...p, [exId]: { ...p[exId], [field]: val } })); }
  function saveSession() {
    const logArr = Object.entries(logs).map(([exId, l]) => ({ exId, ...l }));
    update(prev => {
      const newPrs = { ...prev.prs };
      logArr.forEach(l => { const w = parseFloat(l.weight) || 0; if (w > 0 && (!newPrs[l.exId] || w > newPrs[l.exId].weight)) newPrs[l.exId] = { weight: w, date }; });
      return { ...prev, sessions: [...prev.sessions, { id: Date.now(), date, dayIndex: selDay, logs: logArr, sessionNotes }], prs: newPrs };
    });
    setSaved(true); setTimeout(() => setSaved(false), 2500); setLogs({}); setSessionNotes("");
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {PROGRAM.map((d, i) => (
          <button key={i} onClick={() => setSelDay(i)} style={{ background: selDay === i ? d.color + "22" : "rgba(255,255,255,0.03)", border: `1px solid ${selDay === i ? d.color : "rgba(255,255,255,0.08)"}`, color: selDay === i ? d.color : "#555", padding: "8px 6px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
            <DayIcon dayIndex={i} color={d.color} size={26} />
            <div style={{ textAlign: "left" }}><div style={{ fontSize: 11, fontWeight: 700 }}>Day {d.day}</div><div style={{ fontSize: 9, marginTop: 1, color: selDay === i ? d.color + "99" : "#333" }}>{d.label}</div></div>
          </button>
        ))}
      </div>
      <input type="date" value={date} onChange={e => setDate(e.target.value)}
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#F0EDE8", borderRadius: 10, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", width: "100%", boxSizing: "border-box", marginBottom: 12 }} />
      {day.exercises.map(ex => {
        const suggested = suggestWeight(ex.id, data.sessions, ex.startWeight);
        const log = logs[ex.id] || {};
        const pr = data.prs[ex.id];
        const isNewPr = parseFloat(log.weight) > (pr?.weight || 0);
        return (
          <Card key={ex.id} style={{ marginBottom: 10, borderColor: ex.primary ? day.color + "44" : undefined }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 700, fontSize: 13 }}>
                  {ex.primary && <Icon name="star" size={11} color={day.color} strokeWidth={2} />}{ex.name}
                </div>
                <div style={{ fontSize: 11, color: "#555" }}>Target: {ex.sets}×{ex.reps}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                {isNewPr && <div style={{ fontSize: 11, color: "#FFD700", fontWeight: 700 }}>🏆 New PR!</div>}
                <div style={{ fontSize: 11, color: "#444" }}>Last: {suggested}{ex.unit !== "BW" ? ex.unit : ""}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
              {[["weight", `Wt (${ex.unit})`, suggested], ["sets", "Sets", ex.sets], ["reps", "Reps", "—"]].map(([f, lbl, ph]) => (
                <div key={f}><label style={{ fontSize: 10, color: "#555", display: "block", marginBottom: 2 }}>{lbl}</label>
                  <input value={log[f] || ""} onChange={e => handleLog(ex.id, f, e.target.value)} placeholder={String(ph)}
                    style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "#F0EDE8", borderRadius: 7, padding: "6px 8px", fontSize: 12, fontFamily: "inherit" }} />
                </div>
              ))}
            </div>
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

// ─── CARDIO PANEL ─────────────────────────────────────────────────────────────
function CardioPanel({ currentDate, data, update }) {
  const types = [{ id: "bike", icon: "bike", label: "Bike" }, { id: "stairmaster", icon: "stairs", label: "Stairmaster" }, { id: "swim", icon: "waves", label: "Swim" }, { id: "other", icon: "run", label: "Other" }];
  const [form, setForm] = useState({ date: currentDate, type: "bike", duration: "", intensity: "", notes: "" });
  const [saved, setSaved] = useState(false);

  function save() {
    if (!form.duration) return;
    update(prev => ({ ...prev, sessions: [...prev.sessions, { id: Date.now(), date: form.date, dayIndex: -1, logs: [], sessionNotes: form.notes, cardioLog: { type: form.type, duration: form.duration, intensity: form.intensity } }] }));
    setSaved(true); setTimeout(() => setSaved(false), 2000); setForm(f => ({ ...f, duration: "", intensity: "", notes: "" }));
  }

  const history = data.sessions.filter(s => s.cardioLog).sort((a, b) => b.date > a.date ? 1 : -1).slice(0, 6);
  return (
    <div>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 10 }}>
          {types.map(t => (
            <button key={t.id} onClick={() => setForm(f => ({ ...f, type: t.id }))} style={{ background: form.type === t.id ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${form.type === t.id ? "#00D4AA" : "rgba(255,255,255,0.08)"}`, color: form.type === t.id ? "#00D4AA" : "#555", padding: "10px 8px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <Icon name={t.icon} size={14} color={form.type === t.id ? "#00D4AA" : "#555"} strokeWidth={2} />{t.label}
            </button>
          ))}
        </div>
        <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", borderRadius: 8, padding: "7px 10px", fontSize: 12, fontFamily: "inherit", width: "100%", boxSizing: "border-box", marginBottom: 8 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[["duration", "Duration (min)", "30"], ["intensity", form.type === "swim" ? "Laps" : "Level/Resistance", "8"]].map(([k, lbl, ph]) => (
            <div key={k}><label style={{ fontSize: 11, color: "#555", display: "block", marginBottom: 3 }}>{lbl}</label>
              <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={ph}
                style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "#F0EDE8", borderRadius: 8, padding: "7px 10px", fontSize: 12, fontFamily: "inherit" }} />
            </div>
          ))}
        </div>
        <button onClick={save} style={{ width: "100%", padding: "11px", background: saved ? "#00D4AA" : "linear-gradient(135deg,#00D4AA,#784CF4)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Icon name="save" size={15} color="#fff" strokeWidth={2} />{saved ? "Logged!" : "Log Cardio"}
        </button>
      </Card>
      {history.map(s => {
        const c = s.cardioLog, t = types.find(x => x.id === c.type);
        return (
          <Card key={s.id} style={{ marginBottom: 8, padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(0,212,170,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={t?.icon || "activity"} size={16} color="#00D4AA" strokeWidth={2} />
                </div>
                <div><div style={{ fontWeight: 700, fontSize: 13 }}>{t?.label}</div><div style={{ fontSize: 11, color: "#555" }}>{formatDate(s.date)}</div></div>
              </div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 15, fontWeight: 700, color: "#00D4AA" }}>{c.duration} min</div>{c.intensity && <div style={{ fontSize: 11, color: "#555" }}>Lvl {c.intensity}</div>}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── BURN PANEL ───────────────────────────────────────────────────────────────
const DEFAULT_BURN = [
  { dayIndex: 0, label: "Day 1 — Glute Focus", color: "#FF6B35", exercises: [
    { id: "b_bike1",        name: "Stationary Bike Warm-up",          met: 5.0, duration: 15, unit: "min" },
    { id: "b_lm_goblet",    name: "Landmine Goblet Squats",           met: 4.5, sets: 3, reps: 12, restSec: 60 },
    { id: "b_lm_rdl",       name: "Landmine RDLs",                    met: 4.5, sets: 3, reps: 12, restSec: 60 },
    { id: "b_split_squat",  name: "Bulgarian Split Squats (BW)",      met: 4.0, sets: 3, reps: 16, restSec: 60 },
    { id: "b_glute_bridge", name: "Glute Bridges Floor (2s hold)",    met: 3.5, sets: 3, reps: 20, restSec: 45 },
  ]},
  { dayIndex: 1, label: "Day 2 — Cable & Pump", color: "#FF3CAC", exercises: [
    { id: "b_bike2",        name: "Stationary Bike Warm-up",          met: 5.0, duration: 10, unit: "min" },
    { id: "b_cable_kick",   name: "Cable Kickbacks",                  met: 3.5, sets: 4, reps: 17, restSec: 45 },
    { id: "b_pull_through", name: "Cable Pull-Throughs",              met: 4.0, sets: 3, reps: 15, restSec: 45 },
    { id: "b_hip_thrust_b", name: "Hip Thrusts (bench)",              met: 4.0, sets: 4, reps: 12, restSec: 60 },
    { id: "b_curtsy",       name: "Curtsy Lunges",                    met: 4.0, sets: 3, reps: 12, restSec: 45 },
    { id: "b_glute_br2",    name: "Glute Bridges (plate)",            met: 3.5, sets: 3, reps: 15, restSec: 45 },
  ]},
  { dayIndex: 2, label: "Day 3 — Strength & Power", color: "#784CF4", exercises: [
    { id: "b_bike3",        name: "Stationary Bike Warm-up",          met: 5.0, duration: 10, unit: "min" },
    { id: "b_lm_squat",     name: "Landmine Squats",                  met: 5.0, sets: 4, reps: 11, restSec: 60 },
    { id: "b_lm_hip",       name: "Landmine Hip Thrusts",             met: 4.5, sets: 4, reps: 12, restSec: 60 },
    { id: "b_step_up",      name: "Step Ups",                         met: 4.5, sets: 3, reps: 12, restSec: 45 },
    { id: "b_walk_lunge",   name: "Walking Lunges",                   met: 4.5, sets: 3, reps: 20, restSec: 45 },
    { id: "b_knee_pushup",  name: "Knee Push-ups",                    met: 3.0, sets: 3, reps: 11, restSec: 30 },
  ]},
  { dayIndex: 3, label: "Day 4 — Active Recovery", color: "#00D4AA", exercises: [
    { id: "b_bike4",        name: "Stationary Bike (steady state)",   met: 5.5, duration: 27, unit: "min" },
    { id: "b_cable_kick2",  name: "Cable Kickbacks (light)",          met: 3.5, sets: 3, reps: 20, restSec: 30 },
    { id: "b_sl_rdl",       name: "Single Leg RDL",                   met: 4.0, sets: 3, reps: 10, restSec: 45 },
    { id: "b_glute_pulse",  name: "Glute Bridge Pulses",              met: 3.0, sets: 3, reps: 25, restSec: 30 },
    { id: "b_cable_row",    name: "Cable Rows (light)",               met: 3.0, sets: 3, reps: 15, restSec: 45 },
  ]},
  { dayIndex: 4, label: "Day 5 — Full Glute + Compound", color: "#FFD700", exercises: [
    { id: "b_bike5",        name: "Stationary Bike Warm-up",          met: 5.0, duration: 10, unit: "min" },
    { id: "b_hip_thrust5",  name: "Barbell Hip Thrusts",              met: 4.5, sets: 4, reps: 9,  restSec: 75 },
    { id: "b_rdl5",         name: "Romanian Deadlifts",               met: 5.0, sets: 3, reps: 11, restSec: 75 },
    { id: "b_squat5",       name: "Back Squats",                      met: 5.5, sets: 3, reps: 9,  restSec: 75 },
    { id: "b_lm_rdl2",      name: "Landmine RDLs (single leg)",       met: 4.5, sets: 3, reps: 10, restSec: 60 },
    { id: "b_pike_pushup",  name: "Pike Push-ups",                    met: 3.0, sets: 3, reps: 9,  restSec: 45 },
  ]},
];

const BW_KG = 71.7;
function calcBurn(ex, ov) {
  const met = ov.met ?? ex.met;
  if (ex.unit === "min") return met * BW_KG * ((ov.duration ?? ex.duration) / 60);
  const sets = ov.sets ?? ex.sets, reps = ov.reps ?? ex.reps, rest = ov.restSec ?? ex.restSec;
  const mins = (sets * reps * 3) / 60 + (sets * rest) / 60;
  return met * BW_KG * (mins / 60);
}

function BurnPanel() {
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
function PRsPanel({ data }) {
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
function ProgressTab({ currentDate, data, goal }) {
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

// ─── HISTORY TAB ──────────────────────────────────────────────────────────────
function HistoryTab({ data, update, goal }) {
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
                  <button onClick={() => { if (confirm("Delete this session?")) update(prev => ({ ...prev, sessions: prev.sessions.filter(s => s.id !== session.id) })); }}
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
