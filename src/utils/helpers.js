export function todayStr() {
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

export function formatDate(s) {
  return new Date(s + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function getWeek7(today) {
  const d = [];
  const base = new Date(today + "T12:00:00");
  for (let i = 6; i >= 0; i--) {
    const dt = new Date(base); dt.setDate(dt.getDate() - i);
    d.push(dt.toISOString().split("T")[0]);
  }
  return d;
}

export function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const j = new Date(d.getFullYear(), 0, 1);
  const w = Math.ceil(((d - j) / 86400000 + j.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(w).padStart(2, "0")}`;
}

export function getWeekNumber(dateStr) {
  const start = new Date("2026-05-01T00:00:00");
  const d = new Date(dateStr + "T00:00:00");
  return Math.max(1, Math.floor((d - start) / (7 * 24 * 3600 * 1000)) + 1);
}

export function suggestWeight(exId, sessions, startWeight) {
  const rel = sessions.filter(s => s.logs?.some(l => l.exId === exId)).sort((a, b) => b.date > a.date ? 1 : -1);
  if (!rel.length) return startWeight;
  return rel[0].logs.find(l => l.exId === exId)?.weight ?? startWeight;
}

export function calcTDEE(profile) {
  const { weight, heightFt, heightIn, age, sex, activityLevel } = profile;
  const weightKg = weight * 0.453592;
  const heightCm = ((heightFt * 12) + parseInt(heightIn || 0)) * 2.54;
  const bmr = sex === "male"
    ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
    : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
  const ACTIVITY_LEVELS = [
    { id: "sedentary", multiplier: 1.2 }, { id: "light", multiplier: 1.375 },
    { id: "moderate", multiplier: 1.55 }, { id: "very", multiplier: 1.725 },
  ];
  const multiplier = ACTIVITY_LEVELS.find(a => a.id === activityLevel)?.multiplier || 1.375;
  const tdee = Math.round(bmr * multiplier);
  const goalMods = {
    gluteBuilding: { calMin: tdee + 50,  calMax: tdee + 200, proteinMult: 0.9 },
    buildMuscle:   { calMin: tdee + 200, calMax: tdee + 400, proteinMult: 0.9 },
    weightLoss:    { calMin: tdee - 500, calMax: tdee - 300, proteinMult: 1.0 },
    maintenance:   { calMin: tdee - 100, calMax: tdee + 100, proteinMult: 0.75 },
    endurance:     { calMin: tdee,       calMax: tdee + 200, proteinMult: 0.7 },
  };
  const mod = goalMods[profile.goal] || goalMods.maintenance;
  return {
    calMin: Math.max(1200, mod.calMin),
    calMax: Math.max(1400, mod.calMax),
    proteinMin: Math.round(weight * mod.proteinMult * 0.9),
    proteinMax: Math.round(weight * mod.proteinMult * 1.1),
  };
}
