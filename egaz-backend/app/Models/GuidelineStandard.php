<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuidelineStandard extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'content',
        'group_id',
        'standard_type',
        'maturity_level',
        'version',
        'status',
        'author',
        'department',
        'date_published',
        'tags',
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

    public function scopeByStandardType($query, $standardType)
    {
        return $query->where('standard_type', $standardType);
    }

    public function scopeByMaturityLevel($query, $maturityLevel)
    {
        return $query->where('maturity_level', $maturityLevel);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%")
              ->orWhere('author', 'like', "%{$search}%")
              ->orWhere('department', 'like', "%{$search}%")
              ->orWhere('standard_type', 'like', "%{$search}%")
              ->orWhere('maturity_level', 'like', "%{$search}%")
              ->orWhereRaw('JSON_SEARCH(tags, "one", ?) IS NOT NULL', ["%{$search}%"]);
        });
    }

    public function group()
    {
        return $this->belongsTo(GuidelinesGroup::class, 'group_id');
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
