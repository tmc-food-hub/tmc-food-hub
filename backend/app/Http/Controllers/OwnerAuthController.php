<?php

namespace App\Http\Controllers;

use App\Mail\OtpVerificationMail;
use App\Models\EmailVerification;
use App\Models\RestaurantOwner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class OwnerAuthController extends Controller
{
    /**
     * Handle login and return a Sanctum token for owners.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $owner = RestaurantOwner::where('email', $request->email)->first();

        if (!$owner || !Hash::check($request->password, $owner->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $owner->createToken('owner-auth-token')->plainTextToken;

        return response()->json([
            'user' => $owner,
            'token' => $token,
        ]);
    }

    /**
     * Handle registration for owners and return a Sanctum token.
     */
    public function register(Request $request)
    {
        // Validate the email verification token
        $request->validate([
            'email_verification_token' => 'required|string',
        ]);

        try {
            $tokenData = json_decode(Crypt::decryptString($request->email_verification_token), true);
        }
        catch (\Exception $e) {
            throw ValidationException::withMessages([
                'email' => ['Email verification is invalid. Please verify your email again.'],
            ]);
        }

        // Check token expiry
        if (now()->greaterThan($tokenData['expires_at'])) {
            throw ValidationException::withMessages([
                'email' => ['Email verification has expired. Please verify your email again.'],
            ]);
        }

        // Check token email matches registration email
        if ($tokenData['email'] !== $request->email) {
            throw ValidationException::withMessages([
                'email' => ['Email verification does not match. Please verify your email again.'],
            ]);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:restaurant_owners,email',
            'password' => 'required|string|min:8|confirmed',
            'restaurant_name' => 'required|string|max:255',
            'business_address' => 'required|string|max:500',
            'business_contact_number' => 'required|string|max:20',
            'business_permit' => 'required|string|max:255',
            'terms_accepted' => 'accepted',
            'privacy_accepted' => 'accepted',
            'merchant_agreement_accepted' => 'accepted',
        ]);

        $owner = RestaurantOwner::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'phone' => $request->phone ?? null,
            'address' => $request->address ?? null,
            'restaurant_name' => $validated['restaurant_name'],
            'business_address' => $validated['business_address'],
            'business_contact_number' => $validated['business_contact_number'],
            'business_permit' => $validated['business_permit'],
            'email_verified_at' => now(),
        ]);

        $token = $owner->createToken('owner-auth-token')->plainTextToken;

        return response()->json([
            'user' => $owner,
            'token' => $token,
        ], 201);
    }

    /**
     * Return the authenticated owner.
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update the authenticated owner's profile.
     */
    public function updateProfile(Request $request)
    {
        $owner = $request->user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'min:2', 'max:255', 'regex:/^[\pL\s\-\']+$/u'],
            'last_name' => ['required', 'string', 'min:2', 'max:255', 'regex:/^[\pL\s\-\']+$/u'],
            'phone' => ['nullable', 'string', 'min:7', 'max:20', 'regex:/^[\+]?[\d\s\-\(\)]+$/'],
            'restaurant_name' => ['required', 'string', 'min:2', 'max:255', 'regex:/^[\pL\d\s\-\'\&\.]+$/u'],
            'business_address' => 'required|string|min:5|max:500',
            'business_contact_number' => ['required', 'string', 'min:7', 'max:20', 'regex:/^[\+]?[\d\s\-\(\)]+$/'],
            'business_permit' => 'nullable|string|max:255',
        ]);

        $validated['name'] = $validated['first_name'] . ' ' . $validated['last_name'];

        $owner->update($validated);

        return response()->json($owner->fresh());
    }

    /**
     * Revoke the current token (logout).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }
}
