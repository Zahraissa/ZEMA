<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $galleries
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:1',
            'status' => 'nullable|in:active,inactive,draft',
            'is_active' => 'nullable|in:true,false,1,0',
            'featured' => 'nullable|in:true,false,1,0',
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Process boolean fields
        if (isset($data['is_active'])) {
            $data['is_active'] = in_array($data['is_active'], ['true', '1', true, 1], true);
        }
        if (isset($data['featured'])) {
            $data['featured'] = in_array($data['featured'], ['true', '1', true, 1], true);
        }

        // Set default values if not provided
        if (!isset($data['order'])) {
            $data['order'] = 1;
        }
        if (!isset($data['status'])) {
            $data['status'] = 'active';
        }
        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }
        if (!isset($data['featured'])) {
            $data['featured'] = false;
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('gallery', 'public');
            $data['image_path'] = $imagePath;
        }

        $gallery = Gallery::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Gallery item created successfully',
            'data' => $gallery
        ], 201);
    }

    public function show(Gallery $gallery)
    {
        return response()->json([
            'success' => true,
            'data' => $gallery
        ]);
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:1',
            'status' => 'nullable|in:active,inactive,draft',
            'is_active' => 'nullable|in:true,false,1,0',
            'featured' => 'nullable|in:true,false,1,0',
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Process boolean fields
        if (isset($data['is_active'])) {
            $data['is_active'] = in_array($data['is_active'], ['true', '1', true, 1], true);
        }
        if (isset($data['featured'])) {
            $data['featured'] = in_array($data['featured'], ['true', '1', true, 1], true);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($gallery->image_path) {
                Storage::disk('public')->delete($gallery->image_path);
            }
            
            $imagePath = $request->file('image')->store('gallery', 'public');
            $data['image_path'] = $imagePath;
        }

        $gallery->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Gallery item updated successfully',
            'data' => $gallery->fresh()
        ]);
    }

    public function destroy(Gallery $gallery)
    {
        // Delete image if exists
        if ($gallery->image_path) {
            Storage::disk('public')->delete($gallery->image_path);
        }

        $gallery->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery item deleted successfully'
        ]);
    }

    public function active()
    {
        $galleries = Gallery::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $galleries
        ]);
    }

    public function featured()
    {
        $galleries = Gallery::active()->featured()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $galleries
        ]);
    }

    public function categories()
    {
        $categories = Gallery::distinct()->pluck('category')->filter()->values();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function byCategory($category)
    {
        $galleries = Gallery::active()->byCategory($category)->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $galleries
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'galleries' => 'required|array',
            'galleries.*.id' => 'required|exists:galleries,id',
            'galleries.*.order' => 'required|integer|min:1'
        ]);

        foreach ($request->galleries as $item) {
            Gallery::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Gallery order updated successfully'
        ]);
    }

    public function toggleStatus(Gallery $gallery)
    {
        $gallery->update([
            'is_active' => !$gallery->is_active
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Gallery status updated successfully',
            'data' => $gallery->fresh()
        ]);
    }

    public function toggleFeatured(Gallery $gallery)
    {
        $gallery->update([
            'featured' => !$gallery->featured
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Gallery featured status updated successfully',
            'data' => $gallery->fresh()
        ]);
    }
}
