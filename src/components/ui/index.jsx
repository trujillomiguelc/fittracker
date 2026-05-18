import { useState } from "react";

export function Icon({ name, size = 16, color = "currentColor", strokeWidth = 1.75 }) {
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

export function DayIcon({ dayIndex, color, size = 40 }) {
  const names = ["barbell", "bolt", "run", "bike", "trophy"];
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.25), background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon name={names[dayIndex] || "dumbbell"} size={Math.round(size * 0.48)} color={color} strokeWidth={1.8} />
    </div>
  );
}

export function Card({ children, style = {}, onClick }) {
  return <div onClick={onClick} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "18px 20px", cursor: onClick ? "pointer" : undefined, ...style }}>{children}</div>;
}

export function Badge({ color, children }) {
  return <span style={{ background: color + "22", color, border: `1px solid ${color}44`, padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{children}</span>;
}

export function Ring({ value, max, color, size = 110, label, sub }) {
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

export function MacroBar({ label, value, max, color }) {
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

export function DateBar({ date, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6, marginBottom: 10 }}>
      <input
        type="date"
        value={date}
        onChange={e => onChange(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#F0EDE8",
          borderRadius: 8, padding: "5px 10px",
          fontSize: 12, fontFamily: "inherit",
          fontWeight: 600, colorScheme: "dark",
        }}
      />
    </div>
  );
}
