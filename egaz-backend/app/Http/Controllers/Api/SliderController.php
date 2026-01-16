<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SliderController extends Controller
{
    public function index()
    {
        $sliders = Slider::ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $sliders
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'badge' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:255',
            'has_video' => 'boolean',
            'order' => 'integer|min:1',
            'status' => 'in:active,inactive,draft',
            'is_active' => 'boolean',
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

        // Ensure boolean fields are properly converted
        // FormData sends '1'/'0' as strings, convert them to proper booleans
        if (isset($data['is_active'])) {
            $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
        }
        if (isset($data['has_video'])) {
            $data['has_video'] = filter_var($data['has_video'], FILTER_VALIDATE_BOOLEAN);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('sliders', 'public');
            $data['image_path'] = $imagePath;
        }

        $slider = Slider::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Slider created successfully',
            'data' => $slider
        ], 201);
    }

    public function show(Slider $slider)
    {
        return response()->json([
            'success' => true,
            'data' => $slider
        ]);
    }

    public function update(Request $request, Slider $slider)
    {
        // Debug logging
        \Log::info('Slider update request received', [
            'slider_id' => $slider->id,
            'request_data' => $request->all(),
            'request_method' => $request->method(),
            'has_file' => $request->hasFile('image'),
            'remove_image' => $request->has('remove_image')
        ]);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'badge' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:255',
            'has_video' => 'boolean',
            'order' => 'integer|min:1',
            'status' => 'in:active,inactive,draft',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'remove_image' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            \Log::error('Slider update validation failed', [
                'errors' => $validator->errors(),
                'slider_id' => $slider->id
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Ensure boolean fields are properly converted
        // FormData sends '1'/'0' as strings, convert them to proper booleans
        if (isset($data['is_active'])) {
            $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
        }
        if (isset($data['has_video'])) {
            $data['has_video'] = filter_var($data['has_video'], FILTER_VALIDATE_BOOLEAN);
        }

        // Handle image removal
        if ($request->has('remove_image') && $request->remove_image == '1') {
            if ($slider->image_path) {
                Storage::disk('public')->delete($slider->image_path);
                $data['image_path'] = null;
                \Log::info('Slider image removed', [
                    'slider_id' => $slider->id,
                    'old_image_path' => $slider->image_path
                ]);
            }
        }
        // Handle image upload
        else if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($slider->image_path) {
                Storage::disk('public')->delete($slider->image_path);
                \Log::info('Old slider image deleted', [
                    'slider_id' => $slider->id,
                    'old_image_path' => $slider->image_path
                ]);
            }
            
            $imagePath = $request->file('image')->store('sliders', 'public');
            $data['image_path'] = $imagePath;
            \Log::info('New slider image uploaded', [
                'slider_id' => $slider->id,
                'new_image_path' => $imagePath
            ]);
        }

        $slider->update($data);

        \Log::info('Slider updated successfully', [
            'slider_id' => $slider->id,
            'updated_data' => $data
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Slider updated successfully',
            'data' => $slider->fresh() // Get fresh data from database
        ]);
    }

    public function destroy(Slider $slider)
    {
        // Delete image if exists
        if ($slider->image_path) {
            Storage::disk('public')->delete($slider->image_path);
        }

        $slider->delete();

        return response()->json([
            'success' => true,
            'message' => 'Slider deleted successfully'
        ]);
    }

    public function active()
    {
        $sliders = Slider::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $sliders
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'sliders' => 'required|array',
            'sliders.*.id' => 'required|exists:sliders,id',
            'sliders.*.order' => 'required|integer|min:1'
        ]);

        foreach ($request->sliders as $sliderData) {
            Slider::where('id', $sliderData['id'])->update(['order' => $sliderData['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Sliders reordered successfully'
        ]);
    }
}
