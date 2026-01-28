# Cloudflare Setup for Cross-Device Sync

Friends Radar now uses Cloudflare Workers + D1 for cross-device synchronization!

## Why Cloudflare?

- **Serverless**: No servers to manage
- **Fast**: Runs on Cloudflare's global edge network
- **Free Tier**: Generous limits for personal projects
- **Simple**: Easy setup with Wrangler CLI
- **D1 Database**: Built-in SQLite database

## Prerequisites

- Cloudflare account (free tier works great!)
- Node.js installed
- npm or yarn

## Setup Steps

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

### 3. Create D1 Database

```bash
cd worker
npm install
npm run db:create
```

This creates a new D1 database. Copy the `database_id` from the output.

### 4. Update wrangler.toml

Edit `worker/wrangler.toml` and add the `database_id`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "friends-radar-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Paste the ID from step 3
```

### 5. Initialize Database Schema

```bash
npm run db:init
```

This creates the `friends` table in your D1 database.

### 6. Deploy the Worker

```bash
npm run deploy
```

This deploys your API to Cloudflare. Copy the worker URL from the output (e.g., `https://friends-radar-api.your-subdomain.workers.dev`).

### 7. Configure Frontend

Update your `.env` file in the project root:

```bash
# Google OAuth (you already have this)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Cloudflare Worker URL
VITE_API_URL=https://friends-radar-api.your-subdomain.workers.dev
```

### 8. Test Cross-Device Sync

1. Restart your dev server: `npm run dev`
2. Add a friend on your computer
3. Open the app on your phone or another browser
4. Sign in with the same Google account
5. Your friends should sync within 5 seconds!

## Development

### Local Development

Run the worker locally:

```bash
cd worker
npm run dev
```

This starts the worker at `http://localhost:8787`.

In your frontend `.env`:
```bash
VITE_API_URL=http://localhost:8787
```

### Testing the API

**Get all friends:**
```bash
curl http://localhost:8787/api/friends \
  -H "Authorization: Bearer YOUR_USER_ID"
```

**Add a friend:**
```bash
curl -X PUT http://localhost:8787/api/friends/friend-123 \
  -H "Authorization: Bearer YOUR_USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","lastContact":1706472000000}'
```

**Delete a friend:**
```bash
curl -X DELETE http://localhost:8787/api/friends/friend-123 \
  -H "Authorization: Bearer YOUR_USER_ID"
```

## Database Operations

### View Data

```bash
cd worker
wrangler d1 execute friends-radar-db --command "SELECT * FROM friends LIMIT 10"
```

### Query Specific User

```bash
wrangler d1 execute friends-radar-db \
  --command "SELECT * FROM friends WHERE userId='user123'"
```

### Clear All Data

```bash
wrangler d1 execute friends-radar-db --command "DELETE FROM friends"
```

## Security

### Current Implementation

⚠️ **Important**: The current authentication is simplified for development.

**What's implemented:**
- Bearer token authentication required
- CORS enabled for all origins
- User data isolation (userId-based queries)

**What needs improvement for production:**
1. **Verify JWT tokens**: Currently accepts any token as userId
2. **Restrict CORS**: Limit to your domain only
3. **Rate limiting**: Add to prevent abuse

### Improving Security

Edit `worker/src/index.ts` and implement proper JWT verification:

```typescript
async function verifyAuth(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  // Verify JWT with Google's public keys
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/certs')
    const keys = await response.json()
    
    // Verify signature using keys
    // Extract 'sub' claim as userId
    // Check expiration
    
    return userId
  } catch (error) {
    return null
  }
}
```

### Restrict CORS

In `wrangler.toml`:
```toml
[cors]
origins = ["https://yourdomain.com"]  # Your actual domain
methods = ["GET", "PUT", "DELETE", "OPTIONS"]
headers = ["Content-Type", "Authorization"]
```

## How It Works

### Data Flow

1. **User Action** → Friend added/updated/deleted
2. **Local Storage** → Saved immediately (instant feedback)
3. **API Call** → Background sync to Cloudflare Worker
4. **D1 Database** → Data persisted in SQLite
5. **Polling** → Frontend checks for updates every 5 seconds
6. **Merge** → Newer data wins based on `lastContact` timestamp

