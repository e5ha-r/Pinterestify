import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../api";

const CATEGORIES = [
  { id: 1, label: "All", keyword: "" },
  { id: 2, label: "Music-Based", keyword: "music" },
  { id: 3, label: "Mood-Based", keyword: "mood" },
  { id: 4, label: "Aesthetic", keyword: "aesthetic" },
  { id: 5, label: "Art & Design", keyword: "art" },
  { id: 6, label: "Food", keyword: "food" },
];

function BoardCard({ board }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  
  // Use the first pin image as a cover, or a fallback color
  const coverImage = board.pins?.length > 0 
    ? board.pins[0].image 
    : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? "translateY(-6px) rotate(-0.5deg)" : "none",
        boxShadow: hovered ? `6px 6px 0 #1A1A2E` : "2px 2px 0 #EAE0D5",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/board/${board._id}`)}
    >
      <img src={coverImage} alt={board.title} style={styles.img} />
      <div style={styles.labelBar}>
        <span style={styles.label}>{board.title}</span>
        <span style={styles.creatorName}>By {board.creator?.name || "Unknown"}</span>
      </div>
    </div>
  );
}

function Explore() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publicBoards, setPublicBoards] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicBoards = async () => {
      try {
        const res = await api.get("/boards/public");
        setPublicBoards(res.data);
      } catch (err) {
        console.error("Failed to fetch public boards:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicBoards();
  }, []);

  const filteredBoards = activeCategory 
    ? publicBoards.filter(b => b.title.toLowerCase().includes(activeCategory.toLowerCase()))
    : publicBoards;

  return (
    <div>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Explore Public Boards</h1>
          <p style={styles.sub}>Discover and get inspired by boards created by the community.</p>
        </div>

        <div style={styles.filterWrap}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.keyword)}
              style={{
                ...styles.filterBtn,
                background: activeCategory === cat.keyword ? "#1A1A2E" : "white",
                color: activeCategory === cat.keyword ? "white" : "#7A7080",
                borderColor: activeCategory === cat.keyword ? "#1A1A2E" : "#EAE0D5",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>Loading public boards...</p>
          </div>
        ) : filteredBoards.length > 0 ? (
          <div style={styles.grid}>
            {filteredBoards.map(board => (
              <BoardCard key={board._id} board={board} />
            ))}
          </div>
        ) : (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🔍</div>
            <p style={styles.emptyText}>No public boards found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "1300px", margin: "0 auto", padding: "28px 24px" },
  header: { marginBottom: "28px" },
  title: {
    fontFamily: "Fraunces, serif",
    fontSize: "52px", fontWeight: 700, color: "#1A1A2E", marginBottom: "6px",
  },
  sub: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    color: "#7A7080", fontSize: "16px",
  },
  filterWrap: {
    display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "32px",
  },
  filterBtn: {
    padding: "8px 16px", borderRadius: "99px",
    border: "2px solid", fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 700, fontSize: "14px", cursor: "pointer",
    transition: "all 0.2s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    position: "relative",
    borderRadius: "18px", overflow: "hidden",
    cursor: "pointer", border: "2.5px solid #1A1A2E",
    background: "white",
    transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease",
  },
  img: {
    width: "100%", aspectRatio: "4/3",
    objectFit: "cover", display: "block",
    borderBottom: "2.5px solid #1A1A2E",
  },
  labelBar: {
    padding: "16px",
    display: "flex", flexDirection: "column", gap: "4px",
  },
  label: {
    fontFamily: "Fraunces, serif",
    fontWeight: 700, fontSize: "20px", color: "#1A1A2E",
  },
  creatorName: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "13px", color: "#7A7080", fontWeight: 700,
  },
  empty: {
    textAlign: "center", padding: "80px",
    background: "#FFF8EE", borderRadius: "24px",
    border: "2px dashed #EAE0D5",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
  },
  emptyIcon: { fontSize: "48px" },
  emptyText: { fontFamily: "Cabinet Grotesk, sans-serif", fontSize: "16px", color: "#7A7080" },
};

export default Explore;