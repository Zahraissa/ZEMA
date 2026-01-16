<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SampleTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SampleTemplateController extends Controller
{
    public function index()
    {
        $templates = SampleTemplate::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $templates
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'template_type' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'template_category' => 'nullable|string|max:100',
            'use_case' => 'nullable|string|max:255',
            'version' => 'required|string|max:20',
            'status' => 'in:active,inactive,draft',
            'author' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'date_published' => 'required|date',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => 'string|max:255',
            'estimated_time' => 'nullable|string|max:50',
            'complexity' => 'nullable|string|max:50',
            'featured' => 'boolean',
            'order' => 'integer|min:1',
            'file' => 'nullable|file|max:10240', // 10MB max
            'file_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();
            unset($data['file']);

            // Handle file upload
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '_' . Str::slug($request->title) . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('sample-templates', $fileName, 'public');

                $data['file_path'] = $filePath;
                $data['file_name'] = $file->getClientOriginalName();
                $data['file_size'] = $file->getSize();
                $data['file_type'] = $file->getMimeType();
            }

            $template = SampleTemplate::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Sample template created successfully',
                'data' => $template
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating sample template: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $template = SampleTemplate::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $template
        ]);
    }

    public function update(Request $request, $id)
    {
        $template = SampleTemplate::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'template_type' => 'sometimes|required|string|max:100',
            'category' => 'sometimes|required|string|max:100',
            'template_category' => 'nullable|string|max:100',
            'use_case' => 'nullable|string|max:255',
            'version' => 'sometimes|required|string|max:20',
            'status' => 'in:active,inactive,draft',
            'author' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'date_published' => 'sometimes|required|date',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => 'string|max:255',
            'estimated_time' => 'nullable|string|max:50',
            'complexity' => 'nullable|string|max:50',
            'featured' => 'boolean',
            'order' => 'integer|min:1',
            'file' => 'nullable|file|max:10240', // 10MB max
            'file_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();
            unset($data['file']);

            // Handle file upload
            if ($request->hasFile('file')) {
                // Delete old file if exists
                if ($template->file_path && Storage::exists($template->file_path)) {
                    Storage::delete($template->file_path);
                }

                $file = $request->file('file');
                $fileName = time() . '_' . Str::slug($request->title) . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('sample-templates', $fileName, 'public');

                $data['file_path'] = $filePath;
                $data['file_name'] = $file->getClientOriginalName();
                $data['file_size'] = $file->getSize();
                $data['file_type'] = $file->getMimeType();
            }

            $template->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Sample template updated successfully',
                'data' => $template
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating sample template: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $template = SampleTemplate::findOrFail($id);

        try {
            // Delete file if exists
            if ($template->file_path && Storage::exists($template->file_path)) {
                Storage::delete($template->file_path);
            }

            $template->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sample template deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting sample template: ' . $e->getMessage()
            ], 500);
        }
    }
}
