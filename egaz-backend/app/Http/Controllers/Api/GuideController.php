<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GuideController extends Controller
{
    // Public routes for frontend
    public function active()
    {
        $guides = Guide::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $guides
        ]);
    }

    public function featured()
    {
        $guides = Guide::active()->featured()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $guides
        ]);
    }

    public function categories()
    {
        $categories = Guide::active()
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function byCategory($category)
    {
        $guides = Guide::active()->byCategory($category)->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $guides
        ]);
    }

    public function show($id)
    {
        $guide = Guide::findOrFail($id);
        
        // Increment view count
        $guide->incrementViewCount();

        return response()->json([
            'success' => true,
            'data' => $guide
        ]);
    }

    public function download($id)
    {
        $guide = Guide::findOrFail($id);
        
        if (!$guide->file_path || !Storage::exists($guide->file_path)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found'
            ], 404);
        }

        // Increment download count
        $guide->incrementDownloadCount();

        return Storage::download($guide->file_path, $guide->file_name);
    }

    // Management routes (protected)
    public function index(Request $request)
    {
        $query = Guide::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by featured
        if ($request->has('featured')) {
            $query->where('featured', $request->boolean('featured'));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
            });
        }

        $guides = $query->ordered()->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $guides
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'required|string|max:100',
            'status' => 'in:active,inactive,draft',
            'order' => 'integer|min:1',
            'author' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'featured' => 'boolean',
            'file' => 'nullable|file|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();
            unset($data['file']);

            // Handle file upload
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '_' . Str::slug($request->title) . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('guides', $fileName, 'public');

                $data['file_path'] = $filePath;
                $data['file_name'] = $file->getClientOriginalName();
                $data['file_size'] = $file->getSize();
                $data['file_type'] = $file->getMimeType();
            }

            $guide = Guide::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Guide created successfully',
                'data' => $guide
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating guide: ' . $e->getMessage()
            ], 500);
        }
    }

    public function showGuide($id)
    {
        $guide = Guide::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $guide
        ]);
    }

    public function update(Request $request, $id)
    {
        $guide = Guide::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'sometimes|required|string|max:100',
            'status' => 'in:active,inactive,draft',
            'order' => 'integer|min:1',
            'author' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'featured' => 'boolean',
            'file' => 'nullable|file|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();
            unset($data['file']);

            // Handle file upload
            if ($request->hasFile('file')) {
                // Delete old file if exists
                if ($guide->file_path && Storage::exists($guide->file_path)) {
                    Storage::delete($guide->file_path);
                }

                $file = $request->file('file');
                $fileName = time() . '_' . Str::slug($request->title) . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('guides', $fileName, 'public');

                $data['file_path'] = $filePath;
                $data['file_name'] = $file->getClientOriginalName();
                $data['file_size'] = $file->getSize();
                $data['file_type'] = $file->getMimeType();
            }

            $guide->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Guide updated successfully',
                'data' => $guide
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating guide: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $guide = Guide::findOrFail($id);

        try {
            // Delete file if exists
            if ($guide->file_path && Storage::exists($guide->file_path)) {
                Storage::delete($guide->file_path);
            }

            $guide->delete();

            return response()->json([
                'success' => true,
                'message' => 'Guide deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting guide: ' . $e->getMessage()
            ], 500);
        }
    }

    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'guides' => 'required|array',
            'guides.*.id' => 'required|exists:guides,id',
            'guides.*.order' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            foreach ($request->guides as $guideData) {
                Guide::where('id', $guideData['id'])->update(['order' => $guideData['order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Guides reordered successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error reordering guides: ' . $e->getMessage()
            ], 500);
        }
    }

    public function toggleFeatured($id)
    {
        $guide = Guide::findOrFail($id);
        $guide->update(['featured' => !$guide->featured]);

        return response()->json([
            'success' => true,
            'message' => 'Guide featured status updated successfully',
            'data' => $guide
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,inactive,draft'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $guide = Guide::findOrFail($id);
        $guide->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Guide status updated successfully',
            'data' => $guide
        ]);
    }
}
