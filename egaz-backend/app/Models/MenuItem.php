<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_group_id',
        'name',
        'description',
        'link',
        'icon',
        'status',
        'order'
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function menuGroup()
    {
        return $this->belongsTo(MenuGroup::class);
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
