<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BandMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BandMemberController extends Controller
{
    public function index(Request $request)
    {
        $query = BandMember::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%");
            });
        }

        $members = $query->ordered()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $members
        ]);
    }

    public function store(Request $request)
    {
        // Debug: Log request data
        \Log::info('BandMember store request', [
            'all_data' => $request->all(),
            'has_file' => $request->hasFile('image'),
            'files' => $request->allFiles()
        ]);
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'social_facebook' => 'nullable|url|max:255',
            'social_twitter' => 'nullable|url|max:255',
            'social_instagram' => 'nullable|url|max:255',
            'social_linkedin' => 'nullable|url|max:255',
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
            \Log::info('Processing image upload', [
                'original_name' => $request->file('image')->getClientOriginalName(),
                'size' => $request->file('image')->getSize(),
                'mime_type' => $request->file('image')->getMimeType()
            ]);
            
            $imagePath = $request->file('image')->store('band-members', 'public');
            $data['image_path'] = $imagePath;
            
            \Log::info('Image stored successfully', [
                'path' => $imagePath,
                'full_path' => storage_path('app/public/' . $imagePath)
            ]);
        } else {
            \Log::info('No image file in request');
        }

        $member = BandMember::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Band member created successfully',
            'data' => $member
        ], 201);
    }

    public function show(BandMember $bandMember)
    {
        return response()->json([
            'success' => true,
            'data' => $bandMember
        ]);
    }

    public function update(Request $request, BandMember $bandMember)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|required|string|max:255',
            'social_facebook' => 'nullable|url|max:255',
            'social_twitter' => 'nullable|url|max:255',
            'social_instagram' => 'nullable|url|max:255',
            'social_linkedin' => 'nullable|url|max:255',
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
            if ($bandMember->image_path) {
                Storage::disk('public')->delete($bandMember->image_path);
            }
            
            $imagePath = $request->file('image')->store('band-members', 'public');
            $data['image_path'] = $imagePath;
        }

        $bandMember->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Band member updated successfully',
            'data' => $bandMember
        ]);
    }

    public function destroy(BandMember $bandMember)
    {
        // Delete image if exists
        if ($bandMember->image_path) {
            Storage::disk('public')->delete($bandMember->image_path);
        }

        $bandMember->delete();

        return response()->json([
            'success' => true,
            'message' => 'Band member deleted successfully'
        ]);
    }

    public function active()
    {
        $members = BandMember::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $members
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'members' => 'required|array',
            'members.*.id' => 'required|exists:band_members,id',
            'members.*.order' => 'required|integer|min:1'
        ]);

        foreach ($request->members as $memberData) {
            BandMember::where('id', $memberData['id'])->update(['order' => $memberData['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Band members reordered successfully'
        ]);
    }
}
