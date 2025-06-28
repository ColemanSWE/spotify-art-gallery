# Spotify Integration Setup Guide

## Overview

Your API now includes full Spotify integration! Here's what has been added:

### ✅ **Features Added**
- **Spotify OAuth Flow**: Complete authentication with Spotify
- **User Profile Integration**: Fetch Spotify user data
- **Top Albums Retrieval**: Get user's top albums based on listening history
- **Token Management**: Automatic token refresh handling
- **Database Integration**: Store Spotify tokens and user data

---

## 🔧 **Environment Setup**

### 1. Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **"Create App"**
3. Fill in the app details:
   - **App Name**: `Spotify 3D Art Gallery` (or your preferred name)
   - **App Description**: `A 3D gallery displaying user's top albums`
   - **Redirect URI**: `http://localhost:3001/api/spotify/auth/callback`
   - **API/SDK**: Check the Web API box
4. Save the app and note your **Client ID** and **Client Secret**

### 2. Environment Variables

Create a `.env` file in `packages/api/` with these variables:

```bash
# Database Configuration
DATABASE_URL=sqlite:database.sqlite

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/spotify/auth/callback

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:3000
```

### 3. Replace the Placeholder Values

- `SPOTIFY_CLIENT_ID`: From your Spotify app dashboard
- `SPOTIFY_CLIENT_SECRET`: From your Spotify app dashboard  
- `JWT_SECRET`: Generate a secure random string (you can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

---

## 🚀 **API Endpoints**

### Authentication
- `GET /api/spotify/auth` - Get Spotify authorization URL
- `GET /api/spotify/auth/callback` - Spotify OAuth callback (automatic redirect)

### User Data (Requires Authentication)
- `GET /api/spotify/profile` - Get current user's Spotify profile
- `GET /api/spotify/top-albums` - Get user's top albums
  - Query params: `?timeRange=short_term|medium_term|long_term&limit=20`
- `GET /api/spotify/album/:id` - Get specific album details

---

## 📱 **Authentication Flow**

### For Frontend Integration:

1. **Get Auth URL**:
   ```javascript
   const response = await fetch('http://localhost:3001/api/spotify/auth');
   const { authUrl } = await response.json();
   // Redirect user to authUrl
   ```

2. **Handle Callback**: 
   - User will be redirected to your frontend after authorization
   - URL will contain `userId` parameter
   - Store this for subsequent API calls

3. **Make Authenticated Requests**:
   ```javascript
   // You'll need to implement JWT token generation for the userId
   const albums = await fetch('http://localhost:3001/api/spotify/top-albums', {
     headers: { 'Authorization': `Bearer ${jwtToken}` }
   });
   ```

---

## 🎵 **Album Data Structure**

The API returns albums in this format:

```typescript
interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  images: Array<{ 
    url: string; 
    height: number; 
    width: number; 
  }>;
  release_date: string;
  total_tracks: number;
  external_urls: { spotify: string };
}
```

### Image Sizes Available:
- **Large**: 640x640px (index 0)
- **Medium**: 300x300px (index 1)  
- **Small**: 64x64px (index 2)

---

## 🧪 **Testing the Integration**

### 1. Start the API
```bash
npm run dev:api
```

### 2. Test Authentication
Navigate to: `http://localhost:3001/api/spotify/auth`

### 3. Check Database
After successful auth, check your SQLite database for the new user record with Spotify data.

---

## 🗄️ **Database Changes**

The User model now includes:
- `spotifyId` - User's Spotify ID
- `spotifyAccessToken` - Current access token
- `spotifyRefreshToken` - Refresh token for renewals
- `spotifyTokenExpiry` - Token expiration timestamp
- `password` - Now optional (for Spotify-only users)

---

## 🔄 **Next Steps**

1. **Set up environment variables** in `packages/api/.env`
2. **Create Spotify app** and get credentials
3. **Test the authentication flow**
4. **Integrate with frontend** for 3D visualization
5. **Style the 3D scene** to display album covers as textures

---

## 🐛 **Troubleshooting**

### Common Issues:

1. **"Spotify credentials not configured"** 
   - Check your `.env` file has correct Spotify credentials

2. **"Invalid redirect URI"**
   - Ensure the redirect URI in Spotify app matches exactly: `http://localhost:3001/api/spotify/auth/callback`

3. **CORS errors**
   - Make sure `FRONTEND_URL` is set correctly in `.env`

4. **Token expired errors**
   - The API automatically handles token refresh, but check that `spotifyRefreshToken` exists in database

---

## 🎨 **Ready for 3D Integration!**

Your API is now ready to provide album data to your React frontend. The next step is to:
1. Set up the authentication flow in your React app
2. Fetch the user's top albums
3. Create 3D objects in Three.js using the album cover images as textures
4. Display them in your virtual gallery!

The album `images` array provides different sizes perfect for 3D textures - use the largest size (640x640) for best quality. 