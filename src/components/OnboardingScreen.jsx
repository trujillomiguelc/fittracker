import { useState } from "react";
import { calcTDEE } from "../utils/helpers.js";
import { saveProfile } from "../utils/storage.js";
import { ACTIVITY_LEVELS, GOAL_OPTIONS } from "../constants/index.js";

const STACK_LOGIC = {
  // Maps answer combinations to a custom plan
  generateStack(answers) {
    const { primaryDriver, aestheticFocus, performanceBenchmark, lifestyleSupport } = answers;

    // Metric Goal
    const metricGoals = {
      "Body Recomposition": "Lose 8–12 lbs while building lean muscle over 10–12 weeks",
      "Maximum Muscle (Bulking)": "Gain 5–8 lbs of lean mass over 12 weeks with progressive overload",
      "Glute Optimization": "Increase glute strength by 20% and reduce body fat 3–5% in 8 weeks",
      "Sleek Toning": "Reduce body fat 5–7% while maintaining lean muscle over 10 weeks",
      "Upper Body Mass": "Increase upper body pressing strength by 15% over 8 weeks",
      "Core Definition": "Reduce waist measurement 1–2 inches over 8 weeks",
    };

    // Nutrition strategy
    const nutritionStrategies = {
      "Aesthetic": { type: "Recomp", desc: "Moderate caloric deficit (200–300 cal below TDEE) with high protein (0.9–1g/lb) to preserve muscle while burning fat" },
      "Performance": { type: "Performance Fuel", desc: "Caloric maintenance to slight surplus. Carb-cycle around workouts. Protein at 0.8g/lb for recovery and adaptation" },
      "Longevity": { type: "Anti-Inflammatory", desc: "Caloric maintenance with emphasis on whole foods, adequate protein (0.7g/lb), and micronutrient density" },
      "Habit": { type: "Sustainable Baseline", desc: "Consistent protein target (0.75g/lb) with flexible calorie window. Focus on adherence over perfection" },
    };

    // Exercise strategy
    const exerciseStrategies = {
      "Post-Break Recovery": "Prioritize Landmine and Cable movements to rebuild neuromuscular patterns. Start at 60% perceived effort, increase load 5–10% weekly using muscle memory effect",
      "Posture Correction": "Emphasize Cable Rows, single-leg RDLs, and hip thrusts to activate posterior chain and counteract anterior dominance from sitting",
      "Injury Prevention": "Focus on hip hinge stability (RDLs, single-leg work), glute activation before heavy loading, and controlled eccentric movements",
      "The Streak": "3–4 day rotating split with built-in active recovery. Track streak in the Week tab — hitting all days unlocks next week's progressive overload targets",
      "The Firsts": "Progressive push-up pyramid (knee → incline → full), cable-assisted pull pattern work, and weekly max-rep tracking to measure progress toward milestones",
      "Strength Benchmarks": "Linear periodization on Landmine Squats and Hip Thrusts. Log every session in the Log tab to track 1RM progression over 8 weeks",
      "Athletic Milestones": "Bike interval training (30s max effort / 30s recovery) 3x per week, progressing interval duration weekly toward your cardio target",
    };

    const metric = metricGoals[aestheticFocus] || "Build a strong, consistent fitness foundation over the next 8–12 weeks";
    const nutrition = nutritionStrategies[primaryDriver] || nutritionStrategies["Aesthetic"];
    const exercise = exerciseStrategies[lifestyleSupport] || exerciseStrategies["Post-Break Recovery"];

    // Map to goal ID for program selection
    const goalMap = {
      "Body Recomposition": "weightLoss",
      "Maximum Muscle (Bulking)": "buildMuscle",
      "Glute Optimization": "gluteBuilding",
      "Sleek Toning": "weightLoss",
      "Upper Body Mass": "buildMuscle",
      "Core Definition": "weightLoss",
    };

    return { metric, nutrition, exercise, goalId: goalMap[aestheticFocus] || "gluteBuilding" };
  }
};

