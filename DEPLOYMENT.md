# Deployment Guide — The Beauty Hub Salon

Step-by-step instructions to deploy the **backend** to [Render](https://render.com) and connect the frontend.

---

## Architecture

```
┌─────────────────┐     HTTPS      ┌──────────────────┐     ┌─────────────────┐
│  Vercel/Netlify │ ──────────────►│  Render (API)    │────►│  MongoDB Atlas  │
│  React frontend │  VITE_API_URL  │  beauty-hub-api  │     │  beauty-hub-salon│
└─────────────────┘                └──────────────────┘     └─────────────────┘
```

**Expected production backend URL format:**

```
https://beauty-hub-api.onrender.com
```

**API base URL (for `VITE_API_URL`):**

```
https://beauty-hub-api.onrender.com/api
```

> Render assigns a URL based on your service name. If you name the service `beauty-hub-api`, the URL is `https://beauty-hub-api.onrender.com`.

---

## Prerequisites

- [ ] MongoDB Atlas cluster running ([ATLAS_SETUP.md](server/ATLAS_SETUP.md))
- [ ] `npm run db:verify` passes locally
- [ ] GitHub repo with `beauty-hub-salon/` project pushed
- [ ] Atlas **Network Access** allows `0.0.0.0/0` (or Render outbound IPs) for production

---

## Part 1 — Deploy backend to Render

### Option A: Blueprint (`render.yaml`)

1. Push this repo to GitHub.
2. Render Dashboard → **New** → **Blueprint**
3. Connect your repository
4. Render detects `render.yaml` at repo root
5. Fill in secret env vars when prompted
6. Click **Apply**

### Option B: Manual Web Service

1. Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository
3. Use these **exact settings**:

| Setting | Value |
|---------|--------|
| **Name** | `beauty-hub-api` |
| **Region** | Singapore (closest to India) or your preference |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | Free (or Starter for always-on) |

4. Add environment variables (see table below)
5. Click **Create Web Service**

---

## Part 2 — Environment variables on Render

Set these in **Render Dashboard → your service → Environment**:

| Variable | Required | Example / Notes |
|----------|----------|-----------------|
| `NODE_ENV` | **Yes** | `production` |
| `MONGODB_URI` | **Yes** | `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/beauty-hub-salon?retryWrites=true&w=majority` |
| `JWT_SECRET` | **Yes** | Random string, **min 32 characters** |
| `CLIENT_URL` | **Yes** | `https://your-frontend.vercel.app` (no trailing slash) |
| `ADMIN_EMAIL` | **Yes** | Owner admin login email |
| `ADMIN_PASSWORD` | **Yes** | Strong password for admin panel |
| `RAZORPAY_KEY_ID` | No | Live key when ready for real payments |
| `RAZORPAY_KEY_SECRET` | No | Live secret when ready for real payments |
| `PORT` | **Auto** | Render sets this automatically — **do not set manually** |

### Generate a JWT secret

```bash
openssl rand -base64 48
```

---

## Part 3 — Verify deployment

After Render finishes deploying (5–10 minutes on free tier):

### 1. Health check

```bash
curl https://beauty-hub-api.onrender.com/api/health
```

**Expected response (200 OK):**

```json
{
  "status": "ok",
  "service": "beauty-hub-api",
  "version": "1.0.0",
  "environment": "production",
  "salon": "The Beauty Hub Salon And Academy",
  "cors": {
    "allowedOrigin": "https://your-frontend.vercel.app"
  },
  "database": {
    "connected": true,
    "host": "cluster0.xxxxx.mongodb.net",
    "name": "beauty-hub-salon",
    "provider": "MongoDB Atlas"
  },
  "storage": {
    "type": "local-filesystem",
    "directory": "uploads/",
    "ephemeral": true,
    "persistent": false,
    "recommendation": "Use Cloudinary or S3 for production image uploads..."
  },
  "timestamp": "2026-..."
}
```

### 2. Root endpoint

```bash
curl https://beauty-hub-api.onrender.com/
```

### 3. Services API

```bash
curl https://beauty-hub-api.onrender.com/api/services
```

### 4. Render health check

Render uses **Health Check Path**: `/api/health`  
Returns **503** if MongoDB is disconnected → Render marks service unhealthy.

---

## Part 4 — CORS configuration

CORS is controlled by `CLIENT_URL` in `server/src/config/cors.ts`.

| Environment | `CLIENT_URL` | Behavior |
|-------------|--------------|----------|
| Development | `http://localhost:5173` | Allows local Vite frontend |
| Production | `https://your-app.vercel.app` | **Only** this origin can call the API |

**After deploying frontend**, update `CLIENT_URL` on Render to match your live frontend URL exactly (no trailing slash).

Multiple origins (optional):

```env
CLIENT_URL=https://app.example.com,https://www.example.com
```

---

## Part 5 — Uploads directory limitations

### How uploads work today

- Images uploaded via admin are saved to `server/uploads/`
- Served at `https://beauty-hub-api.onrender.com/uploads/filename`
- Directory is **auto-created** on server startup

### Render limitation (critical)

| Platform | Upload persistence |
|----------|-------------------|
| **Local dev** | Files persist on your machine |
| **Render free/starter** | **Ephemeral disk** — uploads are **lost** on redeploy, restart, or crash |
| **Render persistent disk** | Paid add-on — survives restarts within same instance |

The health endpoint reports this:

```json
"storage": {
  "ephemeral": true,
  "recommendation": "Use Cloudinary or S3 for production image uploads."
}
```

### Recommendation

For production, migrate image uploads to **Cloudinary** or **AWS S3** (Phase 2). Until then, use **image URLs** (Unsplash or external links) for services and gallery.

---

## Part 6 — Deploy frontend (after backend is live)

1. Note your Render API URL: `https://beauty-hub-api.onrender.com`
2. In Vercel/Netlify, set build env:

```env
VITE_API_URL=https://beauty-hub-api.onrender.com/api
```

3. Deploy `client/` folder
4. Copy your frontend URL (e.g. `https://the-beauty-hub.vercel.app`)
5. **Update Render** `CLIENT_URL` to that frontend URL
6. Render auto-redeploys → CORS now allows your frontend

---

## Part 7 — MongoDB Atlas for production

1. Atlas → **Network Access** → Add `0.0.0.0/0` (allow from anywhere)  
   *Or restrict to Render IPs if you have a paid plan with static egress.*
2. Confirm database name in URI: `/beauty-hub-salon`
3. First deploy auto-seeds empty database via `seedIfEmpty()`
4. To force full re-seed (⚠️ wipes data): run `npm run seed` locally pointed at Atlas

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Deploy fails at build | Check Render logs; run `npm run build` locally in `server/` |
| Health returns 503 | MongoDB unreachable — check Atlas IP whitelist and `MONGODB_URI` |
| CORS error in browser | `CLIENT_URL` must exactly match frontend URL |
| 502 on free tier | Service spun down — first request takes ~30s (cold start) |
| Admin login fails | Verify `ADMIN_EMAIL` / `ADMIN_PASSWORD` on Render |
| Uploads disappear | Expected on Render — use Cloudinary (Phase 2) |

---

## Local production simulation

Test production build locally before deploying:

```bash
cd server
npm run build
NODE_ENV=production \
  MONGODB_URI="your-atlas-uri" \
  JWT_SECRET="your-32-char-minimum-secret-key-here" \
  CLIENT_URL="http://localhost:5173" \
  ADMIN_EMAIL="admin@example.com" \
  ADMIN_PASSWORD="your-password" \
  npm start
```

Then:

```bash
curl http://localhost:5001/api/health
```

---

## Checklist before go-live

- [ ] `GET /api/health` returns 200 on Render
- [ ] `database.connected` is `true`
- [ ] `cors.allowedOrigin` matches frontend URL
- [ ] `CLIENT_URL` updated after frontend deploy
- [ ] `JWT_SECRET` is 32+ random characters
- [ ] `ADMIN_PASSWORD` changed from default
- [ ] Atlas Network Access allows Render
- [ ] `VITE_API_URL` set on frontend hosting
- [ ] Razorpay keys added (when ready for live payments)

---

## File reference

| File | Purpose |
|------|---------|
| `render.yaml` | Render Blueprint (auto-config) |
| `server/.env.example` | Local env template |
| `server/src/config/env.ts` | Production env validation |
| `server/src/config/cors.ts` | CORS from `CLIENT_URL` |
| `server/src/config/database.ts` | Atlas connection |
| `server/src/utils/uploads.ts` | Uploads dir + ephemeral warning |
| `server/ATLAS_SETUP.md` | MongoDB Atlas setup |
