<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::query();

            // Search functionality
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('role', 'like', "%{$search}%");
                });
            }

            // Filter by role
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Order by created_at desc and load roles with permissions
            $users = $query->with('roles.permissions')->orderBy('created_at', 'desc')->get();
            
            // Add permissions to each user
            foreach ($users as $user) {
                $user->permissions = $user->getUserPermissions();
            }

            return response()->json([
                'success' => true,
                'message' => 'Users retrieved successfully',
                'data' => $users
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching users: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => [
                    'required',
                    'string',
                    'max:255',
                    function ($attribute, $value, $fail) {
                        $trimmedName = trim($value);
                        // Check if name starts with a number
                        if (preg_match('/^\d/', $trimmedName)) {
                            $fail('The full name cannot start with a number.');
                        }
                        // Check if name is only numbers
                        if (preg_match('/^\d+$/', preg_replace('/\s+/', '', $trimmedName))) {
                            $fail('The full name cannot be only numbers.');
                        }
                    },
                ],
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'required|string|in:admin,editor,author,subscriber',
                'status' => 'required|string|in:active,inactive',
                'send_welcome_email' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userData = $validator->validated();
            $userData['password'] = Hash::make($userData['password']);
            $userData['email_verified_at'] = now(); // Auto-verify for admin-created users

            $user = User::create($userData);
            
            // Load roles and permissions
            $user->load('roles.permissions');
            $user->permissions = $user->getUserPermissions();

            // Send welcome email if requested
            if ($request->get('send_welcome_email', false)) {
                try {
                    // TODO: Implement welcome email sending
                    // Mail::to($user->email)->send(new WelcomeEmail($user, $request->password));
                } catch (\Exception $e) {
                    \Log::error('Failed to send welcome email: ' . $e->getMessage());
                }
            }

            \Log::info('User created successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Error creating user: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): JsonResponse
    {
        try {
            // Load roles and permissions
            $user->load('roles.permissions');
            $user->permissions = $user->getUserPermissions();
            
            return response()->json([
                'success' => true,
                'message' => 'User retrieved successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching user: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:255',
                    function ($attribute, $value, $fail) {
                        $trimmedName = trim($value);
                        // Check if name starts with a number
                        if (preg_match('/^\d/', $trimmedName)) {
                            $fail('The full name cannot start with a number.');
                        }
                        // Check if name is only numbers
                        if (preg_match('/^\d+$/', preg_replace('/\s+/', '', $trimmedName))) {
                            $fail('The full name cannot be only numbers.');
                        }
                    },
                ],
                'email' => [
                    'sometimes',
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users')->ignore($user->id)
                ],
                'password' => 'sometimes|string|min:8',
                'role' => 'sometimes|required|string|in:admin,editor,author,subscriber',
                'status' => 'sometimes|required|string|in:active,inactive'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = $validator->validated();

            // Hash password if provided
            if (isset($updateData['password'])) {
                $updateData['password'] = Hash::make($updateData['password']);
            }

            $user->update($updateData);

            // Reload user with roles and permissions
            $user->load('roles.permissions');
            $user->permissions = $user->getUserPermissions();

            \Log::info('User updated successfully', [
                'user_id' => $user->id,
                'updated_fields' => array_keys($updateData)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            \Log::error('Error updating user: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): JsonResponse
    {
        try {
            // Prevent deletion of admin users (optional security check)
            if ($user->role === 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin users cannot be deleted'
                ], 403);
            }

            // Prevent users from deleting themselves
            if ($user->id === auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot delete your own account'
                ], 403);
            }

            $userId = $user->id;
            $user->delete();

            \Log::info('User deleted successfully', [
                'deleted_user_id' => $userId,
                'deleted_by' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error deleting user: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user status.
     */
    public function updateStatus(Request $request, User $user): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|string|in:active,inactive'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Prevent deactivating admin users
            if ($user->role === 'admin' && $request->status === 'inactive') {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin users cannot be deactivated'
                ], 403);
            }

            // Prevent users from deactivating themselves
            if ($user->id === auth()->id() && $request->status === 'inactive') {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot deactivate your own account'
                ], 403);
            }

            $user->update(['status' => $request->status]);

            // Reload user with roles and permissions
            $user->load('roles.permissions');
            $user->permissions = $user->getUserPermissions();

            \Log::info('User status updated', [
                'user_id' => $user->id,
                'new_status' => $request->status,
                'updated_by' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User status updated successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            \Log::error('Error updating user status: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user roles.
     */
    public function roles(User $user): JsonResponse
    {
        try {
            $user->load('roles.permissions');
            
            return response()->json([
                'success' => true,
                'data' => $user->roles
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user roles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign roles to user.
     */
    public function assignRoles(Request $request, User $user): JsonResponse
    {
        try {
            $request->validate([
                'roles' => 'required|array',
                'roles.*' => 'exists:roles,id'
            ]);

            $user->syncRoles($request->roles);
            $user->load('roles.permissions');
            
            // Refresh permissions after role assignment
            $user->permissions = $user->getUserPermissions();

            return response()->json([
                'success' => true,
                'message' => 'Roles assigned successfully',
                'data' => $user->roles
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign roles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user permissions.
     */
    public function permissions(User $user): JsonResponse
    {
        try {
            $permissions = $user->getUserPermissions();
            
            return response()->json([
                'success' => true,
                'data' => $permissions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user permissions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if user has permission.
     */
    public function hasPermission(Request $request, User $user): JsonResponse
    {
        try {
            $request->validate([
                'permission' => 'required|string'
            ]);

            $hasPermission = $user->hasPermission($request->permission);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'has_permission' => $hasPermission
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check permission',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
