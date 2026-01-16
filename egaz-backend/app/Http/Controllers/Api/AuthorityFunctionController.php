<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuthorityFunction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthorityFunctionController extends Controller
{
    public function index(Request $request)
    {
        $query = AuthorityFunction::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $functions = $query->ordered()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $functions
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string|max:255',
            'additional_data' => 'nullable|array',
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

        $data = $validator->validated();

        $function = AuthorityFunction::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Authority function created successfully',
            'data' => $function
        ], 201);
    }

    public function show(AuthorityFunction $authorityFunction)
    {
        return response()->json([
            'success' => true,
            'data' => $authorityFunction
        ]);
    }

    public function update(Request $request, AuthorityFunction $authorityFunction)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'icon' => 'nullable|string|max:255',
            'additional_data' => 'nullable|array',
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

        $data = $validator->validated();

        $authorityFunction->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Authority function updated successfully',
            'data' => $authorityFunction
        ]);
    }

    public function destroy(AuthorityFunction $authorityFunction)
    {
        $authorityFunction->delete();

        return response()->json([
            'success' => true,
            'message' => 'Authority function deleted successfully'
        ]);
    }

    public function active()
    {
        $functions = AuthorityFunction::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $functions
        ]);
    }

    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'functions' => 'required|array',
            'functions.*.id' => 'required|exists:authority_functions,id',
            'functions.*.order' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        foreach ($request->functions as $functionData) {
            AuthorityFunction::where('id', $functionData['id'])
                ->update(['order' => $functionData['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Functions reordered successfully'
        ]);
    }

    public function toggleStatus(AuthorityFunction $authorityFunction)
    {
        $authorityFunction->update([
            'status' => $authorityFunction->status === 'active' ? 'inactive' : 'active'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Function status updated successfully',
            'data' => $authorityFunction
        ]);
    }
}
