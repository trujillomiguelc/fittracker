export const TOP_TABS = [
  { id: "today",     label: "Today",     icon: "sun"      },
  { id: "nutrition", label: "Nutrition", icon: "flame"    },
  { id: "workout",   label: "Workout",   icon: "dumbbell" },
  { id: "progress",  label: "Progress",  icon: "chart"    },
  { id: "history",   label: "History",   icon: "history"  },
];

export const GOALS = {
  gluteBuilding: { calMin: 1900, calMax: 2100, label: "Glute Building", color: "#FF3CAC" },
  weightLoss:    { calMin: 1700, calMax: 1800, label: "Weight Loss",    color: "#4ade80" },
};

export const PROTEIN_TARGET = { min: 140, max: 160 };
export const MEAL_SLOTS = ["Breakfast", "Lunch", "Dinner", "Snack"];

export const GOAL_OPTIONS = [
  { id: "gluteBuilding", emoji: "🍑", label: "Glute Building", desc: "Shape and grow your glutes while losing fat" },
  { id: "buildMuscle",   emoji: "💪", label: "Build Muscle",   desc: "Maximize muscle growth and strength" },
  { id: "weightLoss",    emoji: "🔥", label: "Weight Loss",    desc: "Burn fat while preserving muscle" },
  { id: "maintenance",   emoji: "⚖️", label: "Maintenance",    desc: "Stay fit and keep what you have" },
  { id: "endurance",     emoji: "🏃", label: "Endurance",      desc: "Build cardiovascular fitness and stamina" },
];

export const ACTIVITY_LEVELS = [
  { id: "sedentary",    label: "Sedentary",         desc: "Desk job, little movement",        multiplier: 1.2   },
  { id: "light",        label: "Lightly Active",    desc: "Walk sometimes, light exercise",   multiplier: 1.375 },
  { id: "moderate",     label: "Moderately Active", desc: "Exercise 3–4x per week",           multiplier: 1.55  },
  { id: "very",         label: "Very Active",       desc: "Intense training daily",           multiplier: 1.725 },
];

