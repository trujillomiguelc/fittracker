import { sbFetch } from "./supabase.js";

export const DB = {
  async loadAll(userId) {
    if (!userId) return null;
    try {
      const [entries, sessions, prs, weeks, settings] = await Promise.all([
        sbFetch(`calorie_entries?user_id=eq.${userId}&order=created_at.asc`),
        sbFetch(`workout_sessions?user_id=eq.${userId}&order=date.asc`),
        sbFetch(`personal_records?user_id=eq.${userId}`),
        sbFetch(`week_tracker?user_id=eq.${userId}`),
        sbFetch(`user_settings?user_id=eq.${userId}`),
      ]);

      const calorieLog = {};
      (entries || []).forEach(e => {
        if (!calorieLog[e.date]) calorieLog[e.date] = [];
        calorieLog[e.date].push({
          id: e.id, meal: e.meal, name: e.name,
          calories: e.calories, protein: e.protein,
          carbs: e.carbs, fat: e.fat, groupId: e.group_id,
        });
      });

      const prsObj = {};
      (prs || []).forEach(p => { prsObj[p.exercise_id] = { weight: p.weight, date: p.date }; });

      const weeksObj = {};
      (weeks || []).forEach(w => {
        weeksObj[w.week_key] = { completed: w.completed || [], locked: w.locked, lockedDate: w.locked_date };
      });

      return {
        calorieLog,
        prs: prsObj,
        weekTracker: weeksObj,
        sessions: (sessions || []).map(s => ({
          id: s.id, date: s.date, dayIndex: s.day_index,
          sessionNotes: s.session_notes, cardioLog: s.cardio_log,
          logs: s.logs || [],
        })),
        goalMode: settings?.[0]?.goal_mode || "gluteBuilding",
      };
    } catch (e) {
      console.error("DB load failed:", e);
      return null;
    }
  },

  async upsertCalorieEntry(userId, entry, date) {
    if (!userId) return;
    await sbFetch("calorie_entries", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: JSON.stringify({
        id: entry.id, user_id: userId, date,
        meal: entry.meal, name: entry.name,
        calories: entry.calories || 0, protein: entry.protein || 0,
        carbs: entry.carbs || 0, fat: entry.fat || 0,
        group_id: entry.groupId || null,
      }),
    });
  },

  async deleteCalorieEntry(userId, id) {
    if (!userId) return;
    await sbFetch(`calorie_entries?id=eq.${id}&user_id=eq.${userId}`, { method: "DELETE" });
  },

  async upsertSession(userId, session) {
    if (!userId) return;
    await sbFetch("workout_sessions", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: JSON.stringify({
        id: session.id, user_id: userId, date: session.date,
        day_index: session.dayIndex, session_notes: session.sessionNotes || "",
        cardio_log: session.cardioLog || null, logs: session.logs || [],
      }),
    });
  },

  async deleteSession(userId, id) {
    if (!userId) return;
    await sbFetch(`workout_sessions?id=eq.${id}&user_id=eq.${userId}`, { method: "DELETE" });
  },

  async upsertPR(userId, exerciseId, weight, date) {
    if (!userId) return;
    await sbFetch("personal_records", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: JSON.stringify({ user_id: userId, exercise_id: exerciseId, weight, date }),
    });
  },

  async upsertWeek(userId, weekKey, data) {
    if (!userId) return;
    await sbFetch("week_tracker", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: JSON.stringify({
        user_id: userId, week_key: weekKey,
        completed: data.completed || [], locked: data.locked || false,
        locked_date: data.lockedDate || null,
      }),
    });
  },

  async upsertSettings(userId, goalMode) {
    if (!userId) return;
    await sbFetch("user_settings", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: JSON.stringify({ user_id: userId, goal_mode: goalMode }),
    });
  },
};
