# Google Authentication Setup Guide

## Backend Setup ✅ Complete

The backend is configured with a token-based Google login endpoint at:
- **Endpoint**: `POST /api/auth/google-login`
- **Controller**: `GoogleAuthController@loginWithToken`

The endpoint accepts:
- `id_token` (from Google authentication)
- `email` (from decoded token)
- `name` (from decoded token)
- `picture` (optional, from decoded token)

It returns:
- `user` (user data)
- `token` (Sanctum auth token)
- `message` (confirmation)

## Frontend Setup - Complete These Steps

### 1. Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **Credentials** in the left sidebar
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Choose **Web application** as the application type
   - Add **Authorized JavaScript origins**: 
     - `http://localhost:5173` (local dev)
     - `http://localhost:3000` (if using different port)
     - `https://foodhub.tmc-innovations.com/` (production)
   - Add **Authorized redirect URIs**: 
     - `http://localhost:5173` (local dev)
     - `https://foodhub.tmc-innovations.com/` (production)
5. Copy your **Client ID** (you don't need the secret for frontend-only authentication)

### 2. Configure Environment Variables
Edit `frontend/.env.local`:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_GOOGLE_CLIENT_ID
VITE_API_URL=http://localhost:8000/api
```

### 3. Backend Environment Variables
Edit `backend/.env`:
```env
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

### 4. Test Google Login
When users click "Sign up with Google" on the signup page:
1. Google login modal opens
2. User authenticates with Google
3. Frontend receives ID token
4. Token sent to backend for verification
5. User account created/logged in automatically
6. Redirect to dashboard

## Frontend Components
- **GoogleLoginButton.jsx**: Reusable Google login button component
- Uses `@react-oauth/google` library (wraps Google Identity Services)
- Uses modern [Google Sign-In platform](https://accounts.google.com/gsi/client)
- Wraps app with `GoogleOAuthProvider` in `main.jsx`
- Integrated into `SignupPage.jsx` for customers only

## Notes
- Google auth only available for Customer signup (not Partners yet)
- Partners must use traditional email/password signup
- Users can link Google to existing email accounts
- Email is verified automatically via Google

## Troubleshooting
- **"Google login failed"**: Check Client ID in .env.local
- **CORS errors**: Verify JavaScript origins in Google Console
- **Token validation errors**: Ensure Google Client Secret is correct on backend
- **Redirects to wrong page**: Check redirect URI configuration
