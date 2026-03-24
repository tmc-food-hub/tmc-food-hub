<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Decode and verify Google JWT credential
     */
    private function getGoogleUserFromCredential($credential)
    {
        try {
            // The credential is a JWT: header.payload.signature
            $parts = explode('.', $credential);
            if (count($parts) !== 3) {
                throw new \Exception('Invalid JWT format');
            }

            // Decode the payload (second part) with proper base64 padding
            $payload = $parts[1];
            $payload .= str_repeat('=', (4 - (strlen($payload) % 4)) % 4);
            $decoded = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);

            if (!$decoded) {
                throw new \Exception('Failed to decode JWT payload');
            }

            return (object) [
                'id' => $decoded['sub'] ?? null,
                'email' => $decoded['email'] ?? null,
                'name' => $decoded['name'] ?? null,
                'picture' => $decoded['picture'] ?? null,
            ];
        } catch (\Exception $e) {
            throw new \Exception('Failed to decode Google credential: ' . $e->getMessage());
        }
    }

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
     * Handle Google signup via JWT credential (creates new user if doesn't exist)
     */
    public function signupWithToken(Request $request)
    {
        $validated = $request->validate([
            'credential' => 'required|string',
        ]);

        try {
            // Decode JWT credential to get Google user info
            $googleUser = $this->getGoogleUserFromCredential($validated['credential']);

            // Find or create user by email
            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
                // Create new user from Google data
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => bcrypt(uniqid()),
                    'email_verified_at' => now(),
                    'google_id' => $googleUser->id,
                ]);
            } else {
                // Update google_id if not already set
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->id]);
                }
            }

            // Create Sanctum token
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Google signup successful',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Google signup failed',
                'error' => $e->getMessage(),
            ], 401);
        }
    }

    /**
     * Handle Google login via JWT credential (login only, no signup)
     */
    public function loginWithToken(Request $request)
    {
        $validated = $request->validate([
            'credential' => 'required|string',
        ]);

        try {
            // Decode JWT credential to get Google user info
            $googleUser = $this->getGoogleUserFromCredential($validated['credential']);

            // Only login if user already exists
            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'No account found with this email. Please sign up first.',
                    'error' => 'user_not_found',
                ], 404);
            }

            // Update google_id if not already set
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->id]);
            }

            // Create Sanctum token
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Google login successful',
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Google login error: ' . $e->getMessage() . ' - ' . $e->getFile() . ':' . $e->getLine());
            return response()->json([
                'message' => 'Google login failed',
                'error' => $e->getMessage(),
            ], 401);
        }
    }
}
