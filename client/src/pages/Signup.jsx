import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        // Client-side validation
        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required."); return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters."); return;
        }

        setLoading(true);
        try {
            const res = await api.post("/auth/signup", { username, email, password });
            if (res.status === 201) {
                setSuccess(true);
                setTimeout(() => navigate("/"), 2000);
            }
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Signup failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div className="auth-bg" />
            <div style={styles.starTL} className="wiggle">✦</div>
            <div style={styles.starBR} className="float">✶</div>

            <div style={styles.card}>
                <div style={styles.logoRow}>
                    <span style={styles.logoEmoji} className="float">📌</span>
                    <h1 style={styles.logoText}><span className="gradient-text">Pinterestify</span></h1>
                </div>

                <h2 style={styles.headline}>Join the vibe</h2>
                <p style={styles.sub}>Create your aesthetic space ✨</p>

                {success ? (
                    <div style={styles.successBox}>
                        <span style={{ fontSize: 32 }}>🎉</span>
                        <p style={styles.successText}>Account created! Redirecting to login…</p>
                    </div>
                ) : (
                    <form onSubmit={handleSignup} style={styles.form}>
                        {error && <div style={styles.errorBox}>{error}</div>}

                        <div style={styles.fieldWrap}>
                            <label style={styles.label}>Username</label>
                            <input
                                type="text"
                                placeholder="e.g. aestethic_girl"
                                style={styles.input}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>
                        <div style={styles.fieldWrap}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                style={styles.input}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                        <div style={styles.fieldWrap}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                placeholder="At least 6 characters"
                                style={styles.input}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>

                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? "Creating account…" : "Create account →"}
                        </button>
                    </form>
                )}

                <p style={styles.switchText}>
                    Already have an account?{" "}
                    <Link to="/" style={styles.switchLink}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    wrapper: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" },
    starTL: { position:"fixed", top:56, left:32, fontSize:56, color:"#FF5EBA", zIndex:5, lineHeight:1 },
    starBR: { position:"fixed", bottom:56, right:32, fontSize:48, color:"#38CFFF", zIndex:5, lineHeight:1 },
    card: { position:"relative", zIndex:1, background:"white", borderRadius:28, border:"2.5px solid #1A1A2E", padding:"44px 40px 40px", width:"100%", maxWidth:440, boxShadow:"8px 8px 0 #1A1A2E" },
    logoRow: { display:"flex", alignItems:"center", gap:10, marginBottom:24, justifyContent:"center" },
    logoEmoji: { fontSize:32, lineHeight:1 },
    logoText: { fontFamily:"Fraunces,serif", fontWeight:700, fontSize:28, lineHeight:1 },
    headline: { fontFamily:"Fraunces,serif", fontSize:36, fontWeight:700, color:"#1A1A2E", textAlign:"center", marginBottom:6, lineHeight:1.2 },
    sub: { textAlign:"center", color:"#7A7080", fontSize:15, marginBottom:28 },
    form: { display:"flex", flexDirection:"column", gap:14 },
    fieldWrap: { display:"flex", flexDirection:"column", gap:5 },
    label: { fontFamily:"Cabinet Grotesk,sans-serif", fontWeight:800, fontSize:12, letterSpacing:"0.05em", textTransform:"uppercase", color:"#1A1A2E" },
    input: { fontSize:15, padding:"13px 16px", borderRadius:14, border:"2.5px solid #EAE0D5", fontFamily:"Cabinet Grotesk,sans-serif", outline:"none", width:"100%", background:"#FFFCF5" },
    submitBtn: { marginTop:6, background:"#1A1A2E", color:"#FFD93D", border:"none", borderRadius:99, padding:15, fontFamily:"Cabinet Grotesk,sans-serif", fontWeight:800, fontSize:16, cursor:"pointer", width:"100%" },
    errorBox: { background:"#FFF0F3", border:"2px solid #FF2D55", borderRadius:12, padding:"12px 16px", fontFamily:"Cabinet Grotesk,sans-serif", fontSize:14, color:"#FF2D55", fontWeight:700 },
    successBox: { textAlign:"center", padding:"24px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:12 },
    successText: { fontFamily:"Cabinet Grotesk,sans-serif", fontWeight:700, fontSize:16, color:"#1A1A2E" },
    switchText: { textAlign:"center", color:"#7A7080", fontSize:14, marginTop:20 },
    switchLink: { color:"#9B5DE5", fontWeight:800, textDecoration:"none" },
};

export default Signup;
