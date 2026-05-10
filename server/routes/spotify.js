import express from 'express';
import axios from 'axios';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ─── helpers ───────────────────────────────────────────────────────────────
const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,   // must be http://127.0.0.1:PORT/api/spotify/callback
} = process.env;

const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
].join(' ');

function basicAuth() {
  return Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
}

async function refreshAccessToken(refreshToken) {
  const { data } = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: refreshToken,
    }),
    { headers: { Authorization: `Basic ${basicAuth()}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return data.access_token;
}

// ─── routes ────────────────────────────────────────────────────────────────

// GET /api/spotify/login  — redirect user to Spotify's auth page
// NOTE: No `protect` middleware here — browser redirects can't send auth headers.
// The client passes userId as a query param instead.
router.get('/login', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'userId query param is required' });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id:     SPOTIFY_CLIENT_ID,
    scope:         SPOTIFY_SCOPES,
    redirect_uri:  SPOTIFY_REDIRECT_URI,
    state:         userId,   // embed userId so we can save tokens after callback
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

// GET /api/spotify/callback — Spotify redirects here after user approves
router.get('/callback', async (req, res) => {
  const { code, state: userId, error } = req.query;
  if (error) return res.redirect(`http://127.0.0.1:5173/dashboard?spotify=error`);

  try {
    // Exchange code for tokens
    const { data } = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type:   'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
      { headers: { Authorization: `Basic ${basicAuth()}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    // Fetch Spotify profile
    const profile = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${data.access_token}` }
    });

    // Persist to DB
    await User.findByIdAndUpdate(userId, {
      spotifyId:      profile.data.id,
      spotifyToken:   data.access_token,
      spotifyRefresh: data.refresh_token,
    });

    // Redirect back to client with success flag
    res.redirect(`${process.env.CLIENT_URL}/dashboard?spotify=connected`);
  } catch (err) {
    console.error('Spotify callback error:', err.message);
    res.redirect(`${process.env.CLIENT_URL}/dashboard?spotify=error`);
  }
});

// GET /api/spotify/playlists — fetch user's Spotify playlists
router.get('/playlists', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user?.spotifyToken) return res.status(401).json({ message: 'Spotify not connected' });

    let token = user.spotifyToken;

    // Try with current token; refresh on 401
    let response;
    try {
      response = await axios.get('https://api.spotify.com/v1/me/playlists?limit=20', {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      if (err.response?.status === 401 && user.spotifyRefresh) {
        token = await refreshAccessToken(user.spotifyRefresh);
        await User.findByIdAndUpdate(req.user, { spotifyToken: token });
        response = await axios.get('https://api.spotify.com/v1/me/playlists?limit=20', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else throw err;
    }

    res.json(response.data.items);
  } catch (err) { next(err); }
});

// GET /api/spotify/playlists/:playlistId/tracks
router.get('/playlists/:playlistId/tracks', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user?.spotifyToken) return res.status(401).json({ message: 'Spotify not connected' });

    let token = user.spotifyToken;
    let response;
    try {
      response = await axios.get(
        `https://api.spotify.com/v1/playlists/${req.params.playlistId}/tracks?limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      if (err.response?.status === 401 && user.spotifyRefresh) {
        token = await refreshAccessToken(user.spotifyRefresh);
        await User.findByIdAndUpdate(req.user, { spotifyToken: token });
        response = await axios.get(
          `https://api.spotify.com/v1/playlists/${req.params.playlistId}/tracks?limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else throw err;
    }

    const tracks = response.data.items
      .filter(item => item.track)
      .map(item => ({
        id:      item.track.id,
        name:    item.track.name,
        artist:  item.track.artists.map(a => a.name).join(', '),
        album:   item.track.album.name,
        image:   item.track.album.images?.[0]?.url || null,
        preview: item.track.preview_url,
      }));
    res.json(tracks);
  } catch (err) { next(err); }
});

// GET /api/spotify/status — is Spotify connected for current user?
router.get('/status', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select('spotifyId spotifyToken');
    res.json({ connected: !!user?.spotifyId, spotifyId: user?.spotifyId || null });
  } catch (err) { next(err); }
});

export default router;
