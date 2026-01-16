<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactOffice extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'office_type', // 'headquarter', 'regional', 'research'
        'office_name',
        'location',
        'postal_address',
        'email',
        'phone',
        'helpdesk',
        'map_embed_url',
        'map_latitude',
        'map_longitude',
        'map_rating',
        'map_reviews',
        'order',
        'status'
    ];

    protected $casts = [
        'map_latitude' => 'float',
        'map_longitude' => 'float',
        'map_rating' => 'float',
        'map_reviews' => 'integer',
        'order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('office_type', $type);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    public function scopeHeadquarters($query)
    {
        return $query->where('office_type', 'headquarter');
    }

    public function scopeRegional($query)
    {
        return $query->where('office_type', 'regional');
    }

    public function scopeResearch($query)
    {
        return $query->where('office_type', 'research');
    }
}
