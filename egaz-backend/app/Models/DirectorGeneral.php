<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DirectorGeneral extends Model
{
    use HasFactory;

    protected $table = 'director_general';

    protected $fillable = [
        'name',
        'title',
        'message',
        'image_path',
        'additional_data',
        'status',
        'order'
    ];

    protected $casts = [
        'additional_data' => 'array',
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
}
