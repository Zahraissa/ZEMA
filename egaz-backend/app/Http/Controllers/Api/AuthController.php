<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // Check if user exists and account is locked
        if ($user && $user->isLocked()) {
            $minutesRemaining = max(1, now()->diffInMinutes($user->locked_until, false));
            throw ValidationException::withMessages([
                'email' => ["Account is locked due to multiple failed login attempts. Please try again in {$minutesRemaining} minute(s)."],
            ]);
        }

        // Check credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            // Increment failed login attempts if user exists
            if ($user) {
                $user->incrementFailedLoginAttempts();
                
                // Check if account was just locked
                if ($user->isLocked()) {
                    throw ValidationException::withMessages([
                        'email' => ['Account has been locked due to multiple failed login attempts. Please try again in 10 minutes.'],
                    ]);
                }
                
                // Show remaining attempts
                $remainingAttempts = 3 - $user->failed_login_attempts;
                if ($remainingAttempts > 0) {
                    throw ValidationException::withMessages([
                        'email' => ["The provided credentials are incorrect. {$remainingAttempts} attempt(s) remaining."],
                    ]);
                }
            }
            
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if account is inactive
        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated. Please contact an administrator.'],
            ]);
        }

        // Successful login - reset failed attempts and update last login
        $user->resetFailedLoginAttempts();
        $user->last_login = now();
        $user->save();

        $token = $user->createToken('auth-token')->plainTextToken;

        // Load roles and permissions
        $user->load('roles.permissions');
        $permissions = $user->getUserPermissions();
        
        // Ensure permissions are properly formatted as array
        $user->setAttribute('permissions', $permissions);
        $user->makeVisible('permissions');

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        
        // Load roles and permissions
        $user->load('roles.permissions');
        $permissions = $user->getUserPermissions();
        
        // Ensure permissions are properly formatted as array
        $user->setAttribute('permissions', $permissions);
        $user->makeVisible('permissions');
        
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        // Load roles and permissions
        $user->load('roles.permissions');
        $permissions = $user->getUserPermissions();
        
        // Ensure permissions are properly formatted as array
        $user->setAttribute('permissions', $permissions);
        $user->makeVisible('permissions');

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ], 201);
    }
}
