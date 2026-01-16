<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'display_name',
        'description',
        'group',
    ];

    /**
     * Get the roles that have this permission.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'permission_role');
    }

    /**
     * Get the users that have this permission through their roles.
     */
    public function users()
    {
        return $this->roles()
            ->with('users')
            ->get()
            ->pluck('users')
            ->flatten()
            ->unique('id');
    }
}

