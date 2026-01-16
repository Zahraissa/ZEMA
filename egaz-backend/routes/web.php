<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

// Route to serve storage files
Route::get('storage/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);
    
    // Log for debugging
    \Log::info('Storage file request', [
        'requested_path' => $path,
        'full_path' => $fullPath,
        'exists' => file_exists($fullPath)
    ]);
    
    if (!file_exists($fullPath)) {
        \Log::error('Storage file not found', ['path' => $fullPath]);
        abort(404, 'File not found');
    }
    
    try {
        $file = file_get_contents($fullPath);
        $type = mime_content_type($fullPath);
        
        return response($file, 200, [
            'Content-Type' => $type,
            'Cache-Control' => 'public, max-age=31536000',
            'Content-Length' => filesize($fullPath),
        ]);
    } catch (\Exception $e) {
        \Log::error('Error serving storage file', [
            'path' => $fullPath,
            'error' => $e->getMessage()
        ]);
        abort(500, 'Error serving file');
    }
})->where('path', '.*');
