<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DirectorGeneral;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DirectorGeneralController extends Controller
{
    public function index(Request $request)
    {
        $query = DirectorGeneral::query();

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
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
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
            $imagePath = $request->file('image')->store('director-general', 'public');
            $data['image_path'] = $imagePath;
        }

        $content = DirectorGeneral::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Director General content created successfully',
            'data' => $content
        ], 201);
    }

    public function show(DirectorGeneral $directorGeneral)
    {
        return response()->json([
            'success' => true,
            'data' => $directorGeneral
        ]);
    }

    public function update(Request $request, DirectorGeneral $directorGeneral)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'title' => 'sometimes|required|string|max:255',
            'message' => 'sometimes|required|string',
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
            if ($directorGeneral->image_path) {
                Storage::disk('public')->delete($directorGeneral->image_path);
            }
            
            $imagePath = $request->file('image')->store('director-general', 'public');
            $data['image_path'] = $imagePath;
        }

        $directorGeneral->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Director General content updated successfully',
            'data' => $directorGeneral
        ]);
    }

    public function destroy(DirectorGeneral $directorGeneral)
    {
        // Delete image if exists
        if ($directorGeneral->image_path) {
            Storage::disk('public')->delete($directorGeneral->image_path);
        }

        $directorGeneral->delete();

        return response()->json([
            'success' => true,
            'message' => 'Director General content deleted successfully'
        ]);
    }

    public function active()
    {
        $content = DirectorGeneral::active()->ordered()->first();

        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.id' => 'required|exists:director_general,id',
            'items.*.order' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        foreach ($request->items as $item) {
            DirectorGeneral::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully'
        ]);
    }
}
