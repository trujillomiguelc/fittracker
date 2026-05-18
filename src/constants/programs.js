// ─── DEFAULT PROGRAM (5-day glute building fallback) ─────────────────────────
const DEFAULT_PROGRAM = [
  { day: 1, label: "Glute Focus",          location: "home", color: "#FF6B35",
    note: "Landmine strategy — bar in landmine cuts load ~50%. Start with just the bar end (no plates) until form is solid. Prioritise glute squeeze over load.",
    exercises: [
      { id: "bike_warmup",         name: "Stationary Bike Warm-up",              sets: 1, reps: "15 min",    startWeight: 0,  unit: "BW",  primary: false },
      { id: "landmine_goblet",     name: "Landmine Goblet Squats",               sets: 3, reps: "12",         startWeight: 0,  unit: "BW",  primary: true  },
      { id: "landmine_rdl",        name: "Landmine RDLs",                        sets: 3, reps: "12",         startWeight: 0,  unit: "BW",  primary: true  },
      { id: "split_squat",         name: "Bulgarian Split Squats (BW, cage)",    sets: 3, reps: "8 each",     startWeight: 0,  unit: "BW",  primary: false },
      { id: "glute_bridge_floor",  name: "Glute Bridges Floor (2s hold)",        sets: 3, reps: "20",         startWeight: 0,  unit: "BW",  primary: true  },
    ],
  },
  { day: 2, label: "Cable & Pump",          location: "home", color: "#FF3CAC",
    note: "Cable pulley isolation day. Slow and controlled on every rep — squeeze at the top. Start cable at lowest setting and progress weekly.",
    exercises: [
      { id: "bike_warmup2",        name: "Stationary Bike Warm-up",              sets: 1, reps: "10 min",    startWeight: 0,  unit: "BW",  primary: false },
      { id: "cable_kickback",      name: "Cable Kickbacks (pulley)",              sets: 4, reps: "15–20 each",startWeight: 0,  unit: "BW",  primary: true  },
      { id: "cable_pull_through",  name: "Cable Pull-Throughs (pulley)",          sets: 3, reps: "15",         startWeight: 0,  unit: "BW",  primary: true  },
      { id: "hip_thrust_bench",    name: "Hip Thrusts (bench, BW first)",         sets: 4, reps: "12",         startWeight: 0,  unit: "BW",  primary: true  },
      { id: "curtsy_lunge",        name: "Curtsy Lunges (BW)",                    sets: 3, reps: "12 each",   startWeight: 0,  unit: "BW",  primary: false },
      { id: "glute_bridge",        name: "Glute Bridges (add 2.5lb plates when ready)", sets: 3, reps: "15",  startWeight: 0,  unit: "BW",  primary: false },
    ],
  },
  { day: 3, label: "Strength & Power",      location: "home", color: "#784CF4",
    note: "Landmine bar end only until comfortable. Step ups = step onto bench, hold cage for balance. Knee push-ups build pressing strength gradually.",
    exercises: [
      { id: "bike_warmup3",        name: "Stationary Bike Warm-up",              sets: 1, reps: "10 min",    startWeight: 0,  unit: "BW",  primary: false },
      { id: "landmine_squat",      name: "Landmine Squats",                      sets: 4, reps: "10–12",     startWeight: 0,  unit: "BW",  primary: true  },
      { id: "landmine_hip_thrust", name: "Landmine Hip Thrusts (floor)",         sets: 4, reps: "12",         startWeight: 0,  unit: "BW",  primary: true  },
      { id: "step_up",             name: "Step Ups (onto bench, hold cage)",      sets: 3, reps: "12 each",   startWeight: 0,  unit: "BW",  primary: false },
      { id: "walking_lunge",       name: "Walking Lunges (BW)",                  sets: 3, reps: "20 total",  startWeight: 0,  unit: "BW",  primary: false },
      { id: "knee_pushup",         name: "Knee Push-ups",                        sets: 3, reps: "10–12",     startWeight: 0,  unit: "BW",  primary: false },
    ],
  },
  { day: 4, label: "Active Recovery",       location: "home", color: "#00D4AA",
    note: "Low intensity. 60–70% heart rate. Drives fat loss and flushes soreness. Cable rows start with no attachment weight — just the cable stack.",
    exercises: [
      { id: "bike_active",         name: "Stationary Bike (steady state)",       sets: 1, reps: "25–30 min", startWeight: 0,  unit: "BW",  primary: false },
      { id: "cable_kickback2",     name: "Cable Kickbacks (light, pump focus)",  sets: 3, reps: "20 each",   startWeight: 0,  unit: "BW",  primary: true  },
      { id: "single_leg_rdl",      name: "Single Leg RDL (BW, balance focus)",   sets: 3, reps: "10 each",   startWeight: 0,  unit: "BW",  primary: false },
      { id: "glute_bridge_pulse",  name: "Glute Bridge Pulses (3s hold)",        sets: 3, reps: "25",         startWeight: 0,  unit: "BW",  primary: true  },
      { id: "cable_row",           name: "Cable Rows (pulley, light)",           sets: 3, reps: "15",         startWeight: 0,  unit: "BW",  primary: false },
    ],
  },
  { day: 5, label: "Full Glute + Compound", location: "home", color: "#FFD700",
    note: "Heaviest day — but still bodyweight first. Add 2.5lb plates to hip thrusts when BW feels easy. Work up to 10lb, 15lb, 25lb, 35lb over coming weeks. Barbell RDL and squat only when you feel ready.",
    exercises: [
      { id: "bike_warmup5",        name: "Stationary Bike Warm-up",              sets: 1, reps: "10 min",    startWeight: 0,  unit: "BW",  primary: false },
      { id: "hip_thrust_bar",      name: "Hip Thrusts (bench, add plates progressively)", sets: 4, reps: "8–10", startWeight: 0, unit: "BW", primary: true  },
      { id: "rdl_bar",             name: "Romanian Deadlifts (bar when ready)",   sets: 3, reps: "10–12",     startWeight: 0,  unit: "BW",  primary: true  },
      { id: "back_squat",          name: "Back Squats (bar when ready)",          sets: 3, reps: "8–10",      startWeight: 0,  unit: "BW",  primary: false },
      { id: "landmine_rdl2",       name: "Landmine RDLs (single leg)",           sets: 3, reps: "10 each",   startWeight: 0,  unit: "BW",  primary: true  },
      { id: "glute_bridge_heavy",  name: "Glute Bridges (add 2.5lb plates when ready)", sets: 3, reps: "12",  startWeight: 0,  unit: "BW",  primary: true  },
    ],
  },
];

