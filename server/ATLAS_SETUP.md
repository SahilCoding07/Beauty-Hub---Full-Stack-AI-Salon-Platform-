# MongoDB Atlas Setup

Persistent storage for **The Beauty Hub Salon** using MongoDB Atlas.

All data — bookings, services, offers, testimonials, gallery items, and settings — is stored in Atlas and **survives server restarts**.

---

## 1. Create a MongoDB Atlas cluster

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up (free tier is fine).
2. Create a **new project** (e.g. `Beauty Hub Salon`).
3. Build a **free M0 cluster**:
   - Provider: AWS / Google Cloud / Azure (any)
   - Region: closest to your users (e.g. `Mumbai` for India)
   - Cluster name: e.g. `beauty-hub-cluster`

---

## 2. Create a database user

1. Atlas sidebar → **Database Access** → **Add New Database User**
2. Authentication: **Password**
3. Username: e.g. `beautyhub_admin`
4. Password: generate a strong password (save it)
5. Privileges: **Read and write to any database** (or specific `beauty-hub-salon` db)
6. Click **Add User**

---

## 3. Allow network access

1. Atlas sidebar → **Network Access** → **Add IP Address**
2. For local development: **Add Current IP Address**
3. For production hosting (Render/Railway): add that platform's IP or `0.0.0.0/0` (allow from anywhere — use only if you have strong DB credentials)

---

## 4. Get your connection string

1. Atlas → **Database** → **Connect** on your cluster
2. Choose **Drivers** → **Node.js**
3. Copy the connection string, e.g.:

```
mongodb+srv://beautyhub_admin:<password>@beauty-hub-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=beauty-hub-cluster
```

4. Replace `<password>` with your URL-encoded password  
   - `@` → `%40`  
   - `#` → `%23`  
   - `/` → `%2F`

5. Add the database name before the `?`:

```
mongodb+srv://beautyhub_admin:YOUR_PASSWORD@beauty-hub-cluster.xxxxx.mongodb.net/beauty-hub-salon?retryWrites=true&w=majority&appName=beauty-hub-salon
```

---

## 5. Configure the server

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set:

```env
MONGODB_URI=mongodb+srv://beautyhub_admin:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/beauty-hub-salon?retryWrites=true&w=majority&appName=beauty-hub-salon
JWT_SECRET=your-long-random-secret-at-least-32-characters
ADMIN_PASSWORD=your-secure-admin-password
```

---

## 6. Verify connection

```bash
cd server
npm install
npm run db:verify
```

Expected output:

```
✓ MongoDB Atlas connected and validated
✓ MongoDB Atlas is configured correctly. Data will persist across server restarts.
```

---

## 7. Seed initial data (first time only)

```bash
npm run seed
```

This creates services, staff, offers, testimonials, gallery, admin user, and settings.

> **Warning:** `npm run seed` **wipes all existing data** and re-inserts defaults. Only run on a fresh database.

On normal server start, `seedIfEmpty()` runs automatically and only seeds if the database is empty — it does **not** delete existing data.

---

## 8. Start the server

```bash
npm run dev
```

Health check (includes database status):

```
GET http://localhost:5001/api/health
```

```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "host": "beauty-hub-cluster.xxxxx.mongodb.net",
    "name": "beauty-hub-salon",
    "provider": "MongoDB Atlas"
  }
}
```

---

## Production deployment (Render / Railway)

Set these environment variables on your hosting platform:

| Variable | Value |
|----------|--------|
| `MONGODB_URI` | Your Atlas connection string |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Strong random secret (32+ chars) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Strong admin password |
| `CLIENT_URL` | `https://your-frontend-domain.com` |

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Missing required environment variable: MONGODB_URI` | Copy `.env.example` → `.env` and set URI |
| `Could not reach MongoDB Atlas cluster` | Add your IP in Atlas Network Access |
| `authentication failed` | Check username/password; URL-encode special chars in password |
| `hostname could not be resolved` | Verify cluster name in connection string |
| Data lost after restart | You were on in-memory DB — switch to Atlas URI |

---

## What persists in Atlas

| Collection | Persists? |
|------------|-----------|
| Services | ✅ |
| Bookings | ✅ |
| Offers | ✅ |
| Testimonials / Reviews | ✅ |
| Gallery items | ✅ |
| Settings | ✅ |
| Staff | ✅ |
| Admin account | ✅ |
