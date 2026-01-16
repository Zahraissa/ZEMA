<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Carbon\Carbon;

class VideoController extends Controller
{
    public function index()
    {
        $videos = Video::orderBy('order', 'asc')
            ->orderBy('published_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $videos
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'youtube_url' => 'required|url',
            'is_main' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'integer',
            'duration' => 'nullable|string',
            'published_date' => 'required|date',
        ]);

        $data = $request->only(['title', 'description', 'youtube_url', 'is_main', 'is_active', 'order', 'duration', 'published_date']);
        
        // Extract YouTube ID from URL
        $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i';
        if (preg_match($pattern, $data['youtube_url'], $matches)) {
            $data['youtube_id'] = $matches[1];
        }

        // If this is set as main, unset other main videos
        if ($data['is_main']) {
            Video::where('is_main', true)->update(['is_main' => false]);
        }

        $video = Video::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Video created successfully',
            'data' => $video
        ], 201);
    }

    public function show(Video $video)
    {
        return response()->json([
            'success' => true,
            'data' => $video
        ]);
    }

    public function update(Request $request, Video $video)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'youtube_url' => 'required|url',
            'is_main' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'integer',
            'duration' => 'nullable|string',
            'published_date' => 'required|date',
        ]);

        $data = $request->only(['title', 'description', 'youtube_url', 'is_main', 'is_active', 'order', 'duration', 'published_date']);
        
        // Extract YouTube ID from URL
        $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i';
        if (preg_match($pattern, $data['youtube_url'], $matches)) {
            $data['youtube_id'] = $matches[1];
        }

        // If this is set as main, unset other main videos
        if ($data['is_main']) {
            Video::where('is_main', true)->where('id', '!=', $video->id)->update(['is_main' => false]);
        }

        $video->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Video updated successfully',
            'data' => $video
        ]);
    }

    public function destroy(Video $video)
    {
        $video->delete();

        return response()->json([
            'success' => true,
            'message' => 'Video deleted successfully'
        ]);
    }

    public function toggleStatus(Video $video)
    {
        $video->update(['is_active' => !$video->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Video status updated successfully',
            'data' => $video
        ]);
    }

    public function toggleMain(Video $video)
    {
        // Unset all other main videos
        Video::where('is_main', true)->update(['is_main' => false]);
        
        // Set this video as main
        $video->update(['is_main' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Video main status updated successfully',
            'data' => $video
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'videos' => 'required|array',
            'videos.*.id' => 'required|exists:videos,id',
            'videos.*.order' => 'required|integer',
        ]);

        foreach ($request->videos as $item) {
            Video::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Videos reordered successfully'
        ]);
    }
}
