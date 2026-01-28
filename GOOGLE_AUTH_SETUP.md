# Google Authentication Setup Guide

Friends Radar now supports Google Sign-In to differentiate between users while keeping all data stored locally in the browser.

## Features

- **User Authentication**: Sign in with Google to identify yourself
- **User-Specific Data**: Each user's friends list is stored separately in localStorage
- **Local Storage**: All data remains on your device - nothing is sent to external servers
- **Privacy First**: Only your Google profile information (name, email, picture) is used for identification

## Setup Instructions

### 1. Get Google OAuth Client ID

To enable Google Sign-In in your deployment:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application** as the application type
6. Configure the OAuth consent screen if you haven't already
7. Add your authorized JavaScript origins:
   - For local development: `http://localhost:5173`
   - For production: Your deployed domain (e.g., `https://yourdomain.com`)
8. Copy the **Client ID** (it looks like: `xxxxx.apps.googleusercontent.com`)

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Replace `your_google_client_id_here` with your actual Google OAuth Client ID.

### 3. Run the Application

```bash
npm run dev
```

The app will now require Google Sign-In before accessing the friends list.

## How It Works

### Authentication Flow

1. User opens the app
2. If not authenticated, the login screen appears
3. User clicks "Sign in with Google"
4. Google authentication popup opens
5. After successful authentication, user is redirected to the main app
6. User's profile information is stored in localStorage

### Data Isolation

Each user's friends list is stored in a separate localStorage key:
- User A (ID: `user123`): `friends-radar-data-user123`
- User B (ID: `user456`): `friends-radar-data-user456`

This ensures complete data isolation between different users on the same device.

### Sign Out

- Click the "Sign Out" button in the user profile section
- This clears the authentication state
- The user is returned to the login screen
- The friends list remains in localStorage and will be loaded on next sign-in

## Development Mode

For development without a Google Client ID:

The app will still load but won't be able to authenticate. To bypass authentication during development, you can temporarily modify `src/composables/useAuth.ts` to mock a user, or simply set up a proper Client ID (recommended).

## Security Notes

- **Client-Side Only**: All authentication happens in the browser
- **No Backend**: No user data is sent to any server
- **localStorage**: Data persists only in the browser's localStorage
- **Multiple Devices**: Users need to sign in on each device; data is not synced

## Testing

The authentication system includes comprehensive tests:
- User-scoped data storage tests
- Data isolation between users
- localStorage key management tests

Run tests with:
```bash
npm run test
```

All 37 tests should pass, including the new authentication tests.

## Troubleshooting

### Google Sign-In Button Doesn't Appear

1. Check that `VITE_GOOGLE_CLIENT_ID` is set correctly in `.env`
2. Verify your domain is added to authorized JavaScript origins in Google Console
3. Check browser console for errors
4. Ensure the Google Identity Services script is loading (check Network tab)

### "Unauthorized" Error

- Verify the origin URL matches what's configured in Google Cloud Console
- For localhost, use `http://localhost:5173` (no trailing slash)
- For production, ensure HTTPS is used

### Data Not Persisting

- Check browser's localStorage (DevTools > Application > Local Storage)
- Verify you're signed in (check for user profile at top of page)
- Ensure cookies/localStorage are not being blocked by browser settings

## Privacy Policy

Since this app stores data locally and doesn't transmit it anywhere:
- No data is collected on servers
- Google authentication is used only for user identification
- Friends list data never leaves your browser
- Each browser/device has its own isolated data
