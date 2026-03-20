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
     * Send a 6-digit OTP to the provided email for owner registration.
     */
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $email = $request->email;

        if (RestaurantOwner::where('email', $email)->exists()) {
            throw ValidationException::withMessages([
                'email' => ['This email is already registered as a restaurant owner.'],
            ]);
        }

        $rateLimitKey = 'owner-send-otp:' . $email;
        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);
            return response()->json(['message' => "Too many attempts. Try again in {$seconds} seconds."], 429);
        }
        RateLimiter::hit($rateLimitKey, 3600);

        $otp = (string)random_int(100000, 999999);

        EmailVerification::where('email', $email)->delete();
        EmailVerification::create([
            'email'      => $email,
            'otp'        => Hash::make($otp),
            'attempts'   => 0,
            'expires_at' => now()->addMinutes(10),
            'created_at' => now(),
        ]);

        Mail::to($email)->send(new OtpVerificationMail($otp));

        return response()->json(['message' => 'Verification code sent to your email.']);
    }

    /**
     * Verify the owner OTP and return an encrypted verification token.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|string|size:6',
        ]);

        $record = EmailVerification::where('email', $request->email)->first();

        if (!$record) {
            throw ValidationException::withMessages(['otp' => ['No verification code found. Please request a new one.']]);
        }

        if ($record->expires_at->isPast()) {
            $record->delete();
            throw ValidationException::withMessages(['otp' => ['Verification code has expired. Please request a new one.']]);
        }

        if ($record->attempts >= 5) {
            $record->delete();
            throw ValidationException::withMessages(['otp' => ['Too many failed attempts. Please request a new code.']]);
        }

        if (!Hash::check($request->otp, $record->otp)) {
            $record->increment('attempts');
            $remaining = 5 - $record->attempts;
            throw ValidationException::withMessages(['otp' => ["Invalid verification code. {$remaining} attempt(s) remaining."]]);
        }

        $record->delete();

        $verificationToken = Crypt::encryptString(json_encode([
            'email'       => $request->email,
            'verified_at' => now()->toIso8601String(),
            'expires_at'  => now()->addMinutes(30)->toIso8601String(),
        ]));

        return response()->json([
            'message'                  => 'Email verified successfully.',
            'email_verification_token' => $verificationToken,
        ]);
    }

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
            'first_name' => ['required', 'string', 'min:2', 'max:255'],
            'last_name' => ['required', 'string', 'min:2', 'max:255'],
            'phone' => ['nullable', 'string', 'min:7', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'restaurant_name' => ['required', 'string', 'min:2', 'max:255'],
            'business_address' => 'required|string|min:5|max:500',
            'business_contact_number' => ['required', 'string', 'min:7', 'max:20'],
            'business_permit' => 'nullable|string|max:255',
            'business_registration_number' => 'nullable|string|max:255',
            'cuisine_type' => 'nullable|array',
            'cuisine_type.*' => 'string|max:50',
            'price_range' => 'nullable|string|max:10',
            'logo_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'cover_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->except(['logo_file', 'cover_file']);
        $data['name'] = $validated['first_name'] . ' ' . $validated['last_name'];

        if ($request->hasFile('logo_file')) {
            $path = $request->file('logo_file')->store('restaurants/logos', 'public');
            $data['logo'] = asset('storage/' . $path);
        }

        if ($request->hasFile('cover_file')) {
            $path = $request->file('cover_file')->store('restaurants/covers', 'public');
            $data['cover_image'] = asset('storage/' . $path);
        }

        $owner->update($data);

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
