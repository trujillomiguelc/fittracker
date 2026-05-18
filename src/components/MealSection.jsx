import { useState } from "react";
import { Icon } from "./ui/index.jsx";

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
