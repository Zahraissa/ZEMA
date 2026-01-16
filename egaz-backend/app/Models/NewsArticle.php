<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NewsArticle extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'author',
        'category',
        'image',
        'publish_date',
        'status'
    ];

    protected $casts = [
        'publish_date' => 'date',
    ];

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->where('publish_date', '<=', now());
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
