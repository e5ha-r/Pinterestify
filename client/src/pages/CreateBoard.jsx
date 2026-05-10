import { useState, useContext } from "react";
import { AppContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { showToast } from "../utils/toast";

const COVER_COLORS = [
  { label: "Berry",    bg: "#FF5EBA", text: "white" },
  { label: "Tangerine",bg: "#FF7A2F", text: "white" },
  { label: "Lemon",   bg: "#FFD93D", text: "#1A1A2E" },
  { label: "Mint",    bg: "#00E8A2", text: "#1A1A2E" },
  { label: "Sky",     bg: "#38CFFF", text: "#1A1A2E" },
  { label: "Grape",   bg: "#9B5DE5", text: "white" },
];

function CreateBoard() {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [accent, setAccent] = useState(COVER_COLORS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { createBoard } = useContext(AppContext);
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!name.trim()) { showToast("Give your board a name!", "error"); return; }
    createBoard(name.trim(), isPublic);
    showToast("Board created!");
    navigate("/dashboard");
  };

  return (
    <div>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={styles.page}>
        {/* Preview pane */}
        <div style={{ ...styles.preview, background: accent.bg }}>
          <div style={styles.previewInner}>
            <p style={{ ...styles.previewLabel, color: accent.text }}>Board Preview</p>
            <h2 style={{ ...styles.previewName, color: accent.text }}>
              {name || "My New Board"}
            </h2>
            <span style={{ ...styles.previewBadge, color: accent.text, border: `2px solid ${accent.text}` }}>
              {isPublic ? "Public" : "Private"}
            </span>
          </div>
          {/* Decorative dots */}
          <div style={{ ...styles.previewDot, top: "12%", right: "15%", background: accent.text, opacity: 0.2 }} />
          <div style={{ ...styles.previewDot, bottom: "18%", left: "12%", width: 60, height: 60, background: accent.text, opacity: 0.15 }} />
        </div>

        {/* Form pane */}
        <div style={styles.formPane}>
          <h1 style={styles.headline}>New Board</h1>
          <p style={styles.sub}>Give your inspiration a home</p>

          <div style={styles.field}>
            <label style={styles.label}>Board Name</label>
            <input
              type="text"
              placeholder="e.g. Dark Academia, Golden Hour…"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleCreate(); }}
              style={styles.input}
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Accent Color</label>
            <div style={styles.colorPicker}>
              {COVER_COLORS.map(c => (
                <button
                  key={c.label}
                  onClick={() => setAccent(c)}
                  title={c.label}
                  style={{
                    ...styles.colorSwatch,
                    background: c.bg,
                    outline: accent.label === c.label ? `3px solid #1A1A2E` : "none",
                    outlineOffset: "3px",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Visibility</label>
            <div style={styles.toggleWrap}>
              {[true, false].map(val => (
                <button
                  key={String(val)}
                  onClick={() => setIsPublic(val)}
                  style={{
                    ...styles.toggleBtn,
                    background: isPublic === val ? "#1A1A2E" : "#FFF8EE",
                    color: isPublic === val ? "#FFD93D" : "#7A7080",
                    border: isPublic === val ? "2px solid #1A1A2E" : "2px solid #EAE0D5",
                  }}
                >
                  {val ? "Public" : "Private"}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleCreate} style={styles.createBtn}>
            Create Board →
          </button>
          <button onClick={() => navigate("/dashboard")} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    minHeight: "calc(100vh - 64px)",
  },
  preview: {
    position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
    transition: "background 0.3s ease",
  },
  previewInner: {
    textAlign: "center", padding: "40px", position: "relative", zIndex: 1,
  },
  previewLabel: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "11px",
    letterSpacing: "0.12em", textTransform: "uppercase",
    opacity: 0.7, marginBottom: "16px",
  },
  previewName: {
    fontFamily: "Fraunces, serif",
    fontSize: "48px", fontWeight: 700, lineHeight: 1.1,
    marginBottom: "20px",
    wordBreak: "break-word",
  },
  previewBadge: {
    display: "inline-block",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "12px",
    letterSpacing: "0.08em",
    padding: "5px 16px", borderRadius: "99px",
  },
  previewDot: {
    position: "absolute",
    width: 80, height: 80,
    borderRadius: "50%",
  },
  formPane: {
    background: "#FFFCF5",
    display: "flex", flexDirection: "column", justifyContent: "center",
    padding: "60px 56px",
    gap: "0",
  },
  headline: {
    fontFamily: "Fraunces, serif",
    fontSize: "44px", fontWeight: 700, color: "#1A1A2E",
    marginBottom: "8px",
  },
  sub: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    color: "#7A7080", fontSize: "16px", marginBottom: "36px",
  },
  field: { marginBottom: "24px" },
  label: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "12px",
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: "#1A1A2E", display: "block", marginBottom: "8px",
  },
  input: {
    fontSize: "16px", padding: "14px 18px",
    borderRadius: "14px", border: "2.5px solid #EAE0D5",
    fontFamily: "Cabinet Grotesk, sans-serif",
    outline: "none", width: "100%",
    background: "white",
  },
  colorPicker: {
    display: "flex", gap: "10px",
  },
  colorSwatch: {
    width: "36px", height: "36px", borderRadius: "50%",
    border: "2px solid transparent",
    cursor: "pointer", transition: "transform 0.15s",
    flexShrink: 0,
  },
  toggleWrap: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px",
  },
  toggleBtn: {
    padding: "12px", borderRadius: "12px",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "14px",
    cursor: "pointer", transition: "all 0.2s",
  },
  createBtn: {
    width: "100%", padding: "15px",
    background: "#FF5EBA", color: "white",
    border: "2.5px solid #1A1A2E",
    borderRadius: "99px",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "16px",
    cursor: "pointer",
    boxShadow: "4px 4px 0 #1A1A2E",
    marginTop: "8px",
    transition: "transform 0.15s",
  },
  cancelBtn: {
    marginTop: "14px",
    background: "none", border: "none",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "14px", color: "#7A7080",
    cursor: "pointer", textAlign: "center",
    width: "100%",
  },
};

export default CreateBoard;