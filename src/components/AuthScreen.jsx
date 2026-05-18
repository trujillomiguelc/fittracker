import { useState } from "react";
import { signIn, signUp, signInWithGoogle } from "../api/auth.js";

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit() {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    if (mode === "signup" && !name) { setError("Please enter your name"); return; }
    setLoading(true); setError("");
    try {
      const res = mode === "signup"
        ? await signUp(email, password, name)
        : await signIn(email, password);

      if (res.error || res.msg) {
        setError(res.error_description || res.msg || "Something went wrong");
      } else if (res.access_token) {
        saveSession({ access_token: res.access_token, user: res.user });
        onAuth({ access_token: res.access_token, user: res.user });
      } else if (mode === "signup" && res.id) {
        setMode("signin");
        setError("");
        setPassword("");
        setName("");
      }
    } catch { setError("Connection error — please try again"); }
    setLoading(false);
  }

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14, padding: "14px 18px",
    fontSize: 15, fontFamily: "inherit",
    color: "#F0EDE8", outline: "none",
    transition: "border-color .2s",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0C0C0F",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
    }}>
      {/* Background gradient orbs */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,76,244,0.1) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", left: "40%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22,
            background: "linear-gradient(135deg, #FF6B35, #FF3CAC)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", boxShadow: "0 20px 40px rgba(255,107,53,0.3)"
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#F0EDE8", letterSpacing: "-0.5px" }}>Body Recomp Hub</div>
          <div style={{ fontSize: 14, color: "#555", marginTop: 6 }}>
            {mode === "signin" ? "Welcome back — let's get to work" : "Start your transformation journey"}
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24, padding: 32,
          backdropFilter: "blur(20px)",
        }}>
          {/* Mode toggle */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {["signin", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                flex: 1, padding: "10px", borderRadius: 10, border: "none",
                background: mode === m ? "rgba(255,255,255,0.1)" : "transparent",
                color: mode === m ? "#F0EDE8" : "#555",
                fontWeight: mode === m ? 700 : 500,
                fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                transition: "all .2s",
              }}>
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 6, fontWeight: 600, letterSpacing: "0.3px" }}>YOUR NAME</label>
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Miguel"
                  style={inputStyle}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 6, fontWeight: 600, letterSpacing: "0.3px" }}>EMAIL</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                style={inputStyle}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 6, fontWeight: 600, letterSpacing: "0.3px" }}>PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  style={{ ...inputStyle, paddingRight: 50 }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
                <button onClick={() => setShowPass(s => !s)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPass
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 16, padding: "12px 16px", borderRadius: 12,
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
              color: "#f87171", fontSize: 13, lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading} style={{
            width: "100%", marginTop: 24, padding: "16px",
            background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #FF6B35, #FF3CAC)",
            border: "none", borderRadius: 14, color: loading ? "#555" : "#fff",
            fontWeight: 800, fontSize: 16, cursor: loading ? "default" : "pointer",
            fontFamily: "inherit", letterSpacing: "0.2px",
            boxShadow: loading ? "none" : "0 8px 24px rgba(255,107,53,0.3)",
            transition: "all .2s",
          }}>
            {loading ? "Please wait..." : mode === "signin" ? "Sign In →" : "Create Account →"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 12, color: "#444", fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Google Sign In */}
          <button onClick={signInWithGoogle} style={{
            width: "100%", marginTop: 12, padding: "14px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 14, color: "#F0EDE8",
            fontWeight: 600, fontSize: 15, cursor: "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 10, transition: "all .2s",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Footer note */}
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#444", lineHeight: 1.6 }}>
            {mode === "signin"
              ? <>Don't have an account? <span onClick={() => setMode("signup")} style={{ color: "#FF6B35", cursor: "pointer", fontWeight: 600 }}>Sign up free</span></>
              : <>Already have an account? <span onClick={() => setMode("signin")} style={{ color: "#FF6B35", cursor: "pointer", fontWeight: 600 }}>Sign in</span></>
            }
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#333" }}>
          Your data is private and encrypted · Powered by Supabase
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ONBOARDING FLOW — 4-Step Stacked Questionnaire
// ═══════════════════════════════════════════════════════════════

