# Configuring Render.com for Production

Your code has been pushed to GitHub. Render.com will automatically detect the changes and start a new deployment.

## What Just Happened

**Pushed to GitHub:**
- Google authentication code
- Cloudflare Workers API
- Cross-device sync implementation
- Updated layout (user profile in top-right)
- All documentation

**GitHub URL:** https://github.com/Oliver-Meier/friends-radar

## Render.com Will Now Build

Render.com watches your GitHub repo and will:
1. Detect the push
2. Run: `npm install && npm run build`
3. Deploy the `dist/` folder

**BUT** - it needs environment variables to work with Cloudflare!

## 🔴 REQUIRED: Add Environment Variables to Render.com

Your app needs these variables to connect to Cloudflare in production:

### Steps:

1. **Go to Render.com Dashboard**
   - https://dashboard.render.com/
   - Find your "friends-radar" service
   - Click on it

2. **Go to Environment Tab**
   - Look for "Environment" or "Environment Variables" in the sidebar

3. **Add These Variables:**

   **Variable 1 - API URL:**
   ```
   Key:   VITE_API_URL
   Value: https://friends-radar-api.mr-meieroliver.workers.dev
   ```

   **Variable 2 - Google Client ID:**
   ```
   Key:   VITE_GOOGLE_CLIENT_ID
   Value: 14763526812-vi1dc9f4bb939src6vmo180220j935hd.apps.googleusercontent.com
   ```

4. **Save Changes**
   - Click "Save" or "Update"
   - Render will automatically trigger a new deployment

5. **Wait for Build**
   - Build should complete in 2-3 minutes
   - Check the logs for any errors

## Verify Deployment

Once deployed:

1. **Open your Render URL** (e.g., `https://friends-radar.onrender.com`)
2. **Sign in with Google**
3. **Add a friend**
4. **Check sync indicator** - should show ✓ Synced
5. **Open on another device** - friend should appear!

## If Render.com Static Sites Don't Support Environment Variables

Some static site hosts don't support environment variables. If Render.com doesn't allow this for static sites:

### Option A: Use Render Web Service Instead

Change `render.yaml`:

```yaml
services:
  - type: web
    name: friends-radar
    env: node
    buildCommand: npm install && npm run build
    startCommand: npx serve -s dist -p $PORT
    envVars:
      - key: VITE_API_URL
        value: https://friends-radar-api.mr-meieroliver.workers.dev
      - key: VITE_GOOGLE_CLIENT_ID
        value: 14763526812-vi1dc9f4bb939src6vmo180220j935hd.apps.googleusercontent.com
```

### Option B: Switch to Cloudflare Pages

**Benefits:**
- Free
- Automatic GitHub integration
- Native environment variable support
- Same network as your Worker API
- Faster (no extra latency)

**Setup:**
1. Go to https://dash.cloudflare.com/pages
2. Click "Create application"
3. Connect to GitHub
4. Select `Oliver-Meier/friends-radar` repo
5. Configure build:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
6. Add environment variables:
   - `VITE_API_URL`: `https://friends-radar-api.mr-meieroliver.workers.dev`
   - `VITE_GOOGLE_CLIENT_ID`: Your Google Client ID
7. Click "Save and Deploy"

## Google OAuth Authorized Origins

**Important:** When your production URL is live, add it to Google Cloud Console:

1. Go to https://console.cloud.google.com/apis/credentials
2. Click your OAuth Client ID
3. Add your production URL to "Authorized JavaScript origins":
   - Format: `https://friends-radar.onrender.com` (no trailing slash)
   - Or: `https://friends-radar.pages.dev` (if using Cloudflare Pages)
4. Click Save

## Checking Render.com Build Logs

To see if environment variables are working:

1. Go to Render dashboard
2. Click on your service
3. Go to "Events" or "Logs" tab
4. Look for the latest deployment
5. Check build logs for any errors

You should see in the logs:
```
> npm run build
> npm run test && vue-tsc -b && vite build
✓ 37 tests passed
✓ built in XXXms
```

## Current Status

✅ **Code pushed to GitHub**
✅ **Worker deployed to Cloudflare**
✅ **Local development working**
⏳ **Waiting for you to add environment variables to Render.com**

## Next Steps

1. **Add environment variables to Render.com** (see above)
2. **Wait for deployment** to complete
3. **Add production URL** to Google OAuth origins
4. **Test on production URL!**

---

**Let me know once you've added the environment variables to Render.com and I can help verify the deployment!**
