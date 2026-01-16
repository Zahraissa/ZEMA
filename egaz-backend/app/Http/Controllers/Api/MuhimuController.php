<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Video;
use App\Models\Download;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MuhimuController extends Controller
{
    public function index()
    {
        try {
            // Get announcements (limit to 4)
            $announcements = Announcement::active()
                ->ordered()
                ->limit(4)
                ->get()
                ->map(function ($announcement) {
                    return [
                        'id' => $announcement->id,
                        'title' => $announcement->title,
                        'published' => $announcement->published_date->diffForHumans(),
                        'file_url' => $announcement->file_url,
                        'file_name' => $announcement->file_name,
                    ];
                });

            // Get main video and other videos
            $mainVideo = Video::active()->main()->ordered()->first();
            $otherVideos = Video::active()
                ->where('is_main', false)
                ->ordered()
                ->limit(2)
                ->get();

            $videos = collect();
            
            if ($mainVideo) {
                $videos->push([
                    'id' => $mainVideo->id,
                    'title' => $mainVideo->title,
                    'youtube_url' => $mainVideo->youtube_url,
                    'youtube_id' => $mainVideo->youtube_id,
                    'thumbnail_url' => $mainVideo->thumbnail_url,
                    'is_main' => true,
                    'duration' => $mainVideo->duration,
                ]);
            }

            $videos = $videos->merge($otherVideos->map(function ($video) {
                return [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'youtube_url' => $video->youtube_url,
                    'youtube_id' => $video->youtube_id,
                    'thumbnail_url' => $video->thumbnail_url,
                    'is_main' => false,
                    'duration' => $video->duration,
                ];
            }));

            // Get downloads (limit to 4)
            $downloads = Download::active()
                ->ordered()
                ->limit(4)
                ->get()
                ->map(function ($download) {
                    return [
                        'id' => $download->id,
                        'title' => $download->title,
                        'published' => $download->published_date->diffForHumans(),
                        'file_url' => $download->file_url,
                        'file_name' => $download->file_name,
                        'file_size' => $download->file_size,
                        'file_type' => $download->file_type,
                        'download_count' => $download->download_count,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'announcements' => $announcements,
                    'videos' => $videos,
                    'downloads' => $downloads,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching muhimu data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function incrementDownload($id)
    {
        try {
            $download = Download::findOrFail($id);
            $download->incrementDownloadCount();
            
            return response()->json([
                'success' => true,
                'message' => 'Download count incremented successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error incrementing download count: ' . $e->getMessage()
            ], 500);
        }
    }
}
