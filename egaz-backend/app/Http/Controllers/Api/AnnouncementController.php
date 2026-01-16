<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class AnnouncementController extends Controller
{


    public function index()
    {
        $announcements = Announcement::orderBy('order', 'asc')
            ->orderBy('published_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $announcements
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'published_date' => 'required|date',
            'is_active' => 'boolean',
            'order' => 'integer',
            'file' => 'nullable|file|mimes:pdf,doc,docx|max:10240', // 10MB max
        ]);

        $data = $request->only(['title', 'description', 'published_date', 'is_active', 'order']);
        
        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('announcements', $fileName, 'public');
            
            $data['file_url'] = Storage::url($filePath);
            $data['file_name'] = $file->getClientOriginalName();
        }

        $announcement = Announcement::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Announcement created successfully',
            'data' => $announcement
        ], 201);
    }

    public function show(Announcement $announcement)
    {
        return response()->json([
            'success' => true,
            'data' => $announcement
        ]);
    }

    public function update(Request $request, Announcement $announcement)
    {
        
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'published_date' => 'required|date',
            'is_active' => 'boolean',
            'order' => 'integer',
            'file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        $data = $request->only(['title', 'description', 'published_date', 'is_active', 'order']);
        
        // Handle file upload
        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($announcement->file_url) {
                $oldPath = str_replace('/storage/', '', $announcement->file_url);
                Storage::disk('public')->delete($oldPath);
            }
            
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('announcements', $fileName, 'public');
            
            $data['file_url'] = Storage::url($filePath);
            $data['file_name'] = $file->getClientOriginalName();
        }

        $announcement->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Announcement updated successfully',
            'data' => $announcement
        ]);
    }

    public function destroy(Announcement $announcement)
    {
        
        // Delete file if exists
        if ($announcement->file_url) {
            $filePath = str_replace('/storage/', '', $announcement->file_url);
            Storage::disk('public')->delete($filePath);
        }

        $announcement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Announcement deleted successfully'
        ]);
    }

    public function toggleStatus(Announcement $announcement)
    {
        $announcement->update(['is_active' => !$announcement->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Announcement status updated successfully',
            'data' => $announcement
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'announcements' => 'required|array',
            'announcements.*.id' => 'required|exists:announcements,id',
            'announcements.*.order' => 'required|integer',
        ]);

        foreach ($request->announcements as $item) {
            Announcement::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Announcements reordered successfully'
        ]);
    }
}
