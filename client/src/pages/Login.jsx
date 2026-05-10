import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";
import api from "../api";

/* ── Floating decoration shapes ── */
function Deco({ style }) {
return <div style={{ position: "absolute", pointerEvents: "none", ...style }} />;
}

function Login() {
const navigate = useNavigate();
const { login } = useContext(AppContext);
const [formData, setFormData] = useState({ email: "", password: "" });
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
const { name, value } = e.target;
setFormData(p => ({ ...p, [name]: value }));
if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
};

const handleSubmit = async (e) => {
e.preventDefault();
const errs = {};
if (!formData.email) errs.email = "Email required";
else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email";
if (!formData.password) errs.password = "Password required";
if (Object.keys(errs).length) { setErrors(errs); return; }

setLoading(true);
try {
  const { data } = await api.post("/auth/login", {
    email: formData.email,
    password: formData.password
  });
  
  localStorage.setItem("user", JSON.stringify(data));
  localStorage.setItem("token", data.token);
  login(data);
  navigate("/dashboard");
} catch (err) {
  setErrors({ email: err.response?.data?.message || "Login failed" });
} finally {
  setLoading(false);
}
};

return (
<div style={styles.wrapper}>
{/* Polka-dot background */}
<div className="auth-bg" />

{/* Floating color blobs */}
<Deco style={{ width: 220, height: 220, borderRadius: "50%", background: "rgba(255,94,186,0.18)", top: "8%", left: "6%", filter: "blur(40px)" }} />
<Deco style={{ width: 180, height: 180, borderRadius: "50%", background: "rgba(56,207,255,0.2)", bottom: "10%", right: "8%", filter: "blur(36px)" }} />
<Deco style={{ width: 140, height: 140, borderRadius: "50%", background: "rgba(255,217,61,0.3)", top: "30%", right: "12%", filter: "blur(30px)" }} />

{/* Spinning star top-left */}
<div style={styles.starTL} className="wiggle">✦</div>
{/* Bouncing star bottom-right */}
<div style={styles.starBR} className="float">✶</div>

{/* Center card */}
<div style={styles.card}>
<div style={styles.logoRow}>
<span style={styles.logoEmoji} className="float">🎧</span>
<h1 style={styles.logoText}>
<span className="gradient-text">Pinterestify</span>
</h1>
</div>

<h2 style={styles.headline}>Welcome back!</h2>
<p style={styles.sub}>Your aesthetic space is waiting ✨</p>

<form onSubmit={handleSubmit} style={styles.form}>
<div style={styles.fieldWrap}>
<input
type="email"
name="email"
placeholder="your@email.com"
value={formData.email}
onChange={handleChange}
style={{ ...styles.input, ...(errors.email ? styles.inputErr : {}) }}
/>
{errors.email && <span style={styles.err}>{errors.email}</span>}
</div>
<div style={styles.fieldWrap}>
<input
type="password"
name="password"
placeholder="Password (min 6)"
value={formData.password}
onChange={handleChange}
style={{ ...styles.input, ...(errors.password ? styles.inputErr : {}) }}
/>
{errors.password && <span style={styles.err}>{errors.password}</span>}
</div>

<button type="submit" disabled={loading} style={styles.submitBtn}>
{loading ? "Signing in…" : "Sign in →"}
</button>
</form>

<div style={styles.divider}><span style={styles.dividerText}>or</span></div>

<p style={styles.switchText}>
New here?{" "}
<span onClick={() => navigate("/signup")} style={styles.switchLink}>
Create account
</span>
</p>
</div>
</div>
);
}

const styles = {
wrapper: {
minHeight: "100vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
position: "relative",
overflow: "hidden",
},
starTL: {
position: "fixed",
top: "56px", left: "32px",
fontSize: "56px",
color: "#FF5EBA",
zIndex: 5,
lineHeight: 1,
},
starBR: {
position: "fixed",
bottom: "56px", right: "32px",
fontSize: "48px",
color: "#38CFFF",
zIndex: 5,
lineHeight: 1,
},
card: {
position: "relative",
zIndex: 1,
background: "white",
borderRadius: "28px",
border: "2.5px solid #1A1A2E",
padding: "44px 40px 40px",
width: "100%",
maxWidth: "440px",
boxShadow: "8px 8px 0px #1A1A2E",
},
logoRow: {
display: "flex",
alignItems: "center",
gap: "10px",
marginBottom: "24px",
justifyContent: "center",
},
logoEmoji: {
fontSize: "32px",
lineHeight: 1,
},
logoText: {
fontFamily: "Fraunces, serif",
fontWeight: 700,
fontSize: "28px",
lineHeight: 1,
},
headline: {
fontFamily: "Fraunces, serif",
fontSize: "36px",
fontWeight: 700,
color: "#1A1A2E",
textAlign: "center",
marginBottom: "6px",
lineHeight: 1.2,
},
sub: {
textAlign: "center",
color: "#7A7080",
fontSize: "15px",
marginBottom: "32px",
},
form: {
display: "flex",
flexDirection: "column",
gap: "14px",
},
fieldWrap: {
display: "flex",
flexDirection: "column",
gap: "5px",
},
input: {
fontSize: "15px",
padding: "13px 16px",
borderRadius: "14px",
border: "2.5px solid #EAE0D5",
fontFamily: "Cabinet Grotesk, sans-serif",
outline: "none",
width: "100%",
background: "#FFFCF5",
transition: "border-color 0.2s, box-shadow 0.2s",
},
inputErr: {
borderColor: "#FF2D55",
},
err: {
fontSize: "12px",
color: "#FF2D55",
fontWeight: 700,
},
submitBtn: {
marginTop: "6px",
background: "#1A1A2E",
color: "#FFD93D",
border: "none",
borderRadius: "99px",
padding: "15px",
fontFamily: "Cabinet Grotesk, sans-serif",
fontWeight: 800,
fontSize: "16px",
cursor: "pointer",
width: "100%",
transition: "transform 0.15s, box-shadow 0.15s",
},
divider: {
display: "flex",
alignItems: "center",
gap: "12px",
margin: "20px 0 16px",
},
dividerText: {
color: "#7A7080",
fontSize: "13px",
fontWeight: 700,
flex: 1,
textAlign: "center",
},
switchText: {
textAlign: "center",
color: "#7A7080",
fontSize: "14px",
marginBottom: "0",
},
switchLink: {
color: "#9B5DE5",
fontWeight: 800,
cursor: "pointer",
textDecoration: "underline",
textDecorationColor: "rgba(155,93,229,0.4)",
},
};

export default Login;