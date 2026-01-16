<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AboutController extends Controller
{
    public function index(Request $request)
    {
        $query = AboutContent::query();

        // Filter by section
        if ($request->has('section')) {
            $query->bySection($request->section);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $content = $query->ordered()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'section' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image_path' => 'nullable|string|max:255',
            'additional_data' => 'nullable|array',
            'status' => 'in:active,inactive',
            'order' => 'integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('about', 'public');
            $data['image_path'] = $imagePath;
        }

        $content = AboutContent::create($data);

        return response()->json([
            'success' => true,
            'message' => 'About content created successfully',
            'data' => $content
        ], 201);
    }

    public function show(AboutContent $about)
    {
        return response()->json([
            'success' => true,
            'data' => $about
        ]);
    }

    public function update(Request $request, AboutContent $about)
    {
        $validator = Validator::make($request->all(), [
            'section' => 'sometimes|required|string|max:255',
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'image_path' => 'nullable|string|max:255',
            'additional_data' => 'nullable|array',
            'status' => 'in:active,inactive',
            'order' => 'integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($about->image_path) {
                Storage::disk('public')->delete($about->image_path);
            }
            
            $imagePath = $request->file('image')->store('about', 'public');
            $data['image_path'] = $imagePath;
        }

        $about->update($data);

        return response()->json([
            'success' => true,
            'message' => 'About content updated successfully',
            'data' => $about
        ]);
    }

    public function destroy(AboutContent $about)
    {
        // Delete image if exists
        if ($about->image_path) {
            Storage::disk('public')->delete($about->image_path);
        }

        $about->delete();

        return response()->json([
            'success' => true,
            'message' => 'About content deleted successfully'
        ]);
    }

    public function active()
    {
        $content = AboutContent::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    public function bySection($section)
    {
        $content = AboutContent::active()->bySection($section)->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    public function sections()
    {
        $sections = AboutContent::distinct()->pluck('section')->filter()->values();

        return response()->json([
            'success' => true,
            'data' => $sections
        ]);
    }
}
