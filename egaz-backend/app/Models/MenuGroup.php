<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_type_id',
        'name',
        'description',
        'status',
        'order'
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function menuType()
    {
        return $this->belongsTo(MenuType::class);
    }

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }
}
