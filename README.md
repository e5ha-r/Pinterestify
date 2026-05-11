# 📌 Pinterestify — MERN Stack Pinterest + Spotify App

> A Pinterest-style board app where you can save aesthetic pins and attach Spotify music to your boards.

---

## 🚀 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, React Router v6, Vite     |
| Backend   | Node.js, Express 5                  |
| Database  | MongoDB Atlas (Mongoose ODM)        |
| Auth      | JWT (jsonwebtoken) + bcryptjs       |
| Music API | Spotify Web API (OAuth 2.0)         |

---

## 📁 Project Structure

```
pinterestify/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── PinCard.jsx
│   │   │   ├── PinModal.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── PlaylistCard.jsx
│   │   ├── context/
│   │   │   └── context.jsx # Global state (React Context API)
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── CreateBoard.jsx
│   │   │   ├── CreatePin.jsx
│   │   │   ├── BoardDetail.jsx
│   │   │   └── Profile.jsx
│   │   ├── utils/
│   │   │   └── toast.js    # Lightweight toast notifications
│   │   ├── api.js          # Axios instance with JWT interceptors
│   │   ├── main.jsx        # App entry point with routing
│   │   └── index.css       # Global styles + masonry grid
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                 # Express backend
    ├── models/
    │   ├── User.js         # User schema
    │   ├── Board.js        # Board + embedded pins schema
    │   └── Pin.js          # Global pins feed schema
    ├── routes/
    │   ├── boards.js       # CRUD for boards + pin management
    │   ├── pins.js         # Global pins feed
    │   └── spotify.js      # OAuth + playlists/tracks
    ├── middleware/
    │   └── auth.js         # JWT protect middleware
    ├── index.js            # Express app entry point
    ├── seed.js             # Seed script for pin data
    ├── .env                # Environment variables (DO NOT COMMIT)
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works)
- Spotify Developer account (free)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Edit `server/.env`:

```env
PORT=5050

# MongoDB Atlas — see section below
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/pinterestify?retryWrites=true&w=majority

# JWT secret — change this to something long and random in production
JWT_SECRET=YourSuperSecretKeyHere

# Spotify — see section below
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:5050/api/spotify/callback
```

### 3. Seed the Database

```bash
cd server
node seed.js
```

### 4. Run the App

**Terminal 1 — Backend:**
```bash
cd server
npm run dev        # uses nodemon for auto-reload
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

- Frontend: http://127.0.0.1:5173
- Backend:  http://127.0.0.1:5050

---

## 🍃 MongoDB Atlas — Secure Connection Guide

### Step 1: Create a Free Cluster
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) → **Sign Up / Log In**
2. Create a **Free Shared Cluster** (M0 Sandbox, any region)

### Step 2: Create a Database User
1. Left sidebar → **Database Access** → **Add New Database User**
2. Choose **Password** authentication
3. Set a username and **strong password** (no `@`, `#`, or special URI chars)
4. Role: **Read and write to any database**
5. Click **Add User**

### Step 3: Whitelist Your IP
1. Left sidebar → **Network Access** → **Add IP Address**
2. For development: click **Allow Access From Anywhere** (0.0.0.0/0)
3. For production: add only your server's IP