export const EX_INFO = {
  bike_warmup:         { muscles: "Full body warm-up",        equipment: "Stationary bike",             description: "Ride at a comfortable pace to raise heart rate and warm up hips and knees.",                        cues: ["Sit upright, slight forward lean", "Push through full pedal circle", "Aim for light sweat by minute 10"] },
  bike_warmup2:        { muscles: "Full body warm-up",        equipment: "Stationary bike",             description: "10 min warm-up before cable isolation work.",                                                       cues: ["Low resistance", "Smooth steady pace", "Focus on hip rotation"] },
  bike_warmup3:        { muscles: "Full body warm-up",        equipment: "Stationary bike",             description: "10 min warm-up before heavier landmine work.",                                                      cues: ["Moderate pace", "Full pedal stroke", "Light sweat before you start"] },
  bike_warmup5:        { muscles: "Full body warm-up",        equipment: "Stationary bike",             description: "10 min warm-up before your heaviest day.",                                                          cues: ["Moderate effort", "Focus on hip looseness", "Don't rush this"] },
  bike_active:         { muscles: "Cardio, fat burn",         equipment: "Stationary bike",             description: "Steady-state cardio at 60–70% max heart rate.",                                                     cues: ["Keep heart rate moderate", "25–30 minutes consistent pace", "Slight resistance"] },
  landmine_goblet:     { muscles: "Glutes, quads, core",      equipment: "Barbell + landmine",          description: "Hold the bar at chest height with both hands — like holding a goblet. Squat down keeping bar close to chest.", cues: ["Hold bar at chest, elbows pointing down", "Push knees out as you descend", "Drive through heels on the way up", "Squeeze glutes hard at the top"] },
  landmine_rdl:        { muscles: "Glutes, hamstrings",       equipment: "Barbell + landmine",          description: "Hold the bar with both hands, hinge at hips — push them back.",                                     cues: ["Soft bend in knees", "Push hips back", "Keep back flat", "Feel the stretch in hamstrings", "Squeeze glutes hard at the top"] },
  landmine_squat:      { muscles: "Glutes, quads, hamstrings",equipment: "Barbell + landmine",          description: "Hold bar at chest or shoulder height and squat.",                                                   cues: ["Chest up throughout", "Push knees out over toes", "Full depth", "Explode up through heels"] },
  landmine_hip_thrust: { muscles: "Glutes (primary)",         equipment: "Barbell + landmine",          description: "Sit on floor with upper back against bench, bar across hips, drive hips up.",                       cues: ["Upper back on bench edge", "Drive hips straight up", "Squeeze glutes at the top 1–2s", "Keep chin tucked"] },
  landmine_rdl2:       { muscles: "Glutes, hamstrings, balance",equipment: "Barbell + landmine",        description: "Single-leg RDL using landmine. Fixes left-right imbalances.",                                       cues: ["Stand on one leg, soft knee", "Hinge at hip", "Keep hips square", "Feel stretch in standing leg"] },
  split_squat:         { muscles: "Glutes, quads, balance",   equipment: "Power cage, bench",           description: "Bulgarian Split Squat — rear foot on bench, lower front knee toward floor.",                        cues: ["Front foot far enough forward", "Lower straight down", "Drive through front heel", "Use cage for balance"] },
  glute_bridge_floor:  { muscles: "Glutes, hamstrings, core", equipment: "Floor",                       description: "Lie on back, knees bent, drive hips up squeezing glutes. Hold 2s.",                                 cues: ["Feet flat, hip-width apart", "Drive hips up squeezing glutes", "Hold 2 seconds at top", "Lower slowly"] },
  glute_bridge:        { muscles: "Glutes, hamstrings",       equipment: "Weight plate",                description: "Glute bridge with weight plate on hips for resistance.",                                            cues: ["Place plate just below hip bones", "Same squeeze and pause cues", "Keep core braced"] },
  glute_bridge_pulse:  { muscles: "Glutes, hamstrings",       equipment: "Floor",                       description: "Stay near the top and do small pulses with a 3-second hold.",                                       cues: ["Stay near the top", "Tiny movements, big squeeze", "3-second hold at peak"] },
  hip_thrust_bench:    { muscles: "Glutes (primary), hamstrings", equipment: "Adjustable bench, plates", description: "Upper back rests on bench edge, plate on hips. Drive hips to ceiling.",                          cues: ["Upper back mid-scapula on bench", "Feet hip-width, toes slightly out", "Drive hips UP", "Squeeze at top"] },
  hip_thrust_bar:      { muscles: "Glutes (primary), core",   equipment: "Barbell, bench",              description: "Full barbell hip thrust — your heaviest glute exercise.",                                           cues: ["Roll bar carefully to hips", "Use folded towel for comfort", "Explosive drive up, controlled down", "Hold 1s at top"] },
  rdl_bar:             { muscles: "Glutes, hamstrings",       equipment: "Barbell",                     description: "Hold bar in front, push hips back as bar travels down thighs.",                                     cues: ["Bar stays close to legs", "Push hips back", "Soft knee bend, back flat", "Drive hips forward to stand"] },
  back_squat:          { muscles: "Quads, glutes, hamstrings", equipment: "Barbell, power cage",        description: "Classic back squat. Bar on upper back. Descend until thighs parallel or below.",                   cues: ["Bar on upper traps, not neck", "Chest up, brace core", "Push knees out", "Drive through mid-foot"] },
  cable_kickback:      { muscles: "Glutes (isolation)",       equipment: "Power cage cable pulley",     description: "Attach cable to ankle. Stand facing cage, kick leg straight back.",                                  cues: ["Keep torso still", "Squeeze glute hard at peak", "Slow on the way back", "Don't lean forward"] },
  cable_pull_through:  { muscles: "Glutes, hamstrings",       equipment: "Power cage cable pulley",     description: "Stand facing away, reach between legs and grab cable handle. Hinge forward then drive hips forward.", cues: ["Stand far enough for tension", "Push hips back on hinge", "Drive hips forward explosively", "Squeeze at top"] },
  cable_row:           { muscles: "Upper back, rear delts",   equipment: "Power cage cable pulley",     description: "Pull cable toward belly button keeping elbows close.",                                               cues: ["Sit tall", "Pull elbows back past torso", "Squeeze shoulder blades", "Control cable out"] },
  curtsy_lunge:        { muscles: "Glutes, outer glute, quads", equipment: "Bodyweight",                description: "Step one foot diagonally behind the other — like a curtsy.",                                        cues: ["Step back and across", "Keep front knee tracking over toes", "Torso upright", "Push through front heel"] },
  step_up:             { muscles: "Glutes, quads, balance",   equipment: "Elevated surface",            description: "Step up with one foot, drive through that heel to bring full body up.",                             cues: ["Place whole foot on surface", "Drive through heel", "Don't push off back foot", "Control the descent"] },
  walking_lunge:       { muscles: "Glutes, quads, hamstrings", equipment: "Bodyweight",                 description: "Step forward into lunge, lower back knee, then drive forward and continue walking.",                 cues: ["Long stride for more glute", "Back knee lightly touches floor", "Torso stays upright", "Arms swing naturally"] },
  single_leg_rdl:      { muscles: "Glutes, hamstrings, balance", equipment: "Bodyweight",               description: "Stand on one leg, hinge forward at hip, back leg rises as counterbalance.",                         cues: ["Stand tall before you start", "Hinge at hip", "Keep hips square", "Feel stretch in standing leg"] },
  knee_pushup:         { muscles: "Chest, shoulders, triceps", equipment: "Bodyweight",                 description: "Push-up with knees on floor. Reduces load to ~60% bodyweight.",                                    cues: ["Knees on floor, body straight", "Hands slightly wider than shoulder width", "Lower chest to floor", "Don't let hips sag"] },
  pike_pushup:         { muscles: "Shoulders, triceps",        equipment: "Bodyweight",                 description: "Start in downward dog — hips high. Lower top of head toward floor, push back up.",                  cues: ["Hips high throughout", "Lower crown of head toward floor", "Elbows track back slightly", "Full range of motion"] },
};
