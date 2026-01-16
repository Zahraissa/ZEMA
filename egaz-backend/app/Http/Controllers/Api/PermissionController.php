<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;

class PermissionController extends Controller
{
    /**
     * Display a listing of permissions.
     */
    public function index(): JsonResponse
    {
        try {
            $query = Permission::query();
            
            // Check if columns exist before ordering
            $columns = Schema::getColumnListing('permissions');
            
            if (in_array('group', $columns)) {
                $query->orderBy('group');
            }
            
            if (in_array('display_name', $columns)) {
                $query->orderBy('display_name');
            } else {
                $query->orderBy('name');
            }
            
            $permissions = $query->get();
            
            return response()->json([
                'success' => true,
                'data' => $permissions
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching permissions: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch permissions',
                'error' => $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    /**
     * Get permissions grouped by group.
     */
    public function grouped(): JsonResponse
    {
        try {
            $query = Permission::query();
            
            // Check if columns exist before ordering
            $columns = Schema::getColumnListing('permissions');
            
            if (in_array('group', $columns)) {
                $query->orderBy('group');
            }
            
            if (in_array('display_name', $columns)) {
                $query->orderBy('display_name');
            } else {
                $query->orderBy('name');
            }
            
            $permissions = $query->get();
            
            // Group by group field if it exists, otherwise group by category or name
            $groupByField = in_array('group', $columns) ? 'group' : (in_array('category', $columns) ? 'category' : 'name');
            $grouped = $permissions->groupBy($groupByField)->toArray();
            
            return response()->json([
                'success' => true,
                'data' => $grouped
            ]);
        } catch (\Exception $e) {
            \Log::error('Error grouping permissions: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to group permissions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get permission groups.
     */
    public function groups(): JsonResponse
    {
        try {
            $columns = \Schema::getColumnListing('permissions');
            
            // Use group column if it exists, otherwise use category
            $groupField = in_array('group', $columns) ? 'group' : 'category';
            
            $groups = Permission::select($groupField)
                ->distinct()
                ->whereNotNull($groupField)
                ->orderBy($groupField)
                ->pluck($groupField)
                ->values(); // Ensure it's a proper array, not an object
            
            return response()->json([
                'success' => true,
                'data' => $groups
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching permission groups: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch permission groups',
                'error' => $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    /**
     * Show a specific permission.
     */
    public function show(Permission $permission): JsonResponse
    {
        $permission->load('roles');

        return response()->json([
            'success' => true,
            'data' => $permission
        ]);
    }

    /**
     * Store a newly created permission.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:permissions,name',
                'display_name' => 'required|string',
                'description' => 'nullable|string',
                'group' => 'required|string'
            ]);

            $permission = Permission::create([
                'name' => $request->name,
                'slug' => \Str::slug($request->name),
                'display_name' => $request->display_name,
                'description' => $request->description,
                'group' => $request->group
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Permission created successfully',
                'data' => $permission
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create permission',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified permission.
     */
    public function update(Request $request, Permission $permission): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:permissions,name,' . $permission->id,
                'display_name' => 'required|string',
                'description' => 'nullable|string',
                'group' => 'required|string'
            ]);

            $permission->update([
                'name' => $request->name,
                'slug' => \Str::slug($request->name),
                'display_name' => $request->display_name,
                'description' => $request->description,
                'group' => $request->group
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Permission updated successfully',
                'data' => $permission
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update permission',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(Permission $permission): JsonResponse
    {
        try {
            $permission->delete();

            return response()->json([
                'success' => true,
                'message' => 'Permission deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete permission',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

