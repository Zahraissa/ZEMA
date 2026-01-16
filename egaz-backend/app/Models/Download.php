<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Download extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'file_url',
        'file_name',
        'file_size',
        'file_type',
        'download_count',
        'is_active',
        'order',
        'published_date'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'published_date' => 'date',
        'download_count' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('published_date', 'desc');
    }

    public function incrementDownloadCount()
    {
        $this->increment('download_count');
    }
}
