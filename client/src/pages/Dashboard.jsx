import { useState, useContext, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PinCard from "../components/PinCard";
import PinModal from "../components/PinModal";
import Modal from "../components/Modal";
import { AppContext } from "../context/context";
import { showToast } from "../utils/toast";

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [boardModalOpen, setBoardModalOpen] = useState(false);
    const [selectedPin, setSelectedPin] = useState(null);
    const [openPin, setOpenPin] = useState(null);
    const [search, setSearch] = useState("");
    const { boards, pins, savePinToBoard, refreshSpotifyStatus } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        // Handle search query param
        const s = params.get("search");
        if (s) setSearch(s);

        // Handle Spotify OAuth callback redirect
        const spotifyParam = params.get("spotify");
        if (spotifyParam === "connected") {
            showToast("Spotify connected! 🎵");
            refreshSpotifyStatus();
            navigate("/dashboard", { replace: true });
        } else if (spotifyParam === "error") {
            showToast("Spotify connection failed. Please try again.");
            navigate("/dashboard", { replace: true });
        }
    }, [location.search, navigate, refreshSpotifyStatus]);

    const filtered = search.trim()
        ? pins.filter(p =>
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.author?.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.toLowerCase().includes(search.toLowerCase())
          )
        : pins;

    const handleSaveClick = useCallback((pin) => {
        if (boards.length === 0) { showToast("Create a board first!"); navigate("/create"); return; }
        setSelectedPin(pin); setOpenPin(null); setBoardModalOpen(true);
    }, [boards, navigate]);

    const handleSaveToBoard = useCallback((boardId) => {
        if (!selectedPin) return;
        savePinToBoard(selectedPin, boardId);
        setBoardModalOpen(false); setSelectedPin(null);
        showToast("Saved to board! ✨");
    }, [selectedPin, savePinToBoard]);

    return (
        <div>
            <Navbar onMenuClick={() => setSidebarOpen(true)} onSearch={setSearch} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div style={styles.header}>
                <h1 style={styles.headTitle}>Discover <span className="gradient-text">Inspiration</span></h1>
                <p style={styles.headSub}>{filtered.length} pins waiting for you ✨</p>
            </div>

            {pins.length === 0 ? (
                <div style={styles.empty}>
                    <div style={styles.emptyIcon}>◎</div>
                    <h3 style={styles.emptyTitle}>No pins yet</h3>
                    <p style={styles.emptySub}>Run <code>node seed.js</code> in the server folder to populate pins</p>
                </div>
            ) : filtered.length === 0 ? (
                <div style={styles.empty}>
                    <div style={styles.emptyIcon}>🔍</div>
                    <h3 style={styles.emptyTitle}>Nothing found</h3>
                    <p style={styles.emptySub}>Try a different search</p>
                </div>
            ) : (
                <div className="masonry-grid">
                    {filtered.map((pin, i) => (
                        <div key={pin._id || pin.id} className="masonry-item" style={{ animationDelay: `${i * 0.035}s` }}>
                            <PinCard pin={pin} onSave={handleSaveClick} onClick={() => setOpenPin(pin)} />
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={boardModalOpen} onClose={() => setBoardModalOpen(false)} title="Save to Board">
                <div style={styles.boardList}>
                    {boards.map(board => (
                        <button key={board._id} onClick={() => handleSaveToBoard(board._id)} style={styles.boardBtn}>
                            <span style={styles.boardDot} />
                            <span>{board.title}</span>
                            <span style={styles.boardCount}>{board.pins?.length || 0} pins</span>
                        </button>
                    ))}
                    <button onClick={() => { setBoardModalOpen(false); navigate("/create"); }} style={styles.newBoardBtn}>
                        + New Board
                    </button>
                </div>
            </Modal>

            {openPin && <PinModal pin={openPin} onClose={() => setOpenPin(null)} onSave={handleSaveClick} />}
        </div>
    );
}

const styles = {
    header: { padding:"36px 24px 16px", maxWidth:1600, margin:"0 auto" },
    headTitle: { fontFamily:"Fraunces,serif", fontSize:52, fontWeight:700, color:"#1A1A2E", lineHeight:1.1, marginBottom:8 },
    headSub: { fontFamily:"Cabinet Grotesk,sans-serif", color:"#7A7080", fontSize:16 },
    boardList: { display:"flex", flexDirection:"column", gap:10 },
    boardBtn: { display:"flex", alignItems:"center", gap:12, padding:"14px 18px", background:"#FFF8EE", border:"2px solid #EAE0D5", borderRadius:14, cursor:"pointer", fontFamily:"Cabinet Grotesk,sans-serif", fontWeight:700, fontSize:14, color:"#1A1A2E", textAlign:"left" },
    boardDot: { width:10, height:10, borderRadius:"50%", background:"#FF5EBA", flexShrink:0 },
    boardCount: { marginLeft:"auto", fontSize:12, color:"#7A7080" },
    newBoardBtn: { padding:"14px 18px", background:"#1A1A2E", color:"#FFD93D", border:"none", borderRadius:14, cursor:"pointer", fontFamily:"Cabinet Grotesk,sans-serif", fontWeight:800, fontSize:14 },
    empty: { textAlign:"center", padding:"80px 20px" },
    emptyIcon: { fontSize:64, marginBottom:16, color:"#EAE0D5" },
    emptyTitle: { fontFamily:"Fraunces,serif", fontSize:24, fontWeight:700, marginBottom:8 },
    emptySub: { color:"#7A7080", fontFamily:"Cabinet Grotesk,sans-serif" },
};

export default Dashboard;