### Step 4: Get Your Connection String
1. Left sidebar → **Database** → **Connect** on your cluster
2. Choose **Connect your application**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the SRV connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>`, then add the DB name:
   ```
   mongodb+srv://myuser:mypass@cluster0.xxxxxx.mongodb.net/pinterestify?retryWrites=true&w=majority&appName=Pinterestify
   ```

### Why this connection string is secure:
- `mongodb+srv://` — uses DNS SRV records, automatically handles replica sets
- `retryWrites=true` — automatically retries failed write operations
- `w=majority` — confirms write is acknowledged by the majority of replica members (data safety)
- `appName=Pinterestify` — identifies your app in Atlas monitoring logs
- The `.env` file is **never committed** to Git (it's in `.gitignore`)

---

## 🎵 Spotify Integration Setup

### Step 1: Create a Spotify App
1. Go to [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Log in → **Create App**
3. Fill in:
   - **App name**: Pinterestify
   - **App description**: Pinterest + Music
   - **Website**: `http://127.0.0.1:5173`
   - **Redirect URI**: `http://127.0.0.1:5050/api/spotify/callback`

> ⚠️ **CRITICAL**: Spotify does NOT allow `localhost` as a redirect URI.  
> You MUST use the explicit IPv4 address: `http://127.0.0.1:PORT`  
> (or IPv6: `http://[::1]:PORT` — but IPv4 is simpler)

### Step 2: Get Your Credentials
1. In your Spotify app dashboard → **Settings**
2. Copy **Client ID** and **Client Secret**
3. Paste them into `server/.env`

### Step 3: Verify Redirect URI
In Spotify Dashboard → **Edit Settings** → **Redirect URIs**:
```
http://127.0.0.1:5050/api/spotify/callback
```
Click **Add** → **Save**. The URI must match **exactly** (no trailing slash, correct port).

### How It Works (OAuth 2.0 Authorization Code Flow)

```
User clicks "Connect Spotify"
        │
        ▼
GET /api/spotify/login
        │  redirects to Spotify accounts page
        ▼
Spotify Authorization Page (user approves)
        │  sends back ?code=...
        ▼
GET /api/spotify/callback
        │  exchanges code for access + refresh tokens
        │  saves tokens to MongoDB User document
        ▼
Redirects to /dashboard?spotify=connected
        │
        ▼
GET /api/spotify/playlists
        │  uses stored access token
        │  auto-refreshes on 401 using refresh token
        ▼
Returns playlists to frontend
```

### Unsuccessful Integration
Spotify does not give access to it db unless its 25 whitelisted users. 
So we were not able to access the spotify data and get OAUTH. hence we had to use the publicallly available playlists only.

---

## 🌐 Pages & Features

| Route          | Page          | Description                              |
|----------------|---------------|------------------------------------------|
| `/`            | Login         | JWT-based login with validation          |
| `/signup`      | Signup        | User registration                        |
| `/dashboard`   | Dashboard     | Masonry pin feed with search & save      |
| `/explore`     | Explore       | Browse all public boards by category     |
| `/create`      | Create Board  | Create a new board with color picker     |
| `/create-pin`  | Create Pin    | Add a new pin to the global feed         |
| `/board/:id`   | Board Detail  | View pins + attach Spotify playlists     |
| `/profile`     | Profile       | Edit name, pick avatar, view stats       |

---

## 🧠 Architecture (MVC Pattern)

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (View)                       │
│  React Components + Context API (useState/useEffect)     │
│  Axios → /api/* (Vite proxy → Express server)           │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP / JSON
┌─────────────────────▼───────────────────────────────────┐
│                   SERVER (Controller)                    │
│  Express Routes → Middleware (JWT auth) → Route handlers │
└─────────────────────┬───────────────────────────────────┘
                      │ Mongoose ODM
┌─────────────────────▼───────────────────────────────────┐
│                     MODEL (Data)                         │
│  MongoDB Atlas — User, Board (+ embedded pins), Pin      │
└─────────────────────────────────────────────────────────┘
                      │ Spotify Web API
┌─────────────────────▼───────────────────────────────────┐
│                  EXTERNAL API                            │
│  Spotify OAuth 2.0 — playlists, tracks, preview URLs    │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment (Bonus)

### Frontend → Vercel
```bash
cd client
npm run build
# Push to GitHub, connect to Vercel, auto-deploys
```

### Backend → Render
1. Connect your GitHub repo to [render.com](https://render.com)
2. New Web Service → Root directory: `server`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add Environment Variables (from your `.env`) in Render's dashboard

### After deployment:
- Update `server/.env` `SPOTIFY_REDIRECT_URI` to your Render URL
- Update Spotify Dashboard redirect URI to match
- Update CORS `origin` in `server/index.js` to your Vercel URL
- Update Vite proxy in `client/vite.config.js` to your Render URL

---

## 👥 Team Distribution

| Member | Role                                | Key Files |
|--------|-------------------------------------|-----------|
| 1      | UI/UX + Frontend Architecture       | All `.jsx` pages + components, `index.css` |
| 2      | Frontend Logic + API Integration    | `context.jsx`, `api.js`, Dashboard, Explore |
| 3      | Backend Engineer                    | `server/index.js`, all routes, middleware |
| 4      | Database + Spotify Integration      | MongoDB models, `spotify.js` route, seed.js |
