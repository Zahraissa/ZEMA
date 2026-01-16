<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Download;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class DownloadController extends Controller
{
    public function index()
    {
        $downloads = Download::orderBy('order', 'asc')
            ->orderBy('published_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $downloads
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|max:102400', // 100MB max
            'is_active' => 'boolean',
            'order' => 'integer',
            'published_date' => 'required|date',
        ]);

        $data = $request->only(['title', 'description', 'order', 'published_date']);
        
        // Handle boolean field properly
        if ($request->has('is_active')) {
            $data['is_active'] = $request->is_active === '1' || $request->is_active === true || $request->is_active === 1;
        }
        
        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('downloads', $fileName, 'public');
            
            $data['file_url'] = Storage::url($filePath);
            $data['file_name'] = $file->getClientOriginalName();
            $data['file_size'] = $this->formatFileSize($file->getSize());
            $data['file_type'] = strtoupper($file->getClientOriginalExtension());
        }

        $download = Download::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Download created successfully',
            'data' => $download
        ], 201);
    }

    public function show(Download $download)
    {
        return response()->json([
            'success' => true,
            'data' => $download
        ]);
    }

    public function update(Request $request, Download $download)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|max:102400',
            'is_active' => 'boolean',
            'order' => 'integer',
            'published_date' => 'required|date',
        ]);

        $data = $request->only(['title', 'description', 'order', 'published_date']);
        
        // Handle boolean field properly
        if ($request->has('is_active')) {
            $data['is_active'] = $request->is_active === '1' || $request->is_active === true || $request->is_active === 1;
        }
        
        // Handle file upload
        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($download->file_url) {
                $oldPath = str_replace('/storage/', '', $download->file_url);
                Storage::disk('public')->delete($oldPath);
            }
            
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('downloads', $fileName, 'public');
            
            $data['file_url'] = Storage::url($filePath);
            $data['file_name'] = $file->getClientOriginalName();
            $data['file_size'] = $this->formatFileSize($file->getSize());
            $data['file_type'] = strtoupper($file->getClientOriginalExtension());
        }

        $download->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Download updated successfully',
            'data' => $download
        ]);
    }

    public function destroy(Download $download)
    {
        // Delete file if exists
        if ($download->file_url) {
            $filePath = str_replace('/storage/', '', $download->file_url);
            Storage::disk('public')->delete($filePath);
        }

        $download->delete();

        return response()->json([
            'success' => true,
            'message' => 'Download deleted successfully'
        ]);
    }

    public function toggleStatus(Download $download)
    {
        $download->update(['is_active' => !$download->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Download status updated successfully',
            'data' => $download
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'downloads' => 'required|array',
            'downloads.*.id' => 'required|exists:downloads,id',
            'downloads.*.order' => 'required|integer',
        ]);

        foreach ($request->downloads as $item) {
            Download::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Downloads reordered successfully'
        ]);
    }

    private function formatFileSize($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}
