# 📌 Pinterestify — Visual Board + Music Integration Platform

> A full-stack Pinterest-inspired web application enhanced with Spotify integration, enabling users to create aesthetic visual boards and attach music playlists to enrich the browsing experience.
>
> Login Page:
           <img width="779" height="723" alt="image" src="https://github.com/user-attachments/assets/e193a8ac-0584-4d53-adf5-8d548b6b3898" />

Home Page:
          <img width="910" height="901" alt="image" src="https://github.com/user-attachments/assets/d8eaf95b-3266-4e9b-9980-3086d56de838" />

The Board created and Songs Selection:
           <img width="882" height="877" alt="image" src="https://github.com/user-attachments/assets/9a1977c0-168b-47c0-9c7a-4c288fd6b26d" />


![License](https://img.shields.io/badge/license-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

---

## 🌐 Live Deployment

| Environment | URL |
|-------------|-----|
| **Frontend** | [https://pinterestify.vercel.app](https://pinterestify.vercel.app) |
| **Backend** | [pinterestify-production.up.railway.app](https://pinterestify-production.up.railway.app/)

## 🧠 Project Motivation

Pinterestify merges **visual inspiration** with **music-driven emotion mapping** in a single platform. While traditional Pinterest-style platforms focus solely on images, Pinterestify enhances the experience by allowing users to associate **Spotify playlists** with boards, creating a **multi-sensory digital experience**.

### Why Build This?
- 🎨 **Aesthetic Experience**: Combine visual content with curated music
- 🔗 **Integrated Ecosystem**: Single platform for mood boards + playlists
- 🛠️ **Full-Stack Showcase**: Complete engineering workflow demonstration
- 🌍 **Third-Party Integration**: Real-world OAuth and API integration patterns

### Key Learning Outcomes
This project demonstrates:
- ✅ Secure authentication & authorization systems
- ✅ REST API architecture & best practices
- ✅ Database design with MongoDB & Mongoose ODM
- ✅ Third-party OAuth integration (Spotify Web API)
- ✅ Cloud deployment strategies (Railway & Vercel)
- ✅ Containerization with Docker
- ✅ React state management with Context API
- ✅ Frontend optimization with Vite

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, Vite, React Router | Client-side UI & routing |
| **Backend** | Node.js, Express.js | Server & REST API |
| **Database** | MongoDB Atlas, Mongoose | Data persistence |
| **Auth** | JWT, bcryptjs | Secure authentication |
| **Music** | Spotify Web API (OAuth 2.0) | Music integration |
| **Deployment** | Railway, Vercel | Production hosting |
| **Containerization** | Docker | Backend portability |

---

## 📁 Project Structure

```
Pinterestify/
├── client/                          # 🎨 React Frontend (Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Board.jsx
│   │   │   ├── PinCard.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── ...
│   │   ├── pages/                   # Application pages
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── BoardDetail.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/                 # Global state
│   │   │   ├── AuthContext.js
│   │   │   └── BoardContext.js
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── styles/                  # CSS modules / Tailwind
│   │   ├── api.js                   # Axios API client
│   │   ├── App.jsx                  # Root component
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # ⚙️ Express Backend
│   ├── models/                      # MongoDB Schemas
│   │   ├── User.js                  # User schema
│   │   ├── Board.js                 # Board schema
│   │   ├── Pin.js                   # Pin schema
│   │   └── index.js
│   ├── routes/                      # API Endpoints
│   │   ├── auth.js                  # Authentication routes
│   │   ├── boards.js                # Board management
│   │   ├── pins.js                  # Pin management
│   │   ├── users.js                 # User profile
│   │   └── spotify.js               # Spotify integration
│   ├── middleware/                  # Express Middleware
│   │   ├── auth.js                  # JWT verification
│   │   ├── errorHandler.js          # Error handling
│   │   └── validator.js             # Input validation
│   ├── controllers/                 # Business logic
│   ├── utils/                       # Helper functions
│   ├── index.js                     # Server entry point
│   ├── seed.js                      # Database seeding
│   ├── Dockerfile                   # Container config
│   ├── .env.example                 # Environment template
│   └── package.json
│
├── .github/
│   └── workflows/                   # CI/CD pipelines
│
├── docker-compose.yml               # Multi-container orchestration
├── .gitignore
└── README.md
```

---

## ⚙️ Core Features

### 🔐 Authentication System
- ✅ **Secure Registration & Login**: Email-based user accounts
- ✅ **Password Hashing**: bcryptjs with salt rounds
- ✅ **JWT Tokens**: Secure token-based authentication
- ✅ **Token Persistence**: LocalStorage with refresh token mechanism
- ✅ **Protected Routes**: Middleware-based route protection
- ✅ **OAuth Integration**: Optional Spotify OAuth login

### 📌 Board Management System
- ✅ **Create/Update/Delete**: Full CRUD operations for boards
- ✅ **Board Visibility**: Public and private board settings
- ✅ **Board Categories**: Organize by Music, Aesthetic, Food, Art, etc.
- ✅ **Collaborative Features**: Share boards with other users
- ✅ **Board Metadata**: Description, cover image, timestamps

### 🎵 Spotify Integration
- ✅ **OAuth 2.0 Login**: Secure Spotify account connection
- ✅ **Playlist Attachment**: Link playlists to boards
- ✅ **Embedded Playback**: In-app music player
- ✅ **Playlist Metadata**: Artist, duration, cover art
- ✅ **Fallback System**: Works without OAuth in dev mode

### 🖼️ Pin System
- ✅ **Global Pin Feed**: Discover pins from all users
- ✅ **Pin Creation**: Upload and organize images
- ✅ **Pin Metadata**: Title, description, source links
- ✅ **Pin Categorization**: Tag-based organization
- ✅ **Like/Save**: Engagement and bookmarking

### 🧭 Explore System
- ✅ **Browse Public Boards**: Discover community creations
- ✅ **Category Filtering**: Filter by Music, Aesthetic, etc.
- ✅ **Search Functionality**: Find boards and pins
- ✅ **Popular/Trending**: Algorithmic content ranking
- ✅ **User Recommendations**: Personalized suggestions

### 👤 User Profile System
- ✅ **Profile Customization**: Display name and avatar
- ✅ **User Statistics**: Board count, pin count, followers
- ✅ **User Boards Gallery**: Browse user's public boards
- ✅ **Follow System**: Connect with other users
- ✅ **Account Settings**: Privacy and notification preferences

---

## 🧠 System Architecture

```
┌─────────────────────┐
│   React Frontend    │
│  (Vite + Router)    │
└──────────┬──────────┘
           │ HTTP/REST
           ▼
┌─────────────────────┐
│  Express Backend    │
│  (JWT Middleware)   │
└──────────┬──────────┘
           │ Mongoose ODM
           ▼
┌─────────────────────┐
│  MongoDB Atlas      │
│  (Data Storage)     │
└─────────────────────┘

Spotify Web API
      ▲
      │ OAuth 2.0
      │
      └── Backend ──▶ Token Management
```

### Data Flow
1. **Frontend** sends API requests with JWT token
2. **Backend** validates JWT token via middleware
3. **Backend** processes business logic & database queries
4. **Database** persists & retrieves data
5. **Spotify API** enriches music data (optional)
6. **Response** returns to frontend

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ & npm/yarn
- MongoDB Atlas account (free tier available)
- Spotify Developer account (for OAuth)
- Git

### Local Setup

#### 1️⃣ Clone Repository
```bash
git clone https://github.com/e5ha-r/Pinterestify.git
cd Pinterestify
```

#### 2️⃣ Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
NODE_ENV=development
PORT=8000

# Start backend
npm start
# or npm run dev (for development with nodemon)
```

#### 3️⃣ Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# Start development server
npm run dev
```

#### 4️⃣ Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "displayName": "John Doe"
}

Response: { token: "jwt_token", user: {...} }
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: { token: "jwt_token", user: {...} }
```

### Board Endpoints

```http
GET /api/boards
Authorization: Bearer <token>
Response: [{ _id, title, description, pins: [...], ... }, ...]

GET /api/boards/:id
Response: { _id, title, description, pins, owner, ... }

POST /api/boards
Authorization: Bearer <token>
Content-Type: application/json
{ "title": "My Board", "description": "...", "category": "Music" }

PUT /api/boards/:id
Authorization: Bearer <token>
{ "title": "Updated Board", ... }

DELETE /api/boards/:id
Authorization: Bearer <token>
```

### Pin Endpoints

```http
GET /api/pins
Response: [{ _id, title, imageUrl, boardId, ... }, ...]

POST /api/pins
Authorization: Bearer <token>
{ "title": "My Pin", "imageUrl": "...", "boardId": "..." }

DELETE /api/pins/:id
Authorization: Bearer <token>
```

---

## 🐳 Deployment Guide

### Local Development with Docker

```bash
# Build image
docker build -t pinterestify:dev -f server/Dockerfile .

# Run container with environment
docker run -p 8000:8000 \
  -e MONGO_URI=your_uri \
  -e JWT_SECRET=your_secret \
  pinterestify:dev

# Or use docker-compose
docker-compose up -d
```

### Railway Deployment (Backend)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your Pinterestify repository

3. **Configure Environment Variables**
   ```
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   SPOTIFY_CLIENT_ID=your_spotify_id
   SPOTIFY_CLIENT_SECRET=your_spotify_secret
   NODE_ENV=production
   ```

4. **Railway Automatically**
   - Builds Docker image
   - Installs dependencies
   - Runs backend server
   - Provides public URL

### Vercel Deployment (Frontend)

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select GitHub repository

2. **Configure Project Settings**
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Add Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-railway-backend-url
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically deploys on push to main

---

## 🔒 Environment Variables Reference

### Backend (.env)
```env
# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your_super_secret_key_min_32_characters_long

# Spotify OAuth
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:8000/api/auth/spotify/callback

# Server
PORT=8000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Pinterestify
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd server
npm test
```

### Run Frontend Tests
```bash
cd client
npm test
```

### E2E Testing
```bash
npm run test:e2e
```

---

## ⚠️ Known Limitations & Workarounds

### 🎵 Spotify OAuth Restrictions
- **Issue**: Spotify OAuth is restricted in development mode (25-user limit for unverified apps)
- **Impact**: Full OAuth integration may not be accessible publicly until app is verified
- **Workaround**: Use embedded playlist playback or Spotify Web API with API keys


### 🔄 Real-time Updates
- No WebSocket support for collaborative editing (future feature)

---

## 🚀 Future Improvements

### Phase 2 (Q3 2026)
- [ ] Real-time collaborative boards (WebSockets/Socket.io)
- [ ] Advanced search & filtering system
- [ ] Pin comments and discussions
- [ ] Board sharing with granular permissions

### Phase 3 (Q4 2026)
- [ ] AI-based content recommendation
- [ ] Cloud image uploads (Cloudinary)
- [ ] Mobile-first PWA version
- [ ] Drag-and-drop board organization

### Phase 4 (2027)
- [ ] Advanced analytics dashboard
- [ ] Notification system
- [ ] Social features (messaging, notifications)
- [ ] API rate limiting & usage analytics

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Include tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---


## 🙏 Acknowledgments

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for reliable database
- [Vercel](https://vercel.com) & [Railway](https://railway.app) for deployment platforms
- [React](https://react.dev) & [Vite](https://vitejs.dev) communities


**Made with ❤️ by e5ha-r | Last Updated: May 2026**
