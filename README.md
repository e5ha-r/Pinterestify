📌 Pinterestify — Visual Board + Music Integration Platform

A full-stack Pinterest-inspired web application enhanced with Spotify integration, enabling users to create aesthetic visual boards and attach music playlists to enrich the browsing experience.

🚀 Live Deployment
🌐 Frontend (Vercel): https://pinterestify.vercel.app
⚙️ Backend (Railway): Add your Railway backend link here
🧠 Project Motivation

Pinterestify was designed to merge visual inspiration with music-driven emotion mapping in a single platform.

While traditional Pinterest-style platforms focus solely on images, Pinterestify enhances the experience by allowing users to associate Spotify playlists with boards, creating a multi-sensory digital scrapbook.

This project also demonstrates a complete full-stack engineering workflow, including:

Secure authentication systems
REST API architecture
Database design with MongoDB
Third-party OAuth integration (Spotify)
Cloud deployment using Railway and Vercel
Dockerized backend for portability and scalability
🛠️ Tech Stack
Layer	Technology
Frontend	React 18, Vite, React Router
Backend	Node.js, Express.js
Database	MongoDB Atlas (Mongoose ODM)
Authentication	JWT, bcryptjs
Music API	Spotify Web API (OAuth 2.0)
Deployment	Railway (Backend), Vercel (Frontend)
Containerization	Docker
📁 Project Structure
Pinterestify/
├── client/                  # React Frontend (Vite)
│   ├── components/          # Reusable UI components
│   ├── pages/               # Application pages
│   ├── context/             # Global state (React Context API)
│   └── api.js               # Axios configuration
│
├── server/                  # Express Backend
│   ├── models/              # MongoDB schemas (User, Board, Pin)
│   ├── routes/             # API endpoints
│   ├── middleware/         # JWT authentication middleware
│   ├── index.js            # Server entry point
│   └── seed.js             # Database seeding script
│
├── Dockerfile              # Backend container configuration
└── README.md
⚙️ Core Features
🔐 Authentication System
Secure user registration and login
Password hashing using bcryptjs
JWT-based authentication with token persistence
📌 Board Management System
Create, update, and delete boards
Public and private board visibility
Save and organize pins within boards
🎵 Spotify Integration
OAuth 2.0 login flow with Spotify
Attach playlists to boards
Embedded music playback experience
🖼️ Pin System
Global pin feed accessible to all users
Category-based organization
Image-based content with metadata support
🧭 Explore System
Browse public boards created by users
Filter boards by categories (Music, Aesthetic, Food, Art, etc.)
👤 User Profile System
Editable display name
Avatar selection system
User statistics (boards + pins)
🧠 System Architecture
React Frontend → Express API → MongoDB Atlas
                         ↓
                 Spotify Web API
Frontend communicates via REST API calls
Backend handles authentication, business logic, and database operations
Spotify API provides external music integration
📸 Screenshots

Add screenshots inside a /screenshots folder in your repository.

🔐 Login Page

🏠 Dashboard

🧭 Explore Page

🎨 Create Board

📌 Board Detail Page

👤 Profile Page

🚀 Deployment Guide
🐳 Docker (Local / Railway Compatible)
# Build Docker image
docker build -t pinterestify .

# Run container
docker run -p 8000:8000 pinterestify
☁️ Railway Deployment (Backend)
Push project to GitHub
Go to https://railway.app
Create new project → Deploy from GitHub repo
Select repository

Add environment variables:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
SPOTIFY_CLIENT_ID=your_id
SPOTIFY_CLIENT_SECRET=your_secret
Railway will automatically:
Build Dockerfile
Install dependencies
Run backend server
🌐 Frontend Deployment (Vercel)
Connect GitHub repo to Vercel
Select /client as root directory

Add environment variable:

VITE_API_BASE_URL=https://your-railway-backend-url
Deploy automatically
⚠️ Known Limitation
Spotify OAuth is restricted in development mode (25-user limit for unverified apps)
Due to this restriction, full OAuth integration may not be accessible publicly
Fallback implementation uses embedded playlist playback
🧪 Future Improvements
Real-time collaborative boards (WebSockets)
AI-based content recommendation system
Cloud image uploads (Cloudinary integration)
Mobile-first PWA version
Drag-and-drop board organization
Advanced search and tagging system
