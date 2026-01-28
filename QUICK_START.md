# Quick Start: Complete Cloudflare Setup

## Current Status ✅

Already completed:
- ✅ Wrangler CLI installed
- ✅ Logged into Cloudflare
- ✅ Worker dependencies installed
- ✅ D1 database created: `friends-radar-db`
- ✅ Database schema initialized
- ✅ Database ID configured in wrangler.toml

## Next Steps (Do These Now)

### 1. Register Workers.dev Subdomain

**Go to this URL:**
👉 https://dash.cloudflare.com/7995d9385ba34b6f85cd8dd0ba0b1044/workers/onboarding

**Choose a subdomain** (e.g., `oliver`, `om123`, `meier`, etc.)
- Your subdomain will be: `yourname.workers.dev`
- Your API will be at: `https://friends-radar-api.yourname.workers.dev`

### 2. Deploy the Worker

After registering your subdomain, run:

```bash
./deploy-worker.sh
```

Or manually:
```bash
cd worker
wrangler deploy
```

**Look for the output:**
```
Published friends-radar-api (X.XX sec)
  https://friends-radar-api.YOUR-SUBDOMAIN.workers.dev
```

**Copy that URL!** ☝️

### 3. Configure Frontend

Create or update `.env` file in project root:

```bash
# Google OAuth (you already have this)
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Cloudflare Worker URL (paste your URL here)
VITE_API_URL=https://friends-radar-api.YOUR-SUBDOMAIN.workers.dev
```

### 4. Restart Dev Server

```bash
npm run dev
```

### 5. Test Cross-Device Sync!

1. Add a friend on your computer
2. Check the sync indicator (top-right corner)
3. Open app on your phone or another browser
4. Sign in with same Google account
5. Friend should appear within 5 seconds! 🎉

## Verification

### Check Worker Status

```bash
cd worker
wrangler deployments list
```

### Test API Manually

```bash
# Replace YOUR_USER_ID with your Google user ID
curl https://friends-radar-api.YOUR-SUBDOMAIN.workers.dev/api/friends \
  -H "Authorization: Bearer YOUR_USER_ID"
```

### View Worker Logs (Real-time)

```bash
cd worker
wrangler tail
```

Then use the app - you'll see all API calls in real-time!

### Query Database

```bash
cd worker
wrangler d1 execute friends-radar-db \
  --command "SELECT * FROM friends" \
  --remote
```

## Troubleshooting

### "You need to register a subdomain"

- Go to the onboarding link above
- Choose any available subdomain
- Then run `wrangler deploy` again

### "Permission denied" or "Unauthorized"

- Make sure you're logged in: `wrangler whoami`
- Re-login if needed: `wrangler login`

### Worker deploys but app doesn't sync

1. Check `.env` has correct `VITE_API_URL`
2. Restart dev server (`npm run dev`)
3. Check browser console for errors
4. Check sync indicator for error messages

### CORS errors in browser

The worker includes CORS headers automatically. If you see errors:
1. Hard refresh browser (Cmd+Shift+R)
2. Check worker is deployed: `wrangler deployments list`
3. Check worker logs: `wrangler tail`

## What You'll See

After setup completes:

**Top-right corner:**
```
[Avatar] Oliver Meier  [✓ Synced]  [Sign Out]
```

**Sync statuses:**
- **✓ Synced** (green) - All data saved to Cloudflare
- **🔄 Syncing...** (orange) - Currently syncing
- **⚠️ Offline** (orange) - No internet connection
- **❌ Error** (red) - Sync failed

## Ready to Deploy?

Once you register your subdomain, just run:

```bash
./deploy-worker.sh
```

This will guide you through the remaining steps!

## Need Help?

Full documentation: `CLOUDFLARE_SETUP.md`
