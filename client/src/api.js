import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear storage and redirect to login — BUT NOT for Spotify routes.
// Spotify playlists return 401 when the user hasn't connected yet; that's a
// normal "not connected" state, not an expired session. Intercepting those 401s
// would log the user out accidentally.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isSpotifyRoute = err.config?.url?.includes('/spotify/');
    if (err.response?.status === 401 && !isSpotifyRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
