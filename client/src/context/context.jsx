import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [boards, setBoards] = useState([]);
  const [pins,   setPins]   = useState([]);

  // Track whether the current user has Spotify connected.
  // This is fetched from the server on login and refreshed after the OAuth callback.
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData?.token) localStorage.setItem("token", userData.token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setBoards([]);
    setSpotifyConnected(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const fetchBoards = useCallback(async () => {
    if (!localStorage.getItem("token")) return;
    try {
      const { data } = await api.get("/boards");
      setBoards(data);
    } catch { /* silently ignore */ }
  }, []);

  const createBoard = useCallback(async (title, isPublic = true, accent = "#FF5EBA") => {
    const { data } = await api.post("/boards", { title, isPublic, accent });
    setBoards(prev => [data, ...prev]);
    return data;
  }, []);

  const deleteBoard = useCallback(async (boardId) => {
    await api.delete(`/boards/${boardId}`);
    setBoards(prev => prev.filter(b => b._id !== boardId));
  }, []);

  const updateBoard = useCallback(async (boardId, updates) => {
    const { data } = await api.put(`/boards/${boardId}`, updates);
    setBoards(prev => prev.map(b => b._id === boardId ? data : b));
    return data;
  }, []);

  const savePinToBoard = useCallback(async (pin, boardId) => {
    const { data } = await api.post(`/boards/${boardId}/pins`, pin);
    setBoards(prev => prev.map(b => b._id === boardId ? data : b));
  }, []);

  const removePinFromBoard = useCallback(async (boardId, pinId) => {
    const { data } = await api.delete(`/boards/${boardId}/pins/${pinId}`);
    setBoards(prev => prev.map(b => b._id === boardId ? data : b));
  }, []);

  const addPlaylistToBoard = useCallback((boardId, playlist) => {
    setBoards(prev => prev.map(b => {
      if (b._id !== boardId) return b;
      const existing = b.playlists || [];
      if (existing.find(p => p.id === playlist.id)) return b;
      return { ...b, playlists: [...existing, playlist] };
    }));
  }, []);

  const fetchPins = useCallback(async () => {
    try {
      const { data } = await api.get("/pins");
      setPins(data);
    } catch (err) { console.error("fetchPins error", err); }
  }, []);

  const createPin = useCallback(async (pinData) => {
    const { data } = await api.post("/pins", pinData);
    setPins(prev => [data, ...prev]);
    return data;
  }, []);

  // ─── Spotify ──────────────────────────────────────────────────────────────

  // Fetch connection status from the server and update local state.
  const refreshSpotifyStatus = useCallback(async () => {
    try {
      const { data } = await api.get("/spotify/status");
      setSpotifyConnected(data.connected);
      return data.connected;
    } catch {
      setSpotifyConnected(false);
      return false;
    }
  }, []);

  // Redirect the browser to Spotify's auth page.
  // We use the full server URL (not /api/...) because this is a browser redirect,
  // not an axios call — Vite's proxy only works for fetch/axios, not window.location.
  const connectSpotify = useCallback(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    // Support both _id (from DB) and userId (alias stored at login)
    const userId = storedUser?._id || storedUser?.userId;
    if (!userId) {
      console.error("connectSpotify: no userId found in localStorage");
      return;
    }
    const serverUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5050";
    window.location.href = `${serverUrl}/api/spotify/login?userId=${userId}`;
  }, []);

  // Fetch the user's Spotify playlists. Returns { items: [...] } or { items: [] }.
  const fetchSpotifyPlaylists = useCallback(async () => {
    try {
      const { data } = await api.get("/spotify/playlists");
      return {
        items: data.map(p => ({
          id: p.id,
          name: p.name,
          tracks: p.tracks?.total || 0,
          image: p.images?.[0]?.url || "https://picsum.photos/id/20/400/400",
        }))
      };
    } catch (err) {
      // A 401 here means "not connected" — not a session expiry.
      // The api.js interceptor won't log us out for Spotify routes.
      console.warn("fetchSpotifyPlaylists:", err.response?.data?.message || err.message);
      return { items: [] };
    }
  }, []);

  // ─── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchPins();
    if (localStorage.getItem("token")) fetchBoards();
  }, [fetchPins, fetchBoards]);

  useEffect(() => {
    if (user) {
      fetchBoards();
      refreshSpotifyStatus();
    } else {
      setBoards([]);
      setSpotifyConnected(false);
    }
  }, [user, fetchBoards, refreshSpotifyStatus]);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      boards, fetchBoards, createBoard, deleteBoard, updateBoard,
      savePinToBoard, removePinFromBoard, addPlaylistToBoard,
      pins, fetchPins, createPin,
      spotifyConnected, setSpotifyConnected, refreshSpotifyStatus,
      connectSpotify, fetchSpotifyPlaylists,
    }}>
      {children}
    </AppContext.Provider>
  );
}
