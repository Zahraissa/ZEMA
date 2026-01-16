<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GuidelinesGroup;
use App\Models\GuidelineStandard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GuidelinesGroupController extends Controller
{
    public function index()
    {
        $groups = GuidelinesGroup::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $groups
        ]);
    }

    /**
     * Get groups with their standards organized (for hierarchical display)
     * Returns groups with main document (featured or first) and related documents
     */
    public function withStandards()
    {
        $groups = GuidelinesGroup::active()
            ->ordered()
            ->with(['standards' => function($query) {
                $query->where('status', 'active')->ordered();
            }])
            ->get()
            ->map(function($group) {
                $standards = $group->standards;
                
                // Find main document (featured or first)
                $mainDocument = $standards->where('featured', true)->first() 
                    ?? $standards->first();
                
                // Get related documents (all except main document)
                $relatedDocuments = $standards->filter(function($standard) use ($mainDocument) {
                    return $mainDocument && $standard->id !== $mainDocument->id;
                })->values();

                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'description' => $group->description,
                    'order' => $group->order,
                    'main_document' => $mainDocument,
                    'related_documents' => $relatedDocuments,
                    'total_documents' => $standards->count()
                ];
            })
            ->filter(function($group) {
                // Only return groups that have at least one standard
                return $group['total_documents'] > 0;
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $groups
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:active,inactive',
            'order' => 'integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $group = GuidelinesGroup::create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Guidelines group created successfully',
                'data' => $group
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating guidelines group: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $group = GuidelinesGroup::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $group
        ]);
    }

    public function update(Request $request, $id)
    {
        $group = GuidelinesGroup::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:active,inactive',
            'order' => 'integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $group->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Guidelines group updated successfully',
                'data' => $group
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating guidelines group: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $group = GuidelinesGroup::findOrFail($id);

        try {
            $group->delete();

            return response()->json([
                'success' => true,
                'message' => 'Guidelines group deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting guidelines group: ' . $e->getMessage()
            ], 500);
        }
    }
}
