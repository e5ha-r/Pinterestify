import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import Models
import User from './models/User.js';

// Import Routes
import boardsRoutes  from './routes/boards.js';
import pinsRoutes    from './routes/pins.js';
import spotifyRoutes from './routes/spotify.js';

dotenv.config();

const app = express();

// --- 1. MIDDLEWARE SETUP ---
app.use(cors({
    origin: [
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://pinterestify-frontend-production-d7ce.up.railway.app",
        process.env.FRONTEND_URL || ""
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-spotify-token"]
}));

app.use(express.json());

// 🛡️ GLOBAL REQUEST LOGGER
app.use((req, res, next) => {
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = "********";
    console.log(`📩 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`, logBody);
    next();
});

// --- 2. DATABASE CONNECTION ---
// Connects to MongoDB Atlas but doesn't block server startup
let dbConnected = false;

if (!process.env.MONGO_URI) {
    console.warn("⚠️  WARNING: MONGO_URI not set in environment variables!");
    console.warn("📌 Add MONGO_URI to Railway variables for database functionality");
} else {
    mongoose.connect(process.env.MONGO_URI, {
        retryWrites: true,
        w: 'majority',
        serverSelectionTimeoutMS: 5000,
    })
        .then(() => {
            dbConnected = true;
            console.log("✅ MongoDB Atlas Connected Successfully");
        })
        .catch((err) => {
            dbConnected = false;
            console.error("❌ MongoDB Connection Error:", err.message);
            console.error("📌 Check your MONGO_URI in Railway variables");
            // Don't block server startup, but log the error
        });
}

// --- 3. ROUTES ---

// Health Check - this should work even if DB isn't connected
app.get('/test', (req, res) => {
    res.json({ 
        status: "🚀 Server alive", 
        time: new Date().toISOString(),
        database: dbConnected ? "✅ Connected" : "⚠️ Not connected"
    });
});

// Root route - needed for Railway health checks
app.get('/', (req, res) => {
    res.json({ 
        message: "Pinterestify API Server", 
        status: "running",
        database: dbConnected ? "✅ Connected" : "⚠️ Not connected"
    });
});

// AUTH ROUTES
app.post('/api/auth/signup', async (req, res, next) => {
    try {
        if (!dbConnected) {
            return res.status(503).json({ error: "Database not available" });
        }

        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ error: "Please fill all fields" });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const pfp = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(username)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
        const user = new User({ username, email, password: hashedPassword, pfp });
        await user.save();

        console.log(`👤 New User Created: ${username} (${email})`);
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Signup Error:", err.message);
        next(err);
    }
});

app.post('/api/auth/login', async (req, res, next) => {
    try {
        if (!dbConnected) {
            return res.status(503).json({ error: "Database not available" });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '7d' }
            );
            console.log(`🔑 Login Successful: ${email}`);
            res.json({
                token,
                _id:      user._id,
                userId:   user._id,
                name:     user.username,
                username: user.username,
                email:    user.email,
                pfp:      user.pfp,
            });
        } else {
            console.log(`⚠️ Failed Login: ${email}`);
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) { 
        console.error("Login Error:", err.message);
        next(err); 
    }
});

// MODULAR ROUTES
app.use('/api/boards',  boardsRoutes);
app.use('/api/pins',    pinsRoutes);
app.use('/api/spotify', spotifyRoutes);

// --- 4. 404 HANDLER ---
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// --- 5. ERROR HANDLING MIDDLEWARE ---
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err.stack || err.message);
    const status = err.status || 500;
    res.status(status).json({ 
        error: { 
            message: err.message || "Internal Server Error", 
            status,
            timestamp: new Date().toISOString()
        } 
    });
});

// --- 6. START SERVER ---
const PORT = process.env.PORT || 5050;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📌 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base URL: http://0.0.0.0:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing gracefully...');
    mongoose.connection.close();
    process.exit(0);
});
