<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuidelinesGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status',
        'order'
    ];

    protected $casts = [
        'status' => 'string',
        'order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    public function standards()
    {
        return $this->hasMany(GuidelineStandard::class, 'group_id');
    }
}
