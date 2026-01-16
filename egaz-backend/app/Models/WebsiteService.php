<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WebsiteService extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'front_icon',
        'front_title',
        'front_description',
        'back_title',
        'back_description',
        'back_image',
        'link',
        'order',
        'status',
        'is_active',
        'featured',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'featured' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    protected $attributes = [
        'status' => 'active',
        'is_active' => true,
        'featured' => false,
        'order' => 0
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('status', 'active');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    // Relationships
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Accessors
    public function getFullBackImageUrlAttribute()
    {
        if ($this->back_image) {
            return asset('storage/' . $this->back_image);
        }
        return null;
    }

    public function getStatusBadgeAttribute()
    {
        return match($this->status) {
            'active' => '<span class="badge badge-success">Active</span>',
            'inactive' => '<span class="badge badge-warning">Inactive</span>',
            'draft' => '<span class="badge badge-secondary">Draft</span>',
            default => '<span class="badge badge-light">Unknown</span>'
        };
    }
}
