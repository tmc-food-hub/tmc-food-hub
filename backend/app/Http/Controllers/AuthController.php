<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

        if (! $user || ! Hash::check($request->password, $user->password)) {
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
     * Handle registration and return a Sanctum token.
     */
    public function register(Request $request)
    {
        $rules = [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:customer,partner',
            'terms_accepted' => 'accepted',
            'privacy_accepted' => 'accepted',
        ];

        if ($request->role === 'customer') {
            $rules['address'] = 'required|string|max:500';
            $rules['phone'] = 'required|string|max:20';
        }

        if ($request->role === 'partner') {
            $rules['restaurant_name'] = 'required|string|max:255';
            $rules['business_address'] = 'required|string|max:500';
            $rules['business_contact_number'] = 'required|string|max:20';
            $rules['business_permit'] = 'required|string|max:255';
            $rules['merchant_agreement_accepted'] = 'accepted';
        }

        $validated = $request->validate($rules);

        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'delivery_instructions' => $request->delivery_instructions,
            'restaurant_name' => $validated['restaurant_name'] ?? null,
            'business_address' => $validated['business_address'] ?? null,
            'business_contact_number' => $validated['business_contact_number'] ?? null,
            'business_permit' => $validated['business_permit'] ?? null,
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
     * Revoke the current token (logout).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }
}
