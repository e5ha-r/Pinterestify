import { useEffect, useState } from "react";

function PinModal({ pin, onClose, onSave }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!pin) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Image */}
        <div style={styles.imgSide}>
          <img
            src={imgError ? `https://via.placeholder.com/600x700/FFF8EE/1A1A2E?text=${encodeURIComponent(pin.title)}` : pin.image}
            alt={pin.title}
            style={styles.img}
            onError={() => setImgError(true)}
          />
        </div>

        {/* Info */}
        <div style={styles.infoSide}>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>

          <span style={styles.category}>{pin.category}</span>
          <h2 style={styles.title}>{pin.title}</h2>
          <p style={styles.author}>by <strong>{pin.author}</strong></p>

          <div style={styles.stats}>
            <div style={styles.stat}><span style={styles.statNum}>♥ {pin.likes || 0}</span><span style={styles.statLabel}>Likes</span></div>
            <div style={styles.statSep} />
            <div style={styles.stat}><span style={styles.statNum}>⭐ {pin.saves || 0}</span><span style={styles.statLabel}>Saves</span></div>
          </div>

          {/* Spotify track if attached */}
          {pin.spotifyTrackName && (
            <div style={styles.spotify}>
              <span style={styles.spotifyIcon}>🎵</span>
              <div>
                <p style={styles.trackName}>{pin.spotifyTrackName}</p>
                <p style={styles.trackArtist}>{pin.spotifyArtist}</p>
              </div>
              {pin.spotifyPreview && (
                <a href={pin.spotifyPreview} target="_blank" rel="noreferrer" style={styles.previewBtn}>▶</a>
              )}
            </div>
          )}

          <button onClick={() => { onSave(pin); onClose(); }} style={styles.saveBtn}>
            Save to Board
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(26,26,46,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 500, backdropFilter: "blur(5px)",
    padding: "20px",
  },
  modal: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    background: "white",
    borderRadius: "24px", border: "2.5px solid #1A1A2E",
    boxShadow: "8px 8px 0 #1A1A2E",
    overflow: "hidden",
    maxHeight: "85vh", width: "100%", maxWidth: "800px",
  },
  imgSide: { overflow: "hidden", background: "#FFF8EE" },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  infoSide: {
    padding: "32px 28px",
    display: "flex", flexDirection: "column", gap: "12px",
    overflowY: "auto",
  },
  closeBtn: {
    alignSelf: "flex-end",
    background: "#FFF8EE", border: "1.5px solid #EAE0D5",
    borderRadius: "50%", width: "32px", height: "32px",
    cursor: "pointer", fontSize: "14px",
  },
  category: {
    display: "inline-block",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "11px",
    textTransform: "uppercase", letterSpacing: "0.1em",
    background: "#FFF0FB", color: "#FF5EBA",
    padding: "4px 12px", borderRadius: "99px",
  },
  title: {
    fontFamily: "Fraunces, serif",
    fontSize: "28px", fontWeight: 700, color: "#1A1A2E", lineHeight: 1.2,
  },
  author: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "14px", color: "#7A7080",
  },
  stats: { display: "flex", alignItems: "center", gap: "20px" },
  stat: { display: "flex", flexDirection: "column", gap: "2px" },
  statNum: { fontFamily: "Fraunces, serif", fontSize: "22px", fontWeight: 700, color: "#1A1A2E" },
  statLabel: { fontFamily: "Cabinet Grotesk, sans-serif", fontSize: "11px", color: "#7A7080", textTransform: "uppercase" },
  statSep: { width: "2px", height: "36px", background: "#EAE0D5" },
  spotify: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "#F0FFF4", borderRadius: "14px",
    border: "1.5px solid #00E8A2",
    padding: "12px 14px",
  },
  spotifyIcon: { fontSize: "20px" },
  trackName: { fontFamily: "Cabinet Grotesk, sans-serif", fontWeight: 800, fontSize: "13px", color: "#1A1A2E" },
  trackArtist: { fontFamily: "Cabinet Grotesk, sans-serif", fontSize: "12px", color: "#7A7080" },
  previewBtn: {
    marginLeft: "auto", background: "#1DB954", color: "white",
    borderRadius: "50%", width: "28px", height: "28px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "11px", textDecoration: "none",
  },
  saveBtn: {
    marginTop: "auto", padding: "14px",
    background: "#FF5EBA", color: "white",
    border: "2.5px solid #1A1A2E", borderRadius: "14px",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "15px",
    cursor: "pointer", boxShadow: "3px 3px 0 #1A1A2E",
  },
};

export default PinModal;
