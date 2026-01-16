<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WebsiteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class WebsiteServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            \Log::info('WebsiteService index request received', [
                'method' => $request->method(),
                'url' => $request->url(),
                'headers' => $request->headers->all(),
                'query' => $request->query()
            ]);
            $query = WebsiteService::query();

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('featured')) {
                $query->where('featured', $request->boolean('featured'));
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('front_title', 'like', "%{$search}%")
                      ->orWhere('back_title', 'like', "%{$search}%")
                      ->orWhere('front_description', 'like', "%{$search}%")
                      ->orWhere('back_description', 'like', "%{$search}%");
                });
            }

            // Apply ordering
            $query->ordered();

            // Pagination
            $perPage = $request->get('per_page', 15);
            $websiteServices = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Website services retrieved successfully',
                'data' => $websiteServices
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve website services',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display active website services for public access.
     */
    public function getActiveServices()
    {
        try {
            $websiteServices = WebsiteService::active()
                ->ordered()
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Active website services retrieved successfully',
                'data' => $websiteServices
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve active website services',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            \Log::info('WebsiteService store request received', [
                'method' => $request->method(),
                'url' => $request->url(),
                'headers' => $request->headers->all(),
                'data' => $request->all()
            ]);
            $validator = Validator::make($request->all(), [
                'front_icon' => 'nullable|string|max:255',
                'front_title' => 'required|string|max:255',
                'front_description' => 'required|string',
                'back_title' => 'required|string|max:255',
                'back_description' => 'required|string',
                'back_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'link' => 'nullable|string|max:255',
                'order' => 'nullable|integer|min:0',
                'status' => ['nullable', Rule::in(['active', 'inactive', 'draft'])],
                'is_active' => 'nullable|string|in:true,false,1,0',
                'featured' => 'nullable|string|in:true,false,1,0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            // Handle image upload
            if ($request->hasFile('back_image')) {
                $imagePath = $request->file('back_image')->store('website-services', 'public');
                $data['back_image'] = $imagePath;
            }

            // Set default values
            $data['created_by'] = Auth::id();
            $data['status'] = $data['status'] ?? 'active';
            $data['is_active'] = filter_var($data['is_active'] ?? 'true', FILTER_VALIDATE_BOOLEAN);
            $data['featured'] = filter_var($data['featured'] ?? 'false', FILTER_VALIDATE_BOOLEAN);
            $data['order'] = $data['order'] ?? 0;

            $websiteService = WebsiteService::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Website service created successfully',
                'data' => $websiteService
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create website service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $websiteService = WebsiteService::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Website service retrieved successfully',
                'data' => $websiteService
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Website service not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            \Log::info('WebsiteService update request received', [
                'id' => $id,
                'method' => $request->method(),
                'url' => $request->url(),
                'headers' => $request->headers->all(),
                'data' => $request->all()
            ]);
            $websiteService = WebsiteService::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'front_icon' => 'nullable|string|max:255',
                'front_title' => 'sometimes|required|string|max:255',
                'front_description' => 'sometimes|required|string',
                'back_title' => 'sometimes|required|string|max:255',
                'back_description' => 'sometimes|required|string',
                'back_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'link' => 'nullable|string|max:255',
                'order' => 'nullable|integer|min:0',
                'status' => ['nullable', Rule::in(['active', 'inactive', 'draft'])],
                'is_active' => 'nullable|string|in:true,false,1,0',
                'featured' => 'nullable|string|in:true,false,1,0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            // Handle image upload
            if ($request->hasFile('back_image')) {
                // Delete old image if exists
                if ($websiteService->back_image) {
                    Storage::disk('public')->delete($websiteService->back_image);
                }
                
                $imagePath = $request->file('back_image')->store('website-services', 'public');
                $data['back_image'] = $imagePath;
            }

            $data['updated_by'] = Auth::id();
            
            // Handle boolean values
            if (isset($data['is_active'])) {
                $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
            }
            if (isset($data['featured'])) {
                $data['featured'] = filter_var($data['featured'], FILTER_VALIDATE_BOOLEAN);
            }

            $websiteService->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Website service updated successfully',
                'data' => $websiteService->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update website service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $websiteService = WebsiteService::findOrFail($id);

            // Delete image if exists
            if ($websiteService->back_image) {
                Storage::disk('public')->delete($websiteService->back_image);
            }

            $websiteService->delete();

            return response()->json([
                'success' => true,
                'message' => 'Website service deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete website service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the order of website services.
     */
    public function updateOrder(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'services' => 'required|array',
                'services.*.id' => 'required|exists:website_services,id',
                'services.*.order' => 'required|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            foreach ($request->services as $service) {
                WebsiteService::where('id', $service['id'])
                    ->update(['order' => $service['order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Website services order updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update website services order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle the active status of a website service.
     */
    public function toggleStatus($id)
    {
        try {
            $websiteService = WebsiteService::findOrFail($id);
            $websiteService->update([
                'is_active' => !$websiteService->is_active,
                'updated_by' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Website service status toggled successfully',
                'data' => $websiteService->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle website service status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle the featured status of a website service.
     */
    public function toggleFeatured($id)
    {
        try {
            $websiteService = WebsiteService::findOrFail($id);
            $websiteService->update([
                'featured' => !$websiteService->featured,
                'updated_by' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Website service featured status toggled successfully',
                'data' => $websiteService->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle website service featured status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
