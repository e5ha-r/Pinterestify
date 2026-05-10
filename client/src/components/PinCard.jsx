import { useState } from "react";

function PinCard({ pin, onSave, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fallback = `https://via.placeholder.com/400x500/FFF8EE/1A1A2E?text=${encodeURIComponent(pin.title || 'Pin')}`;

  return (
    <div
      style={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick?.(pin)}
    >
      <div style={styles.imgWrap}>
        <img
          src={imgError ? fallback : pin.image}
          alt={pin.title}
          style={styles.img}
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Hover overlay */}
        <div style={{ ...styles.overlay, opacity: hovered ? 1 : 0 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onSave?.(pin); }}
            style={styles.saveBtn}
          >
            Save
          </button>
          {pin.spotifyPreview && (
            <a
              href={pin.spotifyPreview}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={styles.playBtn}
              title="Preview on Spotify"
            >
              ▶
            </a>
          )}
        </div>

        {/* Category badge */}
        <span style={styles.badge}>{pin.category}</span>
      </div>

      <div style={styles.meta}>
        <p style={styles.title}>{pin.title}</p>
        <p style={styles.author}>by {pin.author}</p>
        <div style={styles.stats}>
          <span style={styles.stat}>♥ {pin.likes || 0}</span>
          <span style={styles.stat}>⭐ {pin.saves || 0}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: "18px",
    overflow: "hidden",
    cursor: "pointer",
    background: "white",
    border: "2px solid #EAE0D5",
    transition: "transform 0.2s, box-shadow 0.2s",
    breakInside: "avoid",
  },
  imgWrap: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    display: "block",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  overlay: {
    position: "absolute", inset: 0,
    background: "rgba(26,26,46,0.4)",
    display: "flex", alignItems: "flex-start", justifyContent: "flex-end",
    padding: "12px",
    gap: "8px",
    transition: "opacity 0.2s",
  },
  saveBtn: {
    background: "#FF5EBA", color: "white",
    border: "none", borderRadius: "99px",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "13px",
    padding: "7px 16px", cursor: "pointer",
  },
  playBtn: {
    background: "#1DB954", color: "white",
    border: "none", borderRadius: "50%",
    width: "32px", height: "32px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", textDecoration: "none",
    cursor: "pointer",
  },
  badge: {
    position: "absolute", bottom: "10px", left: "10px",
    background: "rgba(255,255,255,0.9)",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "11px",
    color: "#1A1A2E", padding: "3px 10px",
    borderRadius: "99px", letterSpacing: "0.05em",
    textTransform: "capitalize",
  },
  meta: { padding: "12px 14px 14px" },
  title: {
    fontFamily: "Fraunces, serif",
    fontWeight: 700, fontSize: "15px", color: "#1A1A2E",
    marginBottom: "3px", lineHeight: 1.3,
  },
  author: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "12px", color: "#7A7080", marginBottom: "6px",
  },
  stats: { display: "flex", gap: "12px" },
  stat: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "12px", fontWeight: 700, color: "#7A7080",
  },
};

export default PinCard;
