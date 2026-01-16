<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status'
    ];

    public function menuGroups()
    {
        return $this->hasMany(MenuGroup::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
