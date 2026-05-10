import { useState } from "react";

function PlaylistCard({ playlist, onAttach }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? "scale(1.03)" : "scale(1)",
        boxShadow: hovered ? "4px 4px 0 #1A1A2E" : "1px 1px 0 #EAE0D5",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={playlist.image} alt={playlist.name} style={styles.img} />
      <div style={styles.info}>
        <p style={styles.name}>{playlist.name}</p>
        <p style={styles.tracks}>{playlist.tracks} tracks</p>
      </div>
      <button onClick={() => onAttach(playlist)} style={styles.btn}>
        Attach
      </button>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: "14px",
    border: "2px solid #EAE0D5",
    overflow: "hidden",
    background: "white",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex", flexDirection: "column",
  },
  img: {
    width: "100%", aspectRatio: "1",
    objectFit: "cover", display: "block",
    borderBottom: "2px solid #EAE0D5",
  },
  info: { padding: "10px 10px 4px" },
  name: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "12px", color: "#1A1A2E",
    marginBottom: "2px", whiteSpace: "nowrap",
    overflow: "hidden", textOverflow: "ellipsis",
  },
  tracks: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "11px", color: "#7A7080",
  },
  btn: {
    margin: "8px 10px 10px",
    padding: "7px",
    background: "#1DB954", color: "white",
    border: "2px solid #1A1A2E", borderRadius: "8px",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "12px",
    cursor: "pointer", boxShadow: "2px 2px 0 #1A1A2E",
  },
};

export default PlaylistCard;
