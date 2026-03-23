<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect user to Google OAuth provider
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->scopes(['profile', 'email'])
            ->with(['access_type' => 'online'])
            ->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Google authentication failed',
                'error' => $e->getMessage(),
            ], 401);
        }

        // Find or create user
        $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'password' => bcrypt(uniqid()),
                'email_verified_at' => now(),
                'google_id' => $googleUser->getId(),
            ]);
        } else {
            // Update google_id if not already set
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }
        }

        // Create Sanctum token
        $token = $user->createToken('auth-token')->plainTextToken;

        // Return token and user data (for SPA)
        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Handle Google login via frontend (when frontend already has Google token)
     */
    public function loginWithGoogle()
    {
        // This endpoint can be called by frontend with Google token
        // Frontend sends the ID token, we verify it on backend
        return response()->json([
            'message' => 'Use frontend Google login with id_token',
        ]);
    }
}
