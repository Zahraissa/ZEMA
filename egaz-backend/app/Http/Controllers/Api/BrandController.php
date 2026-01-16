<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $query = Brand::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $brands = $query->ordered()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $brands
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'website_url' => 'nullable|url|max:255',
            'status' => 'in:active,inactive',
            'order' => 'integer|min:1',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('brands', 'public');
            $data['logo_path'] = $logoPath;
        }

        $brand = Brand::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Brand created successfully',
            'data' => $brand
        ], 201);
    }

    public function show(Brand $brand)
    {
        return response()->json([
            'success' => true,
            'data' => $brand
        ]);
    }

    public function update(Request $request, Brand $brand)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'website_url' => 'nullable|url|max:255',
            'status' => 'in:active,inactive',
            'order' => 'integer|min:1',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($brand->logo_path) {
                Storage::disk('public')->delete($brand->logo_path);
            }
            
            $logoPath = $request->file('logo')->store('brands', 'public');
            $data['logo_path'] = $logoPath;
        }

        $brand->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Brand updated successfully',
            'data' => $brand
        ]);
    }

    public function destroy(Brand $brand)
    {
        // Delete logo if exists
        if ($brand->logo_path) {
            Storage::disk('public')->delete($brand->logo_path);
        }

        $brand->delete();

        return response()->json([
            'success' => true,
            'message' => 'Brand deleted successfully'
        ]);
    }

    public function active()
    {
        $brands = Brand::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $brands
        ]);
    }

    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'brands' => 'required|array',
            'brands.*.id' => 'required|exists:brands,id',
            'brands.*.order' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        foreach ($request->brands as $brandData) {
            Brand::where('id', $brandData['id'])->update(['order' => $brandData['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Brands reordered successfully'
        ]);
    }
}