// ─── PROGRAM BUILDER ────────────────────────────────────────────────────────
export function buildProgram(goal, trainingDays) {
  const days = parseInt(trainingDays) || 5;
  
  // Base exercises by goal
  const programs = {
    gluteBuilding: [
      { day: 1, label: "Glute Focus",          color: "#FF6B35", exercises: [
        { id: "bike_wu1",     name: "Stationary Bike Warm-up",       sets: 1, reps: "15 min",   startWeight: 0, unit: "BW", primary: false },
        { id: "lm_goblet",    name: "Landmine Goblet Squats",        sets: 3, reps: "12",        startWeight: 0, unit: "BW", primary: true  },
        { id: "lm_rdl",       name: "Landmine RDLs",                 sets: 3, reps: "12",        startWeight: 0, unit: "BW", primary: true  },
        { id: "split_squat",  name: "Bulgarian Split Squats (BW)",   sets: 3, reps: "8 each",    startWeight: 0, unit: "BW", primary: false },
        { id: "glute_bridge", name: "Glute Bridges Floor (2s hold)", sets: 3, reps: "20",        startWeight: 0, unit: "BW", primary: true  },
      ]},
      { day: 2, label: "Cable & Pump",          color: "#FF3CAC", exercises: [
        { id: "bike_wu2",     name: "Stationary Bike Warm-up",       sets: 1, reps: "10 min",   startWeight: 0, unit: "BW",  primary: false },
        { id: "cable_kick",   name: "Cable Kickbacks (pulley)",       sets: 4, reps: "15–20 each", startWeight: 0, unit: "BW", primary: true  },
        { id: "cable_pull",   name: "Cable Pull-Throughs",           sets: 3, reps: "15",        startWeight: 0, unit: "BW",  primary: true  },
        { id: "hip_thrust",   name: "Hip Thrusts (bench + plates)",  sets: 4, reps: "12",        startWeight: 0, unit: "BW",  primary: true  },
        { id: "curtsy",       name: "Curtsy Lunges (BW)",            sets: 3, reps: "12 each",   startWeight: 0, unit: "BW",  primary: false },
        { id: "glute_br2",    name: "Glute Bridges (plate loaded)",  sets: 3, reps: "15",        startWeight: 0, unit: "BW",  primary: false },
      ]},
      { day: 3, label: "Strength & Power",      color: "#784CF4", exercises: [
        { id: "bike_wu3",     name: "Stationary Bike Warm-up",       sets: 1, reps: "10 min",   startWeight: 0, unit: "BW", primary: false },
        { id: "lm_squat",     name: "Landmine Squats",               sets: 4, reps: "10–12",    startWeight: 0, unit: "BW", primary: true  },
        { id: "lm_hip",       name: "Landmine Hip Thrusts (floor)",  sets: 4, reps: "12",       startWeight: 0, unit: "BW", primary: true  },
        { id: "step_up",      name: "Step Ups (onto bench)",         sets: 3, reps: "12 each",  startWeight: 0, unit: "BW", primary: false },
        { id: "walk_lunge",   name: "Walking Lunges (BW)",           sets: 3, reps: "20 total", startWeight: 0, unit: "BW", primary: false },
        { id: "knee_pushup",  name: "Knee Push-ups",                 sets: 3, reps: "10–12",    startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 4, label: "Active Recovery",       color: "#00D4AA", exercises: [
        { id: "bike_active",  name: "Stationary Bike (steady state)", sets: 1, reps: "25–30 min", startWeight: 0, unit: "BW", primary: false },
        { id: "cable_kick2",  name: "Cable Kickbacks (light)",        sets: 3, reps: "20 each",   startWeight: 0, unit: "BW", primary: true  },
        { id: "sl_rdl",       name: "Single Leg RDL (BW)",            sets: 3, reps: "10 each",   startWeight: 0, unit: "BW", primary: false },
        { id: "glute_pulse",  name: "Glute Bridge Pulses (3s hold)",  sets: 3, reps: "25",        startWeight: 0, unit: "BW", primary: true  },
        { id: "cable_row",    name: "Cable Rows (light)",             sets: 3, reps: "15",        startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 5, label: "Full Glute + Compound", color: "#FFD700", exercises: [
        { id: "bike_wu5",     name: "Stationary Bike Warm-up",        sets: 1, reps: "10 min",   startWeight: 0, unit: "BW", primary: false },
        { id: "hip_bar",      name: "Hip Thrusts (bench, progressive)", sets: 4, reps: "8–10",   startWeight: 0, unit: "BW", primary: true  },
        { id: "rdl_bar",      name: "Romanian Deadlifts (bar when ready)", sets: 3, reps: "10–12", startWeight: 0, unit: "BW", primary: true },
        { id: "back_squat",   name: "Back Squats (bar when ready)",   sets: 3, reps: "8–10",     startWeight: 0, unit: "BW", primary: false },
        { id: "lm_rdl2",      name: "Landmine RDLs (single leg)",     sets: 3, reps: "10 each",  startWeight: 0, unit: "BW", primary: true  },
        { id: "glute_heavy",  name: "Glute Bridges (heavy, 2s hold)", sets: 3, reps: "12",       startWeight: 0, unit: "BW", primary: true  },
      ]},
    ],
    buildMuscle: [
      { day: 1, label: "Upper Push",    color: "#FF6B35", exercises: [
        { id: "bike_wu1",   name: "Stationary Bike Warm-up",      sets: 1, reps: "10 min",  startWeight: 0, unit: "BW", primary: false },
        { id: "lm_press",   name: "Landmine Press",               sets: 4, reps: "8–10",    startWeight: 0, unit: "BW", primary: true  },
        { id: "knee_pu",    name: "Knee Push-ups",                sets: 4, reps: "10–15",   startWeight: 0, unit: "BW", primary: true  },
        { id: "pike_pu",    name: "Pike Push-ups",                sets: 3, reps: "8–12",    startWeight: 0, unit: "BW", primary: true  },
        { id: "dip_h",      name: "Dip Handle Dips",              sets: 3, reps: "8–12",    startWeight: 0, unit: "BW", primary: false },
        { id: "cable_ext",  name: "Cable Tricep Extensions",      sets: 3, reps: "12–15",   startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 2, label: "Lower Pull",    color: "#FF3CAC", exercises: [
        { id: "bike_wu2",   name: "Stationary Bike Warm-up",      sets: 1, reps: "10 min",  startWeight: 0, unit: "BW", primary: false },
        { id: "rdl2",       name: "Romanian Deadlifts (BW→bar)",  sets: 4, reps: "8–10",    startWeight: 0, unit: "BW", primary: true  },
        { id: "lm_rdl",     name: "Landmine RDLs",                sets: 4, reps: "10",      startWeight: 0, unit: "BW", primary: true  },
        { id: "hip_thr",    name: "Hip Thrusts (BW→plates)",      sets: 4, reps: "10–12",   startWeight: 0, unit: "BW", primary: true  },
        { id: "leg_curl",   name: "Single Leg RDL",               sets: 3, reps: "10 each", startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 3, label: "Upper Pull",    color: "#784CF4", exercises: [
        { id: "bike_wu3",   name: "Stationary Bike Warm-up",      sets: 1, reps: "10 min",  startWeight: 0, unit: "BW", primary: false },
        { id: "cable_row2", name: "Cable Rows (heavy)",           sets: 4, reps: "8–10",    startWeight: 0, unit: "BW", primary: true  },
        { id: "cable_pull2","name": "Cable Pull-Throughs",        sets: 3, reps: "12",      startWeight: 0, unit: "BW", primary: true  },
        { id: "lm_row",     name: "Landmine Rows",                sets: 4, reps: "10 each", startWeight: 0, unit: "BW", primary: true  },
        { id: "cable_curl", name: "Cable Bicep Curls",            sets: 3, reps: "12–15",   startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 4, label: "Lower Push",    color: "#00D4AA", exercises: [
        { id: "bike_wu4",   name: "Stationary Bike Warm-up",      sets: 1, reps: "10 min",  startWeight: 0, unit: "BW", primary: false },
        { id: "lm_squat2",  name: "Landmine Squats",              sets: 4, reps: "8–10",    startWeight: 0, unit: "BW", primary: true  },
        { id: "back_sq2",   name: "Back Squats (BW→bar)",         sets: 4, reps: "8–10",    startWeight: 0, unit: "BW", primary: true  },
        { id: "lunge2",     name: "Walking Lunges",               sets: 3, reps: "20 total",startWeight: 0, unit: "BW", primary: false },
        { id: "step_up2",   name: "Step Ups",                     sets: 3, reps: "12 each", startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 5, label: "Full Body Power",color: "#FFD700", exercises: [
        { id: "bike_wu5b",  name: "Stationary Bike Warm-up",      sets: 1, reps: "10 min",  startWeight: 0, unit: "BW", primary: false },
        { id: "lm_clean",   name: "Landmine Squat to Press",      sets: 4, reps: "8",       startWeight: 0, unit: "BW", primary: true  },
        { id: "rdl_full",   name: "Romanian Deadlifts",           sets: 4, reps: "8",       startWeight: 0, unit: "BW", primary: true  },
        { id: "hip_full",   name: "Hip Thrusts (max load)",       sets: 4, reps: "6–8",     startWeight: 0, unit: "BW", primary: true  },
        { id: "push_full",  name: "Push-up Progression",         sets: 3, reps: "max",     startWeight: 0, unit: "BW", primary: false },
        { id: "cable_full", name: "Cable Rows (heavy)",           sets: 3, reps: "8",       startWeight: 0, unit: "BW", primary: false },
      ]},
    ],
    weightLoss: [
      { day: 1, label: "Cardio + Lower", color: "#FF6B35", exercises: [
        { id: "bike_hiit",  name: "Bike Intervals (30s on/30s off)", sets: 1, reps: "20 min", startWeight: 0, unit: "BW", primary: false },
        { id: "squat_wl",   name: "Bodyweight Squats",              sets: 3, reps: "20",      startWeight: 0, unit: "BW", primary: true  },
        { id: "lunge_wl",   name: "Walking Lunges",                 sets: 3, reps: "30 total",startWeight: 0, unit: "BW", primary: true  },
        { id: "hip_wl",     name: "Hip Thrusts (BW)",               sets: 3, reps: "20",      startWeight: 0, unit: "BW", primary: true  },
        { id: "step_wl",    name: "Step Ups",                       sets: 3, reps: "15 each", startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 2, label: "Cardio + Upper", color: "#FF3CAC", exercises: [
        { id: "bike_wl2",   name: "Stationary Bike (steady state)", sets: 1, reps: "25 min", startWeight: 0, unit: "BW", primary: false },
        { id: "push_wl",    name: "Knee Push-ups",                  sets: 3, reps: "15–20",  startWeight: 0, unit: "BW", primary: true  },
        { id: "row_wl",     name: "Cable Rows",                     sets: 3, reps: "15–20",  startWeight: 0, unit: "BW", primary: true  },
        { id: "pike_wl",    name: "Pike Push-ups",                  sets: 3, reps: "12",     startWeight: 0, unit: "BW", primary: false },
        { id: "kick_wl",    name: "Cable Kickbacks (light)",        sets: 3, reps: "20 each",startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 3, label: "Full Body Circuit", color: "#784CF4", exercises: [
        { id: "bike_wl3",   name: "Bike Warm-up",                   sets: 1, reps: "10 min", startWeight: 0, unit: "BW", primary: false },
        { id: "lm_wl",      name: "Landmine Squat",                 sets: 3, reps: "15",     startWeight: 0, unit: "BW", primary: true  },
        { id: "rdl_wl",     name: "Landmine RDL",                   sets: 3, reps: "15",     startWeight: 0, unit: "BW", primary: true  },
        { id: "push_wl2",   name: "Push-up Progression",            sets: 3, reps: "max",    startWeight: 0, unit: "BW", primary: false },
        { id: "cable_wl",   name: "Cable Kickbacks",                sets: 3, reps: "20 each",startWeight: 0, unit: "BW", primary: false },
        { id: "bike_fin",   name: "Bike Finisher",                  sets: 1, reps: "10 min", startWeight: 0, unit: "BW", primary: false },
      ]},
    ],
    maintenance: [
      { day: 1, label: "Full Body A", color: "#FF6B35", exercises: [
        { id: "bike_m1",    name: "Stationary Bike Warm-up",        sets: 1, reps: "15 min", startWeight: 0, unit: "BW", primary: false },
        { id: "squat_m",    name: "Landmine Squats",                sets: 3, reps: "10–12",  startWeight: 0, unit: "BW", primary: true  },
        { id: "push_m",     name: "Knee Push-ups",                  sets: 3, reps: "12–15",  startWeight: 0, unit: "BW", primary: true  },
        { id: "hip_m",      name: "Hip Thrusts",                    sets: 3, reps: "12",     startWeight: 0, unit: "BW", primary: true  },
        { id: "row_m",      name: "Cable Rows",                     sets: 3, reps: "12",     startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 2, label: "Cardio & Core",  color: "#FF3CAC", exercises: [
        { id: "bike_m2",    name: "Stationary Bike (steady state)", sets: 1, reps: "30 min", startWeight: 0, unit: "BW", primary: false },
        { id: "lunge_m",    name: "Walking Lunges",                 sets: 3, reps: "20",     startWeight: 0, unit: "BW", primary: false },
        { id: "bridge_m",   name: "Glute Bridge Pulses",            sets: 3, reps: "25",     startWeight: 0, unit: "BW", primary: false },
        { id: "sl_m",       name: "Single Leg RDL",                 sets: 3, reps: "10 each",startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 3, label: "Full Body B",    color: "#784CF4", exercises: [
        { id: "bike_m3",    name: "Stationary Bike Warm-up",        sets: 1, reps: "10 min", startWeight: 0, unit: "BW", primary: false },
        { id: "rdl_m",      name: "Landmine RDLs",                  sets: 3, reps: "12",     startWeight: 0, unit: "BW", primary: true  },
        { id: "cable_m",    name: "Cable Kickbacks",                sets: 3, reps: "15 each",startWeight: 0, unit: "BW", primary: true  },
        { id: "step_m",     name: "Step Ups",                       sets: 3, reps: "12 each",startWeight: 0, unit: "BW", primary: false },
        { id: "pike_m",     name: "Pike Push-ups",                  sets: 3, reps: "10",     startWeight: 0, unit: "BW", primary: false },
      ]},
    ],
    endurance: [
      { day: 1, label: "Bike Intervals",  color: "#00D4AA", exercises: [
        { id: "bike_e1",    name: "Bike Warm-up (easy)",            sets: 1, reps: "5 min",  startWeight: 0, unit: "BW", primary: false },
        { id: "hiit_e1",    name: "Bike HIIT (30s hard / 30s easy)", sets: 8, reps: "1 round", startWeight: 0, unit: "BW", primary: true },
        { id: "bike_cd",    name: "Bike Cool-down (easy)",          sets: 1, reps: "10 min", startWeight: 0, unit: "BW", primary: false },
        { id: "lunge_e",    name: "Walking Lunges (endurance)",     sets: 3, reps: "30 total",startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 2, label: "Strength + Cardio", color: "#FF6B35", exercises: [
        { id: "bike_e2",    name: "Stationary Bike Warm-up",        sets: 1, reps: "10 min", startWeight: 0, unit: "BW", primary: false },
        { id: "circuit_e",  name: "Squat → Lunge → Hip Thrust circuit", sets: 4, reps: "15 each", startWeight: 0, unit: "BW", primary: true },
        { id: "push_e",     name: "Push-up Progression",            sets: 3, reps: "max",    startWeight: 0, unit: "BW", primary: false },
        { id: "bike_e2b",   name: "Bike Finisher (steady)",         sets: 1, reps: "15 min", startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 3, label: "Long Ride",        color: "#784CF4", exercises: [
        { id: "bike_long",  name: "Stationary Bike (long steady state)", sets: 1, reps: "45–60 min", startWeight: 0, unit: "BW", primary: true },
        { id: "sl_e",       name: "Single Leg RDL (cool-down)",     sets: 2, reps: "10 each",startWeight: 0, unit: "BW", primary: false },
        { id: "bridge_e",   name: "Glute Bridge Pulses",            sets: 2, reps: "25",     startWeight: 0, unit: "BW", primary: false },
      ]},
      { day: 4, label: "Cross Training",   color: "#FF3CAC", exercises: [
        { id: "bike_e4",    name: "Stationary Bike Warm-up",        sets: 1, reps: "10 min", startWeight: 0, unit: "BW", primary: false },
        { id: "lm_e",       name: "Landmine Complex (squat+rdl)",   sets: 4, reps: "8 each", startWeight: 0, unit: "BW", primary: true  },
        { id: "cable_e",    name: "Cable Kickbacks",                sets: 3, reps: "20 each",startWeight: 0, unit: "BW", primary: false },
        { id: "bike_e4b",   name: "Bike Finisher (intervals)",      sets: 1, reps: "10 min", startWeight: 0, unit: "BW", primary: false },
      ]},
    ],
  };

  const base = programs[goal] || DEFAULT_PROGRAM;
  // Trim to requested days and ensure all required fields exist
  return base.slice(0, Math.min(days, base.length)).map((d, i) => ({
    day: i + 1,
    note: d.note || `${d.label} — ${days} day program. Start at bodyweight and progress when ready.`,
    location: d.location || "home",
    ...d,
  }));
}
