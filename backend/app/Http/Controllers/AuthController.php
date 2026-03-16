<?php

namespace App\Http\Controllers;

use App\Mail\OtpVerificationMail;
use App\Mail\PasswordResetOtpMail;
use App\Models\EmailVerification;
use App\Models\PasswordResetVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle login and return a Sanctum token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Send a 6-digit OTP to the provided email for verification.
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;

        // Check if email is already registered
        if (User::where('email', $email)->exists()) {
            throw ValidationException::withMessages([
                'email' => ['This email address is already registered.'],
            ]);
        }

        // Rate limit: 5 OTP sends per email per hour
        $rateLimitKey = 'send-otp:' . $email;
        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);
            return response()->json([
                'message' => "Too many attempts. Please try again in {$seconds} seconds.",
            ], 429);
        }
        RateLimiter::hit($rateLimitKey, 3600);

        // Generate 6-digit OTP
        $otp = (string)random_int(100000, 999999);

        // Delete any existing OTP for this email and create a new one
        EmailVerification::where('email', $email)->delete();
        EmailVerification::create([
            'email' => $email,
            'otp' => Hash::make($otp),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(10),
            'created_at' => now(),
        ]);

        // Send OTP email
        Mail::to($email)->send(new OtpVerificationMail($otp));

        return response()->json([
            'message' => 'Verification code sent to your email.',
        ]);
    }

    /**
     * Verify the OTP code and return an encrypted verification token.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $record = EmailVerification::where('email', $request->email)->first();

        if (!$record) {
            throw ValidationException::withMessages([
                'otp' => ['No verification code found. Please request a new one.'],
            ]);
        }

        // Check expiry
        if ($record->expires_at->isPast()) {
            $record->delete();
            throw ValidationException::withMessages([
                'otp' => ['Verification code has expired. Please request a new one.'],
            ]);
        }

        // Check max attempts (5 failed tries = must resend)
        if ($record->attempts >= 5) {
            $record->delete();
            throw ValidationException::withMessages([
                'otp' => ['Too many failed attempts. Please request a new code.'],
            ]);
        }

        // Verify OTP
        if (!Hash::check($request->otp, $record->otp)) {
            $record->increment('attempts');
            $remaining = 5 - $record->attempts;
            throw ValidationException::withMessages([
                'otp' => ["Invalid verification code. {$remaining} attempt(s) remaining."],
            ]);
        }

        // OTP is valid — delete the record and issue a verification token
        $record->delete();

        $verificationToken = Crypt::encryptString(json_encode([
            'email' => $request->email,
            'verified_at' => now()->toIso8601String(),
            'expires_at' => now()->addMinutes(30)->toIso8601String(),
        ]));

        return response()->json([
            'message' => 'Email verified successfully.',
            'email_verification_token' => $verificationToken,
        ]);
    }

    /**
     * Handle registration and return a Sanctum token.
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

        $rules = [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'terms_accepted' => 'accepted',
            'privacy_accepted' => 'accepted',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|max:20',
        ];

        $validated = $request->validate($rules);

        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => 'customer',
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'delivery_instructions' => $request->delivery_instructions,
            'email_verified_at' => now(),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Return the authenticated user.
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update the authenticated user's profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $rules = [
            'first_name' => ['required', 'string', 'min:2', 'max:255', 'regex:/^[\pL\s\-\']+$/u'],
            'last_name' => ['required', 'string', 'min:2', 'max:255', 'regex:/^[\pL\s\-\']+$/u'],
            'phone' => ['nullable', 'string', 'min:7', 'max:20', 'regex:/^[\+]?[\d\s\-\(\)]+$/'],
        ];

        $rules['address'] = 'nullable|string|min:5|max:500';
        $rules['delivery_instructions'] = 'nullable|string|max:500';

        $validated = $request->validate($rules, [
            'first_name.regex' => 'First name must only contain letters, spaces, hyphens, or apostrophes.',
            'last_name.regex' => 'Last name must only contain letters, spaces, hyphens, or apostrophes.',
            'first_name.min' => 'First name must be at least 2 characters.',
            'last_name.min' => 'Last name must be at least 2 characters.',
            'phone.regex' => 'Phone number must contain only digits, spaces, dashes, or parentheses.',
            'phone.min' => 'Phone number must be at least 7 characters.',
            'restaurant_name.regex' => 'Restaurant name contains invalid characters.',
            'business_contact_number.regex' => 'Business contact must contain only digits, spaces, dashes, or parentheses.',
            'address.min' => 'Address must be at least 5 characters.',
            'business_address.min' => 'Business address must be at least 5 characters.',
        ]);

        $validated['name'] = $validated['first_name'] . ' ' . $validated['last_name'];

        $user->update($validated);

        return response()->json($user->fresh());
    }

    /**
     * Send a password reset OTP to the provided email.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;

        // Rate limit: 5 reset OTP sends per email per hour
        $rateLimitKey = 'forgot-password:' . $email;
        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);
            return response()->json([
                'message' => "Too many attempts. Please try again in {$seconds} seconds.",
            ], 429);
        }
        RateLimiter::hit($rateLimitKey, 3600);

        // Anti-enumeration: always return success regardless of whether email exists
        $user = User::where('email', $email)->first();

        if ($user) {
            $otp = (string) random_int(100000, 999999);

            PasswordResetVerification::where('email', $email)->delete();
            PasswordResetVerification::create([
                'email' => $email,
                'otp' => Hash::make($otp),
                'attempts' => 0,
                'expires_at' => now()->addMinutes(10),
                'created_at' => now(),
            ]);

            Mail::to($email)->send(new PasswordResetOtpMail($otp));
        }

        return response()->json([
            'message' => 'If an account with that email exists, a reset code has been sent.',
        ]);
    }

    /**
     * Verify the password reset OTP and return an encrypted reset token.
     */
    public function verifyResetOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $record = PasswordResetVerification::where('email', $request->email)->first();

        // Generic error message for all failure cases to prevent email enumeration
        $genericError = 'Invalid or expired reset code. Please try again or request a new code.';

        if (!$record) {
            throw ValidationException::withMessages([
                'otp' => [$genericError],
            ]);
        }

        if ($record->expires_at->isPast()) {
            $record->delete();
            throw ValidationException::withMessages([
                'otp' => [$genericError],
            ]);
        }

        if ($record->attempts >= 5) {
            $record->delete();
            throw ValidationException::withMessages([
                'otp' => [$genericError],
            ]);
        }

        if (!Hash::check($request->otp, $record->otp)) {
            $record->increment('attempts');
            throw ValidationException::withMessages([
                'otp' => [$genericError],
            ]);
        }

        $record->delete();

        $resetToken = Crypt::encryptString(json_encode([
            'email' => $request->email,
            'verified_at' => now()->toIso8601String(),
            'expires_at' => now()->addMinutes(15)->toIso8601String(),
        ]));

        return response()->json([
            'message' => 'Reset code verified successfully.',
            'reset_token' => $resetToken,
        ]);
    }

    /**
     * Reset the user's password using an encrypted reset token.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'reset_token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            $tokenData = json_decode(Crypt::decryptString($request->reset_token), true);
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'reset_token' => ['Invalid reset token. Please start the process again.'],
            ]);
        }

        if (now()->greaterThan($tokenData['expires_at'])) {
            throw ValidationException::withMessages([
                'reset_token' => ['Reset token has expired. Please start the process again.'],
            ]);
        }

        $user = User::where('email', $tokenData['email'])->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'reset_token' => ['Unable to reset password. Please try again.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Revoke all existing tokens to force re-login
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password reset successfully. Please log in with your new password.',
        ]);
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