const QUESTIONS = [
  {
    step: 1,
    tag: "THE WHY",
    header: "What is the main focus of your fitness journey right now?",
    subtitle: "This helps the app weight the algorithm.",
    key: "primaryDriver",
    options: [
      { value: "Aesthetic",    icon: "✦", label: "Transforming how my body looks",       sub: "Aesthetic" },
      { value: "Performance",  icon: "⚡", label: "Improving what my body can do",         sub: "Performance" },
      { value: "Longevity",    icon: "♾", label: "Feeling better and moving without pain", sub: "Longevity" },
      { value: "Habit",        icon: "🎯", label: "Just building a consistent routine",    sub: "Habit" },
    ],
  },
  {
    step: 2,
    tag: "THE LOOK",
    header: "If you could wave a magic wand over your physique, what would you prioritize?",
    subtitle: null,
    key: "aestheticFocus",
    options: [
      { value: "Body Recomposition",      icon: "⚖️", label: "Body Recomposition",      sub: "Build muscle while losing fat — the lean gains approach" },
      { value: "Maximum Muscle (Bulking)",icon: "💪", label: "Maximum Muscle",           sub: "Overall size, mass, and strength with caloric surplus" },
      { value: "Upper Body Mass",         icon: "🔺", label: "Upper Body Mass",          sub: "Broader chest, back, and shoulders — the V-taper look" },
      { value: "Glute Optimization",      icon: "🍑", label: "Glute Optimization",       sub: "Specific focus on posterior chain size and definition" },
      { value: "Sleek Toning",            icon: "✨", label: "Sleek Toning",             sub: "Light upper body definition without excessive bulk" },
      { value: "Core Definition",         icon: "◎", label: "Core Definition",           sub: "Abdominal visibility and midsection tightening" },
    ],
  },
  {
    step: 3,
    tag: "THE DO",
    header: "What physical milestone excites you the most?",
    subtitle: null,
    key: "performanceBenchmark",
    options: [
      { value: "The Firsts",           icon: "🏁", label: "The Firsts",              sub: "First unassisted pull-up or 20 on-toes push-ups" },
      { value: "Strength Benchmarks",  icon: "📈", label: "Strength Benchmarks",     sub: "Increase 1-rep max by 10% or squat your bodyweight" },
      { value: "Athletic Milestones",  icon: "🏃", label: "Athletic Milestones",     sub: "Sub-30 min 5K or timed high-intensity circuits" },
    ],
  },
  {
    step: 4,
    tag: "THE LIFE",
    header: "What does your current lifestyle need the most support with?",
    subtitle: null,
    key: "lifestyleSupport",
    options: [
      { value: "Post-Break Recovery", icon: "🔄", label: "Post-Break Recovery",    sub: "Rebuild conditioning after a long hiatus using muscle memory" },
      { value: "Posture Correction",  icon: "🧍", label: "Posture Correction",     sub: "Strengthen back and rear shoulders to fix desk slouch" },
      { value: "Injury Prevention",   icon: "🛡", label: "Injury Prevention",      sub: "Stabilize hips, knees, and lower back proactively" },
      { value: "The Streak",          icon: "🔥", label: "The Streak",             sub: "Simply work out 3–4 times per week consistently" },
    ],
  },
];

