<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Role;

class Menu extends Model
{
     protected $fillable = ['name', 'url', 'icon', 'parent_id'];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_menu');
    }
}
