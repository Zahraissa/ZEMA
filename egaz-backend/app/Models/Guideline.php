<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guideline extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'content',
        'category',
        'document_type',
        'version',
        'date_published',
        'last_updated',
        'status',
        'file_path',
        'file_name',
        'file_size',
        'file_type',
        'file_url',
        'tags',
        'author',
        'department',
        'is_main_document',
        'featured',
        'view_count',
        'download_count',
        'order',
        'related_documents'
    ];

    protected $casts = [
        'tags' => 'array',
        'related_documents' => 'array',
        'featured' => 'boolean',
        'is_main_document' => 'boolean',
        'view_count' => 'integer',
        'download_count' => 'integer',
        'order' => 'integer',
        'date_published' => 'date',
        'last_updated' => 'date',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeMainDocument($query)
    {
        return $query->where('is_main_document', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByDocumentType($query, $documentType)
    {
        return $query->where('document_type', $documentType);
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

    public function incrementViewCount()
    {
        $this->increment('view_count');
    }

    public function incrementDownloadCount()
    {
        $this->increment('download_count');
    }

    public function getFormattedDatePublishedAttribute()
    {
        if (!$this->date_published) return null;
        
        $day = $this->date_published->day;
        $suffix = $this->getDaySuffix($day);
        $month = $this->date_published->format('M');
        $year = $this->date_published->year;
        
        return "Imechapishwa Tarehe: {$day}{$suffix} {$month} {$year}";
    }

    private function getDaySuffix($day)
    {
        if ($day >= 11 && $day <= 13) return 'th';
        switch ($day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
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