function OnboardingScreen({ onComplete, existingProfile }) {
  const [step, setStep] = useState(0); // 0=stats, 1-4=questions, 5=reveal
  const [direction, setDirection] = useState(1); // 1=forward, -1=backward
  const [animating, setAnimating] = useState(false);

  const [stats, setStats] = useState({
    name: existingProfile?.name || "",
    age: existingProfile?.age || "",
    sex: existingProfile?.sex || "female",
    weight: existingProfile?.weight || "",
    heightFt: existingProfile?.heightFt || "5",
    heightIn: existingProfile?.heightIn || "9",
    activityLevel: existingProfile?.activityLevel || "moderate",
    trainingDays: existingProfile?.trainingDays || "5",
  });

  const [answers, setAnswers] = useState({
    primaryDriver: existingProfile?.primaryDriver || null,
    aestheticFocus: existingProfile?.aestheticFocus || null,
    performanceBenchmark: existingProfile?.performanceBenchmark || null,
    lifestyleSupport: existingProfile?.lifestyleSupport || null,
  });

  const [selected, setSelected] = useState(null); // current step selection
  const [stack, setStack] = useState(null);

  function navigate(nextStep, dir) {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setSelected(answers[QUESTIONS[nextStep - 1]?.key] || null);
      setAnimating(false);
    }, 250);
  }

  function selectOption(val) {
    setSelected(val);
    const q = QUESTIONS[step - 1];
    if (q) {
      const newAnswers = { ...answers, [q.key]: val };
      setAnswers(newAnswers);
      // Auto-advance after short delay
      setTimeout(() => {
        if (step < 4) {
          navigate(step + 1, 1);
        } else {
          // Generate stack and go to reveal
          const generatedStack = STACK_LOGIC.generateStack(newAnswers);
          setStack(generatedStack);
          const targets = calcTDEE({ ...stats, goal: generatedStack.goalId });
          setAnimating(true);
          setTimeout(() => { setStep(5); setAnimating(false); }, 250);
        }
      }, 300);
    }
  }

  function finish() {
    const s = STACK_LOGIC.generateStack(answers);
    const targets = calcTDEE({ ...stats, goal: s.goalId });
    const profile = {
      ...stats, ...answers, ...targets,
      goal: s.goalId,
      completedOnboarding: true,
      startWeight: stats.weight,
      currentWeight: stats.weight,
      startDate: new Date().toISOString().split("T")[0],
      stack: s,
    };
    saveProfile(profile);
    onComplete(profile);
  }

  const inputStyle = { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "13px 16px", fontSize: 15, fontFamily: "inherit", color: "#F0EDE8", outline: "none", colorScheme: "dark" };
  const labelStyle = { fontSize: 11, color: "#666", display: "block", marginBottom: 6, fontWeight: 700, letterSpacing: "0.5px" };

  const totalSteps = 5; // stats + 4 questions
  const progress = step === 5 ? 100 : Math.round((step / totalSteps) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0D", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", overflow: "hidden" }}>
      
      {/* Ambient background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,76,244,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,170,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>

        {/* Progress */}
        {step > 0 && step < 5 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              {step > 0 && step <= 4 && (
                <span style={{ fontSize: 11, color: "#FF6B35", fontWeight: 800, letterSpacing: "1px" }}>
                  STEP {step} OF 4 — {QUESTIONS[step-1]?.tag}
                </span>
              )}
              <span style={{ fontSize: 11, color: "#333", marginLeft: "auto" }}>{progress}%</span>
            </div>
            <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
              <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #FF6B35, #FF3CAC)", width: `${progress}%`, transition: "width .4s cubic-bezier(0.4,0,0.2,1)" }} />
            </div>
          </div>
        )}

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 28, padding: "28px 24px",
          backdropFilter: "blur(20px)",
          opacity: animating ? 0 : 1,
          transform: animating ? `translateX(${direction * 40}px)` : "translateX(0)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}>

          {/* STEP 0 — Stats */}
          {step === 0 && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 800, letterSpacing: "1px", marginBottom: 8 }}>BEFORE WE BEGIN</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#F0EDE8", lineHeight: 1.2, marginBottom: 6 }}>Tell us about yourself</div>
                <div style={{ fontSize: 14, color: "#555" }}>So we can build your personalized plan</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div><label style={labelStyle}>NAME</label>
                    <input value={stats.name} onChange={e => setStats(s => ({...s, name: e.target.value}))} placeholder="Miguel" style={inputStyle} /></div>
                  <div><label style={labelStyle}>AGE</label>
                    <input type="number" value={stats.age} onChange={e => setStats(s => ({...s, age: e.target.value}))} placeholder="28" style={inputStyle} /></div>
                </div>
                <div><label style={labelStyle}>BIOLOGICAL SEX</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {["female","male"].map(s => (
                      <button key={s} onClick={() => setStats(p => ({...p, sex: s}))} style={{ padding: "11px", borderRadius: 12, border: `1px solid ${stats.sex===s ? "#FF3CAC" : "rgba(255,255,255,0.08)"}`, background: stats.sex===s ? "rgba(255,60,172,0.12)" : "transparent", color: stats.sex===s ? "#FF3CAC" : "#555", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>{s}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <div style={{ gridColumn: "span 1" }}><label style={labelStyle}>WEIGHT (lbs)</label>
                    <input type="number" value={stats.weight} onChange={e => setStats(s => ({...s, weight: e.target.value}))} placeholder="158" style={inputStyle} /></div>
                  <div><label style={labelStyle}>HEIGHT FT</label>
                    <input type="number" value={stats.heightFt} onChange={e => setStats(s => ({...s, heightFt: e.target.value}))} placeholder="5" style={inputStyle} /></div>
                  <div><label style={labelStyle}>IN</label>
                    <input type="number" value={stats.heightIn} onChange={e => setStats(s => ({...s, heightIn: e.target.value}))} placeholder="9" style={inputStyle} /></div>
                </div>
                <div><label style={labelStyle}>ACTIVITY LEVEL</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {ACTIVITY_LEVELS.map(a => (
                      <button key={a.id} onClick={() => setStats(s => ({...s, activityLevel: a.id}))} style={{ padding: "10px 12px", borderRadius: 12, border: `1px solid ${stats.activityLevel===a.id ? "#00D4AA" : "rgba(255,255,255,0.08)"}`, background: stats.activityLevel===a.id ? "rgba(0,212,170,0.1)" : "transparent", color: stats.activityLevel===a.id ? "#00D4AA" : "#555", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                        <div style={{ fontWeight: 700 }}>{a.label}</div>
                        <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>{a.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div><label style={labelStyle}>TRAINING DAYS PER WEEK</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[3,4,5,6].map(d => (
                      <button key={d} onClick={() => setStats(s => ({...s, trainingDays: String(d)}))} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: `1px solid ${stats.trainingDays===String(d) ? "#784CF4" : "rgba(255,255,255,0.08)"}`, background: stats.trainingDays===String(d) ? "rgba(120,76,244,0.15)" : "transparent", color: stats.trainingDays===String(d) ? "#784CF4" : "#555", fontWeight: 800, fontSize: 18, cursor: "pointer", fontFamily: "inherit" }}>{d}</button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => navigate(1, 1)} disabled={!stats.name || !stats.weight} style={{ width: "100%", marginTop: 24, padding: "16px", background: !stats.name || !stats.weight ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #FF6B35, #FF3CAC)", border: "none", borderRadius: 14, color: !stats.name || !stats.weight ? "#333" : "#fff", fontWeight: 800, fontSize: 16, cursor: !stats.name || !stats.weight ? "default" : "pointer", fontFamily: "inherit", letterSpacing: "0.3px", boxShadow: !stats.name || !stats.weight ? "none" : "0 8px 24px rgba(255,107,53,0.25)", transition: "all .2s" }}>
                Continue →
              </button>
            </div>
          )}

          {/* STEPS 1–4 — Questions */}
          {step >= 1 && step <= 4 && (() => {
            const q = QUESTIONS[step - 1];
            return (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 800, letterSpacing: "1px", marginBottom: 8 }}>{q.tag}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#F0EDE8", lineHeight: 1.3, marginBottom: q.subtitle ? 8 : 0 }}>{q.header}</div>
                  {q.subtitle && <div style={{ fontSize: 13, color: "#444" }}>{q.subtitle}</div>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.options.map(opt => {
                    const isSelected = selected === opt.value || answers[q.key] === opt.value;
                    return (
                      <button key={opt.value} onClick={() => selectOption(opt.value)} style={{
                        padding: "14px 16px", borderRadius: 16,
                        border: `1px solid ${isSelected ? "#FF6B35" : "rgba(255,255,255,0.07)"}`,
                        background: isSelected ? "rgba(255,107,53,0.1)" : "rgba(255,255,255,0.02)",
                        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                        display: "flex", alignItems: "center", gap: 14,
                        transform: isSelected ? "scale(1.01)" : "scale(1)",
                        transition: "all .15s ease",
                        boxShadow: isSelected ? "0 4px 20px rgba(255,107,53,0.15)" : "none",
                      }}>
                        <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{opt.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? "#FF6B35" : "#F0EDE8", marginBottom: 2 }}>{opt.label}</div>
                          <div style={{ fontSize: 12, color: "#444", lineHeight: 1.4 }}>{opt.sub}</div>
                        </div>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${isSelected ? "#FF6B35" : "rgba(255,255,255,0.1)"}`, background: isSelected ? "#FF6B35" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
                          {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {step > 1 && (
                  <button onClick={() => navigate(step - 1, -1)} style={{ marginTop: 16, background: "none", border: "none", color: "#444", fontSize: 13, cursor: "pointer", fontFamily: "inherit", padding: "8px 0" }}>
                    ← Back
                  </button>
                )}
              </div>
            );
          })()}

          {/* STEP 5 — The Reveal */}
          {step === 5 && stack && (() => {
            const targets = calcTDEE({ ...stats, goal: stack.goalId });
            return (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, color: "#00D4AA", fontWeight: 800, letterSpacing: "1px", marginBottom: 8 }}>YOUR CUSTOM STACK</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#F0EDE8", lineHeight: 1.2, marginBottom: 6 }}>
                    {stats.name ? `${stats.name.split(" ")[0]}'s Plan` : "Your Plan"} ✦
                  </div>
                  <div style={{ fontSize: 14, color: "#555" }}>Built from your answers — unique to you</div>
                </div>

                {/* Answer pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  {[answers.primaryDriver, answers.aestheticFocus, answers.performanceBenchmark, answers.lifestyleSupport].filter(Boolean).map((a, i) => (
                    <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, background: "rgba(255,255,255,0.06)", color: "#888", border: "1px solid rgba(255,255,255,0.08)" }}>{a}</span>
                  ))}
                </div>

                {/* Stack Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  {/* Card 1 — Metric Goal */}
                  <div style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 18, padding: "18px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,107,53,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎯</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#FF6B35", letterSpacing: "0.8px" }}>METRIC GOAL</div>
                    </div>
                    <div style={{ fontSize: 14, color: "#F0EDE8", lineHeight: 1.5, fontWeight: 500 }}>{stack.metric}</div>
                  </div>

                  {/* Card 2 — Nutrition */}
                  <div style={{ background: "rgba(120,76,244,0.08)", border: "1px solid rgba(120,76,244,0.2)", borderRadius: 18, padding: "18px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(120,76,244,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🥗</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#784CF4", letterSpacing: "0.8px" }}>NUTRITIONAL TARGET — {stack.nutrition.type}</div>
                    </div>
                    <div style={{ fontSize: 14, color: "#F0EDE8", lineHeight: 1.5, fontWeight: 500, marginBottom: 10 }}>{stack.nutrition.desc}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ flex: 1, background: "rgba(120,76,244,0.12)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#784CF4" }}>{targets.calMin}–{targets.calMax}</div>
                        <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>cal/day</div>
                      </div>
                      <div style={{ flex: 1, background: "rgba(120,76,244,0.12)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#784CF4" }}>{targets.proteinMin}–{targets.proteinMax}g</div>
                        <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>protein/day</div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 — Exercise Strategy */}
                  <div style={{ background: "rgba(0,212,170,0.06)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: 18, padding: "18px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,212,170,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#00D4AA", letterSpacing: "0.8px" }}>EXERCISE STRATEGY</div>
                    </div>
                    <div style={{ fontSize: 14, color: "#F0EDE8", lineHeight: 1.5, fontWeight: 500 }}>{stack.exercise}</div>
                  </div>
                </div>

                <button onClick={finish} style={{ width: "100%", padding: "17px", background: "linear-gradient(135deg, #FF6B35, #FF3CAC)", border: "none", borderRadius: 16, color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.3px", boxShadow: "0 12px 32px rgba(255,107,53,0.3)" }}>
                  Start My Journey 🚀
                </button>

                <button onClick={() => { setStep(0); setSelected(null); }} style={{ width: "100%", marginTop: 10, padding: "12px", background: "none", border: "none", color: "#444", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  ← Start over
                </button>
              </div>
            );
          })()}

        </div>

        {/* Footer */}
        {step === 0 && (
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#2a2a2a" }}>
            Your data is private and never shared
          </div>
        )}
      </div>
    </div>
  );
}
