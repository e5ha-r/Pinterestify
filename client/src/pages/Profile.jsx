import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../context/context";
import { showToast } from "../utils/toast";

// Better avatars using DiceBear Notionists style (colorful illustrated characters)
const AVATAR_SEEDS = [
  "Luna","Zara","Kai","Mochi","Nova","Pixel","Sage","Echo",
  "Cleo","Dusk","Fern","Glow","Haze","Iris","Jade","Kira"
];
const AVATAR_BG = "b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,d1f4d5,fce4d4,e8d5f4";

const AVATARS = AVATAR_SEEDS.map(s =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${s}&backgroundColor=${AVATAR_BG}`
);

const ACCENT_COLORS = ["#FF5EBA","#FF7A2F","#FFD93D","#00E8A2","#38CFFF","#9B5DE5"];

function Profile() {
  const { user, boards, login } = useContext(AppContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");

  if (!user) {
    return (
      <div>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div style={styles.loading}>
          <p style={styles.loadingText}>Not logged in</p>
          <button onClick={() => navigate("/")} className="btn-primary" style={{ marginTop: 16 }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!editName.trim()) return;
    const updated = { ...user, name: editName.trim() };
    localStorage.setItem("user", JSON.stringify(updated));
    login(updated);
    setIsEditing(false);
    showToast("Profile updated!");
  };

  const handleAvatarChange = (url) => {
    const updated = { ...user, pfp: url };
    localStorage.setItem("user", JSON.stringify(updated));
    login(updated);
    setShowAvatarPicker(false);
    showToast("Avatar updated!");
  };

  const totalPins = boards.reduce((n, b) => n + (b.pins?.length || 0), 0);
  const accentColor = ACCENT_COLORS[user.name?.charCodeAt(0) % ACCENT_COLORS.length] || "#FF5EBA";

  return (
    <div>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={styles.container}>
        {/* Profile hero */}
        <div style={styles.hero}>
          {/* Colored accent stripe */}
          <div style={{ ...styles.heroAccent, background: accentColor }} />

          <div style={styles.heroContent}>
            <div style={styles.avatarWrap}>
              <div style={{ ...styles.avatarRing, borderColor: accentColor }}>
                <img src={user.pfp} alt={user.name} style={styles.avatar} />
              </div>
              <button onClick={() => setShowAvatarPicker(true)} style={{ ...styles.changeBtn, color: accentColor }}>
                Change avatar
              </button>
            </div>

            <div style={styles.userMeta}>
              {isEditing ? (
                <div style={styles.editRow}>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    style={{ ...styles.editInput, borderColor: accentColor }}
                    autoFocus
                    onKeyDown={e => { if (e.key === "Enter") handleSave(); }}
                  />
                  <button onClick={handleSave} style={{ ...styles.saveBtn, background: accentColor }}>Save</button>
                  <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
                </div>
              ) : (
                <div style={styles.nameRow}>
                  <h1 style={styles.name}>{user.name}</h1>
                  <button onClick={() => { setEditName(user.name); setIsEditing(true); }} style={styles.editBtn}>
                    edit
                  </button>
                </div>
              )}
              <p style={styles.email}>{user.email}</p>
            </div>

            <div style={styles.stats}>
              <div style={styles.statBox}>
                <span style={{ ...styles.statNum, color: accentColor }}>{boards.length}</span>
                <span style={styles.statLabel}>Boards</span>
              </div>
              <div style={styles.statSep} />
              <div style={styles.statBox}>
                <span style={{ ...styles.statNum, color: accentColor }}>{totalPins}</span>
                <span style={styles.statLabel}>Pins saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Boards section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Your Boards</h2>
            <button onClick={() => navigate("/create")} style={styles.newBoardBtn}>
              + New Board
            </button>
          </div>

          {boards.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyText}>No boards yet — start creating!</p>
              <button onClick={() => navigate("/create")} className="btn-primary" style={{ marginTop: 16 }}>
                Create your first board
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {boards.map((board, i) => {
                const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
                return (
                  <div key={board._id} style={styles.boardCard} onClick={() => navigate(`/board/${board._id}`)}>
                    <div style={{ ...styles.boardThumb, borderTopColor: color }}>
                      {board.pins?.[0] ? (
                        <img src={board.pins[0].image} alt={board.title} style={styles.boardImg} />
                      ) : (
                        <div style={{ ...styles.boardPlaceholder, color }}>◆</div>
                      )}
                    </div>
                    <div style={styles.boardInfo}>
                      <p style={styles.boardName}>{board.title}</p>
                      <p style={styles.boardMeta}>{board.pins?.length || 0} pins · {board.isPublic ? "Public" : "Private"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Avatar picker */}
      {showAvatarPicker && (
        <div className="modal-overlay" onClick={() => setShowAvatarPicker(false)}>
          <div style={styles.avatarModal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.avatarModalTitle}>Choose your avatar</h3>
            <p style={styles.avatarModalSub}>Illustrated characters, each uniquely yours</p>
            <div style={styles.avatarGrid}>
              {AVATARS.map((url, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.avatarOptWrap,
                    border: user.pfp === url ? `3px solid ${accentColor}` : "3px solid transparent",
                    boxShadow: user.pfp === url ? `0 0 0 2px ${accentColor}` : "none",
                  }}
                  onClick={() => handleAvatarChange(url)}
                >
                  <img src={url} alt={AVATAR_SEEDS[i]} style={styles.avatarOpt} />
                </div>
              ))}
            </div>
            <button onClick={() => setShowAvatarPicker(false)} style={styles.closePicker}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "1100px", margin: "0 auto", padding: "28px 24px" },
  loading: { textAlign: "center", padding: "80px 20px" },
  loadingText: { fontFamily: "Fraunces, serif", fontSize: "24px", color: "#7A7080" },

  hero: {
    background: "white",
    borderRadius: "24px",
    border: "2.5px solid #1A1A2E",
    marginBottom: "24px",
    overflow: "hidden",
    boxShadow: "4px 4px 0 #1A1A2E",
  },
  heroAccent: { height: "8px", width: "100%" },
  heroContent: {
    padding: "32px 40px",
    display: "flex", alignItems: "center",
    gap: "32px", flexWrap: "wrap",
  },
  avatarWrap: { textAlign: "center", flexShrink: 0 },
  avatarRing: {
    width: "110px", height: "110px",
    borderRadius: "50%",
    border: "4px solid",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#FFF8EE",
    overflow: "hidden",
    marginBottom: "10px",
  },
  avatar: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" },
  changeBtn: {
    background: "none", border: "none",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "12px",
    cursor: "pointer", textDecoration: "underline",
  },
  userMeta: { flex: 1 },
  nameRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" },
  name: {
    fontFamily: "Fraunces, serif",
    fontSize: "32px", fontWeight: 700, color: "#1A1A2E",
  },
  editBtn: {
    background: "#FFF8EE", border: "1.5px solid #EAE0D5",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 700, fontSize: "12px", color: "#7A7080",
    cursor: "pointer", padding: "4px 12px", borderRadius: "99px",
  },
  email: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    color: "#7A7080", fontSize: "14px",
  },
  editRow: { display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" },
  editInput: {
    padding: "9px 14px", borderRadius: "12px",
    border: "2.5px solid",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 700, fontSize: "16px",
    outline: "none", width: "200px",
  },
  saveBtn: {
    color: "white", border: "none",
    padding: "9px 18px", borderRadius: "99px",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "13px", cursor: "pointer",
  },
  cancelBtn: {
    background: "#FFF8EE", border: "1.5px solid #EAE0D5",
    padding: "9px 16px", borderRadius: "99px",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 700, color: "#7A7080", cursor: "pointer",
  },
  stats: {
    display: "flex", alignItems: "center", gap: "24px",
    marginLeft: "auto",
  },
  statBox: { textAlign: "center" },
  statNum: {
    display: "block",
    fontFamily: "Fraunces, serif",
    fontSize: "40px", fontWeight: 700, lineHeight: 1,
  },
  statLabel: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "12px", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.06em",
    color: "#7A7080",
  },
  statSep: { width: "2px", height: "48px", background: "#EAE0D5" },

  section: {
    background: "white",
    border: "2px solid #EAE0D5",
    borderRadius: "20px", padding: "28px",
  },
  sectionHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "24px",
  },
  sectionTitle: {
    fontFamily: "Fraunces, serif",
    fontSize: "24px", fontWeight: 700, color: "#1A1A2E",
  },
  newBoardBtn: {
    background: "#FF5EBA", color: "white",
    border: "2px solid #1A1A2E",
    padding: "8px 18px", borderRadius: "99px",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "13px",
    cursor: "pointer",
    boxShadow: "2px 2px 0 #1A1A2E",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
    gap: "16px",
  },
  boardCard: {
    cursor: "pointer", borderRadius: "18px",
    border: "2px solid #EAE0D5", overflow: "hidden",
    background: "#FFFCF5",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  boardThumb: {
    aspectRatio: "4/3", overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#FFF8EE",
    borderTop: "4px solid",
  },
  boardImg: { width: "100%", height: "100%", objectFit: "cover" },
  boardPlaceholder: {
    fontSize: "36px", fontFamily: "Cabinet Grotesk, sans-serif",
  },
  boardInfo: { padding: "12px 14px" },
  boardName: {
    fontFamily: "Fraunces, serif",
    fontWeight: 700, fontSize: "15px", color: "#1A1A2E", marginBottom: "3px",
  },
  boardMeta: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "12px", color: "#7A7080",
  },
  empty: { textAlign: "center", padding: "48px 20px" },
  emptyText: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    color: "#7A7080", fontSize: "16px",
  },

  avatarModal: {
    background: "white", borderRadius: "24px",
    border: "2.5px solid #1A1A2E",
    padding: "32px", maxWidth: "520px", width: "93%",
    maxHeight: "85vh", overflow: "auto",
    boxShadow: "6px 6px 0 #1A1A2E",
  },
  avatarModalTitle: {
    fontFamily: "Fraunces, serif",
    fontWeight: 700, fontSize: "22px",
    color: "#1A1A2E", marginBottom: "4px",
  },
  avatarModalSub: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    color: "#7A7080", fontSize: "13px", marginBottom: "20px",
  },
  avatarGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px",
    marginBottom: "20px",
  },
  avatarOptWrap: {
    borderRadius: "50%", cursor: "pointer",
    transition: "transform 0.15s",
    overflow: "hidden",
    aspectRatio: "1",
    background: "#FFF8EE",
  },
  avatarOpt: {
    width: "100%", height: "100%",
    objectFit: "cover", display: "block",
  },
  closePicker: {
    width: "100%", padding: "13px",
    background: "#1A1A2E", color: "#FFD93D",
    border: "none", borderRadius: "14px",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "15px", cursor: "pointer",
  },
};

export default Profile; 