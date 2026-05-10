import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/context";

function Navbar({ onMenuClick, onSearch }) {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");

  const handleSearch = (e) => {
    const v = e.target.value;
    setSearchVal(v);
    onSearch?.(v);
  };

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/dashboard" style={styles.logo}>
        <span style={styles.logoEmoji}>📌</span>
        <span style={styles.logoText}>Pinterestify</span>
      </Link>

      {/* Search */}
      {onSearch && (
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search pins, authors, vibes…"
            value={searchVal}
            onChange={handleSearch}
            style={styles.searchInput}
          />
        </div>
      )}

      {/* Nav links */}
      <div style={styles.links}>
        <Link to="/dashboard"  style={styles.link}>Home</Link>
        <Link to="/explore"    style={styles.link}>Explore</Link>
        <Link to="/create"     style={styles.link}>+ Board</Link>
        <Link to="/create-pin" style={styles.link}>+ Pin</Link>

        {user ? (
          <>
            <Link to="/profile" style={styles.avatarBtn}>
              <img src={user.pfp} alt={user.name} style={styles.avatar} />
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <Link to="/" style={styles.signInBtn}>Sign in</Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button onClick={onMenuClick} style={styles.hamburger}>☰</button>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex", alignItems: "center", gap: "16px",
    padding: "0 24px", height: "64px",
    background: "white",
    borderBottom: "2.5px solid #1A1A2E",
    position: "sticky", top: 0, zIndex: 100,
  },
  logo: {
    display: "flex", alignItems: "center", gap: "8px",
    textDecoration: "none", flexShrink: 0,
  },
  logoEmoji: { fontSize: "22px" },
  logoText: {
    fontFamily: "Fraunces, serif",
    fontWeight: 700, fontSize: "20px", color: "#1A1A2E",
  },
  searchWrap: {
    flex: 1, maxWidth: "480px",
    display: "flex", alignItems: "center", gap: "10px",
    background: "#FFF8EE", borderRadius: "99px",
    border: "2px solid #EAE0D5",
    padding: "0 18px", height: "40px",
  },
  searchIcon: { fontSize: "14px", flexShrink: 0 },
  searchInput: {
    flex: 1, border: "none", background: "transparent",
    fontFamily: "Cabinet Grotesk, sans-serif", fontSize: "14px",
    outline: "none", color: "#1A1A2E",
  },
  links: {
    display: "flex", alignItems: "center", gap: "4px",
    marginLeft: "auto",
  },
  link: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 700, fontSize: "14px", color: "#1A1A2E",
    textDecoration: "none", padding: "6px 12px",
    borderRadius: "99px",
    transition: "background 0.15s",
  },
  avatarBtn: { display: "flex", alignItems: "center", marginLeft: "8px" },
  avatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    border: "2px solid #1A1A2E", objectFit: "cover",
    background: "#FFF8EE",
  },
  logoutBtn: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "13px",
    padding: "6px 14px", borderRadius: "99px",
    background: "transparent", border: "2px solid #EAE0D5",
    cursor: "pointer", color: "#7A7080", marginLeft: "8px",
  },
  signInBtn: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "13px",
    padding: "7px 18px", borderRadius: "99px",
    background: "#FF5EBA", color: "white",
    textDecoration: "none",
    border: "2px solid #1A1A2E",
    boxShadow: "2px 2px 0 #1A1A2E",
  },
  hamburger: {
    display: "none", background: "none", border: "none",
    fontSize: "22px", cursor: "pointer", marginLeft: "auto",
  },
};

export default Navbar;
