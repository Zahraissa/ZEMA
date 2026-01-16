<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SampleTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'content',
        'template_type',
        'category',
        'template_category',
        'use_case',
        'version',
        'status',
        'author',
        'department',
        'date_published',
        'tags',
        'prerequisites',
        'estimated_time',
        'complexity',
        'featured',
        'order',
        'file_path',
        'file_name',
        'file_size',
        'file_type',
        'file_url'
    ];

    protected $casts = [
        'tags' => 'array',
        'prerequisites' => 'array',
        'featured' => 'boolean',
        'order' => 'integer',
        'file_size' => 'integer',
        'date_published' => 'date',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    public function scopeByTemplateType($query, $templateType)
    {
        return $query->where('template_type', $templateType);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%")
              ->orWhere('author', 'like', "%{$search}%")
              ->orWhere('department', 'like', "%{$search}%");
        });
    }

    public function getFileUrlAttribute($value)
    {
        if ($value) return $value;
        if ($this->file_path) {
            return asset('storage/' . $this->file_path);
        }
        return null;
    }
}