### Database Schema

```sql
CREATE TABLE friends (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  lastContact INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  createdAt INTEGER DEFAULT (unixepoch() * 1000)
);
```

### API Endpoints

- `GET /api/friends` - Get all friends for user
- `PUT /api/friends/{id}` - Create or update friend
- `DELETE /api/friends/{id}` - Delete friend
- `PUT /api/friends/batch` - Batch upsert friends

## Costs & Limits

### Cloudflare Free Tier

**Workers:**
- 100,000 requests/day
- 10ms CPU time per request
- Unlimited requests on paid plan ($5/month)

**D1 Database:**
- 5 GB storage
- 5 million reads/day
- 100,000 writes/day

**For Friends Radar:**
- Normal usage: ~100-1000 requests/day
- Storage: ~100 bytes per friend
- **You'll stay well within free tier!**

## Troubleshooting

### Worker not deploying

**Check:**
1. Logged in: `wrangler whoami`
2. Database ID correct in `wrangler.toml`
3. Run `wrangler deploy` from `worker` directory

### Database errors

**Reset database:**
```bash
cd worker
wrangler d1 execute friends-radar-db --file=./schema.sql
```

### CORS errors

**Symptoms:**
- Browser console: "CORS policy error"
- Network tab shows OPTIONS request failing

**Fix:**
1. Check `wrangler.toml` CORS settings
2. Redeploy worker: `npm run deploy`
3. Clear browser cache

### Authentication errors

**Symptoms:**
- 401 Unauthorized responses
- Sync indicator shows error

**Check:**
1. Google sign-in working
2. Authorization header being sent
3. Worker logs: `wrangler tail`

### Data not syncing

**Debug steps:**
1. Check browser console for API errors
2. Check network tab for failed requests
3. View worker logs: `wrangler tail`
4. Query database directly to verify data

### View Worker Logs

```bash
cd worker
wrangler tail
```

Then use the app - you'll see real-time logs!

## Monitoring

### Check Worker Status

```bash
wrangler deployments list
```

### View Database Size

```bash
wrangler d1 execute friends-radar-db \
  --command "SELECT COUNT(*) as total FROM friends"
```

### Query by User

```bash
wrangler d1 execute friends-radar-db \
  --command "SELECT userId, COUNT(*) as friends FROM friends GROUP BY userId"
```

## Updating the Worker

### Make Changes

1. Edit `worker/src/index.ts`
2. Test locally: `npm run dev`
3. Deploy: `npm run deploy`

### Database Migrations

**Add a new column:**
```bash
wrangler d1 execute friends-radar-db \
  --command "ALTER TABLE friends ADD COLUMN newField TEXT"
```

**Create migration file:**
```sql
-- migrations/001_add_field.sql
ALTER TABLE friends ADD COLUMN newField TEXT;
```

```bash
wrangler d1 execute friends-radar-db --file=./migrations/001_add_field.sql
```

## Production Checklist

Before going live:

- [ ] Implement proper JWT verification
- [ ] Restrict CORS to your domain
- [ ] Add rate limiting
- [ ] Set up monitoring/alerts
- [ ] Test with multiple users
- [ ] Backup database regularly
- [ ] Document your API for team

## Alternative: Using KV Instead of D1

If you prefer key-value storage over SQL:

1. Create KV namespace: `wrangler kv:namespace create "FRIENDS"`
2. Update `wrangler.toml` with KV binding
3. Modify worker to use KV: `env.FRIENDS.put(key, value)`

D1 is recommended for this use case as it supports:
- Complex queries
- Indexes for fast lookups
- Relational data

## Need Help?

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- Check worker logs: `wrangler tail`

## Removing Firebase (If Migrating)

The Firebase code has been completely removed. You can delete:
- `FIREBASE_SETUP.md`
- Any Firebase environment variables from `.env`

All data is now stored in:
- **Local**: Browser localStorage
- **Cloud**: Cloudflare D1 database
