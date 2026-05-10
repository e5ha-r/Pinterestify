import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import PlaylistCard from "../components/PlaylistCard";
import { AppContext } from "../context/context";
import { showToast } from "../utils/toast";
import api from "../api";

const SAMPLE_PLAYLISTS = [
  { id: "37i9dQZF1DXcBWIGoYBM5M", name: "Today's Top Hits", tracks: 50, image: "https://picsum.photos/id/20/400/400" },
  { id: "37i9dQZF1DWWMOmoXKqHTD", name: "Songs to Sing in the Car", tracks: 75, image: "https://picsum.photos/id/25/400/400" },
  { id: "37i9dQZF1DX4WYpdVIPGvV", name: "Lofi Beats", tracks: 100, image: "https://picsum.photos/id/26/400/400" },
  { id: "37i9dQZF1DX8Uebhn9wzrS", name: "Chill Lout Lounge", tracks: 60, image: "https://picsum.photos/id/29/400/400" },
];

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);

  // FIX: Track Spotify connection via API call instead of checking a
  // "spotify_token" key in localStorage (which was never set by the app).
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  const { boards, deleteBoard, updateBoard, addPlaylistToBoard, removePinFromBoard, fetchSpotifyPlaylists, connectSpotify } = useContext(AppContext);

  const board = boards.find(b => b._id === id || b.id === parseInt(id));

  // FIX: Check Spotify connection status from the server on mount.
  useEffect(() => {
    api.get("/spotify/status")
      .then(({ data }) => setSpotifyConnected(data.connected))
      .catch(() => setSpotifyConnected(false));
  }, []);

  // FIX: Gate on spotifyConnected (not a missing localStorage key).
  // FIX: Call fetchSpotifyPlaylists() with no arguments — JWT is sent automatically.
  // FIX: context already maps the shape, so use data.items directly.
  useEffect(() => {
    if (playlistModal && spotifyConnected) {
      setIsLoadingPlaylists(true);
      fetchSpotifyPlaylists().then(data => {
        if (data && data.items) {
          setSpotifyPlaylists(data.items);
        }
        setIsLoadingPlaylists(false);
      });
    }
  }, [playlistModal, spotifyConnected, fetchSpotifyPlaylists]);

  const [editTitle, setEditTitle] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(true);

  useEffect(() => {
    if (board) {
      setEditTitle(board.title);
      setEditIsPublic(board.isPublic ?? true);
    }
  }, [board]);

  if (!board) {
    return (
      <div>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div style={styles.notFound}>
          <h2 style={styles.notFoundTitle}>Board not found</h2>
          <button onClick={() => navigate("/dashboard")} className="btn-primary">Back to Home</button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteBoard(board._id);
    navigate("/dashboard");
  };

  const handleEditBoard = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    await updateBoard(board._id, { title: editTitle, isPublic: editIsPublic });
    setEditModal(false);
    showToast("Board updated!");
  };

  const handleAttach = (playlist) => {
    addPlaylistToBoard(board._id, playlist);
    setPlaylistModal(false);
    showToast(`Added "${playlist.name}"!`);
  };

  const handleRemovePin = (pinId) => {
    if (window.confirm("Remove this pin from your board?")) {
      removePinFromBoard(board._id, pinId);
    }
  };

  // Determine what to play in the iframe
  const playingPlaylistId = board.playlists?.length > 0 
    ? board.playlists[board.playlists.length - 1].id 
    : "37i9dQZF1DXcBWIGoYBM5M"; // Fallback to a default playlist if none are attached

  return (
    <div>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.boardName}>{board.title}</h1>
            <p style={styles.meta}>{board.pins?.length || 0} pins · {board.playlists?.length || 0} playlists</p>
          </div>
          <div style={styles.actions}>
            <button onClick={() => setPlaylistModal(true)} style={styles.musicBtn}>Add Music</button>
            <button onClick={() => setEditModal(true)} style={styles.editBtn}>Edit Board</button>
            <button onClick={() => setDeleteModal(true)} style={styles.deleteBtn}>Delete</button>
          </div>
        </div>

        <div style={styles.layout}>
          <div style={styles.pinsCol}>
            <h3 style={styles.colTitle}>Saved Pins</h3>
            {board.pins?.length > 0 ? (
              <div style={styles.pinsGrid}>
                {board.pins.map((pin, i) => (
                  <div key={pin._id || i} style={{ position: "relative" }}>
                    <img src={pin.image} alt="" style={styles.pinImg} />
                    <button 
                      onClick={() => handleRemovePin(pin._id || pin.id)}
                      style={styles.removePinBtn}
                      title="Remove Pin"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.empty}>
                <span style={styles.emptyIcon}>◎</span>
                <p style={styles.emptyText}>No pins saved yet</p>
              </div>
            )}
          </div>

          <div style={styles.musicCol}>
            <h3 style={styles.colTitle}>Music Player</h3>
            <div style={styles.playerWrap}>
              <iframe
                src={`https://open.spotify.com/embed/playlist/${playingPlaylistId}`}
                width="100%" height="352"
                frameBorder="0"
                allow="encrypted-media"
                title="Spotify"
                style={{ borderRadius: "12px", display: "block" }}
              />
            </div>

            <h3 style={{ ...styles.colTitle, marginTop: "24px" }}>Playlists</h3>
            {board.playlists?.length > 0 ? (
              <div style={styles.playlistList}>
                {board.playlists.map((pl, i) => (
                  <div key={pl.id || i} style={styles.plItem}>
                    <div style={styles.plDot} />
                    <span style={styles.plName}>{pl.name}</span>
                    <span style={styles.plCount}>{pl.tracks} tracks</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.emptySmall}>No playlists attached</p>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={playlistModal} onClose={() => setPlaylistModal(false)} title="Add Music">
        {/* FIX: Use spotifyConnected state (from /api/spotify/status) instead of
            checking localStorage("spotify_token") which was never written. */}
        {!spotifyConnected ? (
          <>
            <div style={{ textAlign:"center", padding:"20px 12px" }}>
              <p style={{ fontFamily:"Cabinet Grotesk,sans-serif", fontWeight:700, fontSize:15, color:"#1A1A2E", marginBottom:16 }}>
                Connect Spotify to attach your real playlists, or use these sample ones:
              </p>
              <button
                onClick={() => { setPlaylistModal(false); connectSpotify(); }}
                style={{ background:"#1DB954", color:"white", border:"2px solid #1A1A2E", borderRadius:99, padding:"10px 24px", fontFamily:"Cabinet Grotesk,sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", marginBottom:20, boxShadow:"2px 2px 0 #1A1A2E" }}
              >
                Connect Spotify 🎵
              </button>
            </div>
            <div style={styles.plGrid}>
              {SAMPLE_PLAYLISTS.map(pl => (
                <PlaylistCard key={pl.id} playlist={pl} onAttach={handleAttach} />
              ))}
            </div>
          </>
        ) : isLoadingPlaylists ? (
          <p style={styles.loadingPlaylistsText}>Loading your Spotify playlists...</p>
        ) : spotifyPlaylists.length > 0 ? (
          <div style={styles.plGrid}>
            {spotifyPlaylists.map(pl => (
              <PlaylistCard key={pl.id} playlist={pl} onAttach={handleAttach} />
            ))}
          </div>
        ) : (
          <p style={styles.loadingPlaylistsText}>No public playlists found on your account.</p>
        )}
      </Modal>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Board">
        <form onSubmit={handleEditBoard} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={styles.formLabel}>Board Name</label>
            <input 
              style={styles.formInput} 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)} 
            />
          </div>
          <label style={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              checked={editIsPublic} 
              onChange={e => setEditIsPublic(e.target.checked)} 
              style={{ accentColor: "#FF5EBA", width: "18px", height: "18px" }}
            />
            Make this board public
          </label>
          <div style={styles.confirmBtns}>
            <button type="button" onClick={() => setEditModal(false)} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.confirmDeleteBtn}>Save Changes</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Board">
        <p style={styles.confirmText}>
          Are you sure you want to delete <strong>{board.title}</strong>? This cannot be undone.
        </p>
        <div style={styles.confirmBtns}>
          <button onClick={() => setDeleteModal(false)} style={styles.cancelBtn}>Cancel</button>
          <button onClick={handleDelete} style={styles.confirmDeleteBtn}>Delete Forever</button>
        </div>
      </Modal>
    </div>
  );
}

const styles = {
  container: { maxWidth: "1300px", margin: "0 auto", padding: "28px 24px" },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: "28px",
    flexWrap: "wrap", gap: "16px",
  },
  boardName: {
    fontFamily: "Fraunces, serif",
    fontSize: "40px", fontWeight: 700, color: "#1A1A2E", marginBottom: "6px",
  },
  meta: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    color: "#7A7080", fontSize: "14px",
  },
  actions: { display: "flex", gap: "12px" },
  musicBtn: {
    background: "#1DB954", color: "white",
    border: "2px solid #1A1A2E", padding: "10px 22px", borderRadius: "99px",
    fontFamily: "Cabinet Grotesk, sans-serif", fontWeight: 800, fontSize: "13px",
    cursor: "pointer", boxShadow: "2px 2px 0 #1A1A2E",
  },
  deleteBtn: {
    background: "transparent", color: "#FF2D55",
    border: "2px solid #FF2D55", padding: "10px 22px", borderRadius: "99px",
    fontFamily: "Cabinet Grotesk, sans-serif", fontWeight: 800, fontSize: "13px",
    cursor: "pointer",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: "24px", alignItems: "start",
  },
  pinsCol: {
    background: "white", borderRadius: "20px",
    border: "2px solid #EAE0D5", padding: "24px",
  },
  musicCol: {
    background: "white", borderRadius: "20px",
    border: "2px solid #EAE0D5", padding: "24px",
    position: "sticky", top: "80px",
  },
  colTitle: {
    fontFamily: "Fraunces, serif",
    fontWeight: 700, fontSize: "18px",
    color: "#1A1A2E", marginBottom: "16px",
  },
  pinsGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
  },
  pinImg: {
    width: "100%", borderRadius: "12px",
    objectFit: "cover", aspectRatio: "4/5",
    border: "2px solid #EAE0D5",
    display: "block",
  },
  removePinBtn: {
    position: "absolute", top: "8px", right: "8px",
    background: "white", color: "#FF2D55",
    border: "1.5px solid #1A1A2E", borderRadius: "50%",
    width: "26px", height: "26px",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", fontSize: "11px", fontWeight: "bold",
    boxShadow: "2px 2px 0 #1A1A2E",
  },
  editBtn: {
    padding: "10px 20px", borderRadius: "99px",
    background: "white", color: "#1A1A2E",
    border: "2px solid #1A1A2E", fontWeight: 700,
    fontSize: "14px", cursor: "pointer",
    boxShadow: "2px 2px 0 #1A1A2E",
  },
  playerWrap: { borderRadius: "12px", overflow: "hidden" },
  playlistList: { display: "flex", flexDirection: "column", gap: "8px" },
  plItem: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 14px", background: "#FFF8EE", borderRadius: "12px",
    border: "1.5px solid #EAE0D5",
  },
  plDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#FF5EBA", flexShrink: 0 },
  plName: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 700, fontSize: "13px", color: "#1A1A2E",
  },
  plCount: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "11px", color: "#7A7080", marginLeft: "auto",
  },
  empty: {
    textAlign: "center", padding: "48px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
  },
  emptyIcon: { fontSize: "40px", color: "#EAE0D5" },
  emptyText: { fontFamily: "Cabinet Grotesk, sans-serif", color: "#7A7080", fontSize: "14px" },
  emptySmall: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    color: "#7A7080", fontSize: "13px", textAlign: "center", padding: "16px",
  },
  plGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "14px",
  },
  connectSpotifyWrap: {
    textAlign: "center", padding: "24px 12px",
  },
  connectSpotifyText: {
    fontFamily: "Cabinet Grotesk, sans-serif", fontSize: "15px", color: "#1A1A2E", fontWeight: 700,
  },
  loadingPlaylistsText: {
    textAlign: "center", padding: "24px", fontFamily: "Cabinet Grotesk, sans-serif", color: "#7A7080",
  },
  notFound: { textAlign: "center", padding: "80px 20px" },
  notFoundTitle: {
    fontFamily: "Fraunces, serif", fontSize: "28px", fontWeight: 700, marginBottom: "20px",
  },
  confirmText: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "15px", color: "#1A1A2E", marginBottom: "24px", lineHeight: 1.6,
  },
  confirmBtns: { display: "flex", gap: "12px" },
  cancelBtn: {
    flex: 1, padding: "12px", background: "#FFF8EE",
    border: "2px solid #EAE0D5", borderRadius: "12px",
    fontFamily: "Cabinet Grotesk, sans-serif", fontWeight: 700, cursor: "pointer",
  },
  confirmDeleteBtn: {
    flex: 1, padding: "12px", background: "#FF2D55",
    color: "white", border: "2px solid #1A1A2E", borderRadius: "12px",
    fontFamily: "Cabinet Grotesk, sans-serif", fontWeight: 800, cursor: "pointer",
    boxShadow: "2px 2px 0 #1A1A2E",
  },
  formLabel: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800, fontSize: "14px", color: "#1A1A2E",
    textTransform: "uppercase", letterSpacing: "0.05em",
    display: "block", marginBottom: "8px",
  },
  formInput: {
    width: "100%", padding: "14px 16px", borderRadius: "12px",
    border: "2px solid #EAE0D5", fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "16px", color: "#1A1A2E", outline: "none", boxSizing: "border-box"
  },
  checkboxLabel: {
    display: "flex", alignItems: "center", gap: "12px",
    fontFamily: "Cabinet Grotesk, sans-serif", fontWeight: 700, fontSize: "15px",
    cursor: "pointer", color: "#1A1A2E",
  },
};

export default BoardDetail;