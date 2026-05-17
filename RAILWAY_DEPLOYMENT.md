# 🚀 Railway Deployment Guide for Pinterestify

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR APPLICATION                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (React + Vite)      Backend (Express)    Database  │
│  ────────────────────────      ─────────────────    ────────  │
│                                                               │
│  Vercel                    Railway                MongoDB Atlas│
│  https://pinterestify-     https://your-railway- mongodb+srv: │
│  3l0opnrv5-e5ha-rs-        app.up.railway.app    //user:pass  │
│  projects.vercel.app       :8000                 @cluster     │
│                                                               │
│  - Build: npm run build    - Build: Docker       - Cloud      │
│  - Deploy: Auto on push    - Deploy: Git push    - No setup   │
│  - Env vars: VITE_API_URL  - Env vars: See below             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Pre-Deployment Checklist

- [ ] `server/index.js` has `process.env.PORT || 8000`
- [ ] `server/index.js` CORS includes your Vercel URL
- [ ] `Dockerfile` is in repository root
- [ ] `server/package.json` has correct start script
- [ ] MongoDB Atlas URI is ready
- [ ] JWT_SECRET is generated
- [ ] Code is pushed to GitHub (`master` branch)

---

## 📋 Step-by-Step Deployment

### Step 1: Push All Changes to GitHub

```bash
git add .
git commit -m "chore: Add Railway deployment config"
git push origin master
```

Verify push: https://github.com/e5ha-r/Pinterestify

---

### Step 2: Create Railway Project

1. Go to **https://railway.app**
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize GitHub access (if needed)
5. Select **`e5ha-r/Pinterestify`**
6. Railway auto-detects Dockerfile ✅

---

### Step 3: Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pinterestify?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here_min_32_chars
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://your-railway-app.up.railway.app/api/spotify/callback
NODE_ENV=production
```

**How to find your values:**
- `MONGO_URI`: MongoDB Atlas → Clusters → Connect → Connection String
- `JWT_SECRET`: Generate random: `openssl rand -base64 32`
- `SPOTIFY_*`: Spotify Developer Dashboard → Your App → Settings

---

### Step 4: Railway Deploys Automatically

Railway will:
1. ✅ Detect Dockerfile
2. ✅ Build Docker image
3. ✅ Install dependencies from `package.json`
4. ✅ Start server with `npm start`
5. ✅ Assign public URL (e.g., `https://pinterestify-production.up.railway.app`)

Check logs in Railway dashboard for any errors.

---

### Step 5: Update Frontend Environment Variables

Go to **Vercel Dashboard** → Your Pinterestify Project:

1. Click **Settings** → **Environment Variables**
2. Add/Update:
   ```
   VITE_API_URL=https://your-railway-app.up.railway.app
   ```
3. Click **"Save"**
4. Trigger redeploy:
   - Push to GitHub, OR
   - Click **"Redeploy"** in Vercel dashboard

---

## 🧪 Testing Your Deployment

### Test Backend is Running
```bash
curl https://your-railway-app.up.railway.app/test
```

Expected response:
```json
{
  "status": "🚀 Server alive",
  "time": "2026-05-17T08:30:00.000Z"
}
```

### Test Frontend Connects to Backend
1. Visit your Vercel URL
2. Try to **Sign Up** or **Login**
3. Should work without CORS errors
4. Check browser console for errors (F12 → Console tab)

### Test Database Connection
1. Sign up a new user
2. Check MongoDB Atlas → Collections → `users`
3. New user document should appear

---

## 🐛 Common Issues & Fixes

### ❌ Problem: 502 Bad Gateway
**Cause:** Backend not running or PORT not configured

**Fix:**
1. Check Railway logs for errors
2. Verify `process.env.PORT || 8000` in `server/index.js`
3. Restart app in Railway dashboard

---

### ❌ Problem: CORS Error in Frontend
**Cause:** Frontend URL not in CORS origin list

**Fix:**
1. Get your exact Vercel URL from Vercel dashboard
2. Add to `server/index.js` CORS:
   ```javascript
   app.use(cors({
       origin: [
           "https://your-vercel-url.vercel.app",
           "http://localhost:5173"
       ]
   }));
   ```
3. Redeploy backend

---

### ❌ Problem: MongoDB Connection Error
**Cause:** Wrong connection string or IP whitelist issue

**Fix:**
1. Verify `MONGO_URI` format in Railway variables
2. In MongoDB Atlas → Network Access → Add IP Address `0.0.0.0/0`
3. Or use: `mongodb+srv://user:pass@cluster/db?retryWrites=true&w=majority`

---

### ❌ Problem: Spotify OAuth Not Working
**Cause:** Redirect URI mismatch

**Fix:**
1. Get your Railway URL from dashboard
2. In Spotify Developer Dashboard → Your App → Settings
3. Update Redirect URIs to: `https://your-railway-app.up.railway.app/api/spotify/callback`
4. Update `SPOTIFY_REDIRECT_URI` in Railway variables

---

## 📊 Monitoring Your App

### Check Logs
- Railway dashboard → Logs tab
- Shows all console.log output from server

### Check Metrics
- Railway dashboard → Metrics tab
- Shows CPU, Memory, Network usage

### Check Deployments
- Railway dashboard → Deployments tab
- See all deployment history with timestamps

---

## 🔐 Security Best Practices

✅ **DO:**
- Use environment variables for secrets
- Don't commit `.env` files
- Use strong JWT_SECRET (min 32 chars)
- Enable MongoDB IP whitelist (allow Railway IPs)
- Use HTTPS URLs only

❌ **DON'T:**
- Hardcode secrets in code
- Use `localhost` in production CORS
- Share your JWT_SECRET
- Expose MongoDB credentials in logs

---

## 🚀 What's Next?

After successful deployment:

1. **Add Features**
   - API rate limiting
   - Request logging
   - Health check endpoint
   - Error tracking (Sentry)

2. **Monitor Performance**
   - Set up uptime monitoring
   - Configure alerts
   - Track API response times

3. **Scale Up**
   - Add caching layer (Redis)
   - Database indexing
   - CDN for static assets

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Docs:** https://docs.mongodb.com
- **Express Docs:** https://expressjs.com

---

**Your app is production-ready! 🎉**
