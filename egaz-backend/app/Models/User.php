<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Role;
use App\Models\Permission;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'email_verified_at',
        'last_login',
        'failed_login_attempts',
        'locked_until',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];


    /**
     * The attributes that should have default values.
     *
     * @var array<string, string>
     */
    protected $attributes = [
        'role' => 'author',
        'status' => 'active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login' => 'datetime',
            'locked_until' => 'datetime',
        ];
    }

    /**
     * Scope a query to only include active users.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include users by role.
     */
    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }


    /**
     * A user may have multiple roles (many-to-many relationship).
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user');
    }

    /**
     * Get user permissions through roles (relationship).
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions');
    }

    /**
     * Get user permissions through roles (method).
     */
    public function getUserPermissions()
    {
        $permissions = collect();
        
        // Get permissions from many-to-many roles (if user has assigned roles)
        if ($this->roles()->exists()) {
            $rolePermissions = $this->roles()
                ->with('permissions')
                ->get()
                ->pluck('permissions')
                ->flatten();
            
            $permissions = $permissions->merge($rolePermissions);
        } else {
            // Get permissions from simple role field (fallback for users without many-to-many roles)
            if ($this->role) {
                $role = Role::where('name', $this->role)->first();
                if ($role) {
                    $permissions = $permissions->merge($role->permissions);
                }
            }
        }
        
        // Return as array for proper JSON serialization
        return $permissions->unique('id')->values()->all();
    }

    /**
     * Check if user has a specific role (checks both simple role field and many-to-many).
     */
    public function hasRole($roleName): bool
    {
        // Check simple role field first (for backward compatibility)
        if ($this->role === $roleName) {
            return true;
        }
        
        // Check many-to-many relationship
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Get the primary role (from simple role field or first from many-to-many).
     */
    public function getPrimaryRole(): string
    {
        // If user has roles in many-to-many table, get the first one
        $role = $this->roles()->first();
        if ($role) {
            return $role->name;
        }
        
        // Fallback to simple role field
        return $this->role ?? 'author';
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission($permissionName): bool
    {
        $userPermissions = $this->getUserPermissions();
        return $userPermissions->where('name', $permissionName)->isNotEmpty();
    }

    /**
     * Check if user has any of the given permissions.
     */
    public function hasAnyPermission(array $permissions): bool
    {
        $userPermissions = $this->getUserPermissions()->pluck('name')->toArray();
        return !empty(array_intersect($permissions, $userPermissions));
    }

    /**
     * Check if user has all of the given permissions.
     */
    public function hasAllPermissions(array $permissions): bool
    {
        $userPermissions = $this->getUserPermissions()->pluck('name')->toArray();
        return count(array_intersect($permissions, $userPermissions)) === count($permissions);
    }

    /**
     * Assign a role to the user.
     */
    public function assignRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->first();
        }
        
        if ($role && !$this->hasRole($role->name)) {
            $this->roles()->attach($role->id);
        }
    }

    /**
     * Remove a role from the user.
     */
    public function removeRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->first();
        }
        
        if ($role) {
            $this->roles()->detach($role->id);
        }
    }

    /**
     * Sync roles for the user.
     */
    public function syncRoles($roles)
    {
        $roleIds = collect($roles)->map(function ($role) {
            if (is_string($role)) {
                return Role::where('name', $role)->first()?->id;
            }
            return $role->id ?? $role;
        })->filter()->toArray();

        $this->roles()->sync($roleIds);
    }

    /**
     * Get all menus available for this user through roles.
     */
    public function menus()
    {
        return $this->roles()
            ->with('menus')
            ->get()
            ->pluck('menus')
            ->flatten()
            ->unique('id');
    }

    /**
     * Check if the user account is currently locked.
     */
    public function isLocked(): bool
    {
        if (!$this->locked_until) {
            return false;
        }
        
        // Check if lock period has expired
        if (now()->greaterThan($this->locked_until)) {
            // Lock expired, reset attempts
            $this->failed_login_attempts = 0;
            $this->locked_until = null;
            $this->save();
            return false;
        }
        
        return true;
    }

    /**
     * Increment failed login attempts and lock account if threshold is reached.
     */
    public function incrementFailedLoginAttempts(): void
    {
        $this->failed_login_attempts = ($this->failed_login_attempts ?? 0) + 1;
        
        // Lock account after 3 failed attempts for 10 minutes
        if ($this->failed_login_attempts >= 3) {
            $this->locked_until = now()->addMinutes(10);
        }
        
        $this->save();
    }

    /**
     * Reset failed login attempts (called on successful login).
     */
    public function resetFailedLoginAttempts(): void
    {
        $this->failed_login_attempts = 0;
        $this->locked_until = null;
        $this->save();
    }
}
