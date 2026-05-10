import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [boards, setBoards] = useState([]);
  const [pins,   setPins]   = useState([]);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData?.token) localStorage.setItem("token", userData.token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setBoards([]);
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

  // Spotify helpers

  // FIX: Pass userId as a query param so the server knows who is connecting.
  // We use the full server URL (not /api/...) because this is a browser redirect,
  // not an axios call — Vite's proxy only works for fetch/axios, not window.location.
  const connectSpotify = useCallback(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?._id || storedUser?.userId;
    if (!userId) {
      console.error("connectSpotify: no userId found in localStorage");
      return;
    }
    window.location.href = `${import.meta.env.VITE_API_URL}/api/spotify/login?userId=${userId}`;
  }, []);

  // FIX: No token argument needed — the JWT interceptor in api.js handles auth automatically.
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
    } catch { return { items: [] }; }
  }, []);

  useEffect(() => {
    fetchPins();
    if (localStorage.getItem("token")) fetchBoards();
  }, [fetchPins, fetchBoards]);

  useEffect(() => {
    if (user) fetchBoards();
    else setBoards([]);
  }, [user, fetchBoards]);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      boards, fetchBoards, createBoard, deleteBoard, updateBoard,
      savePinToBoard, removePinFromBoard, addPlaylistToBoard,
      pins, fetchPins, createPin,
      connectSpotify, fetchSpotifyPlaylists,
    }}>
      {children}
    </AppContext.Provider>
  );
}