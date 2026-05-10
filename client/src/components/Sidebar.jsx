import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";

const NAV = [
  { label: "Home",    to: "/dashboard",  emoji: "🏠" },
  { label: "Explore", to: "/explore",    emoji: "🔭" },
  { label: "+ Board", to: "/create",     emoji: "📂" },
  { label: "+ Pin",   to: "/create-pin", emoji: "📌" },
  { label: "Profile", to: "/profile",    emoji: "👤" },
];

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(26,26,46,0.4)",
            zIndex: 200, backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Drawer */}
      <aside style={{
        position: "fixed", top: 0, left: 0,
        height: "100vh", width: "260px",
        background: "#FFFCF5",
        borderRight: "2.5px solid #1A1A2E",
        zIndex: 201, padding: "32px 20px",
        transform: isOpen ? "translateX(0)" : "translateX(-110%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column", gap: "8px",
        boxShadow: isOpen ? "8px 0 40px rgba(0,0,0,0.12)" : "none",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <span style={{ fontSize: "22px" }}>📌</span>
          <span style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: "20px", color: "#1A1A2E" }}>
            Pinterestify
          </span>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>✕</button>
        </div>

        {/* User chip */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", background: "#FFF0FB", borderRadius: "14px", border: "1.5px solid #FFDDF5", marginBottom: "16px" }}>
            <img src={user.pfp} alt={user.name} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #FF5EBA", objectFit: "cover" }} />
            <div>
              <p style={{ fontFamily: "Cabinet Grotesk, sans-serif", fontWeight: 800, fontSize: "14px", color: "#1A1A2E" }}>{user.name || user.username}</p>
              <p style={{ fontFamily: "Cabinet Grotesk, sans-serif", fontSize: "11px", color: "#7A7080" }}>{user.email}</p>
            </div>
          </div>
        )}

        {/* Nav items */}
        {NAV.map(n => (
          <Link key={n.to} to={n.to} onClick={onClose} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "12px 16px", borderRadius: "14px",
            fontFamily: "Cabinet Grotesk, sans-serif",
            fontWeight: 700, fontSize: "15px", color: "#1A1A2E",
            textDecoration: "none",
            transition: "background 0.15s",
          }}>
            <span style={{ fontSize: "18px" }}>{n.emoji}</span>
            {n.label}
          </Link>
        ))}

        {/* Logout */}
        {user && (
          <button
            onClick={() => { logout(); navigate("/"); }}
            style={{
              marginTop: "auto", padding: "12px 16px",
              background: "none", border: "2px solid #EAE0D5",
              borderRadius: "14px", cursor: "pointer",
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 700, fontSize: "14px", color: "#7A7080",
              textAlign: "left",
            }}
          >
            🚪 Logout
          </button>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
