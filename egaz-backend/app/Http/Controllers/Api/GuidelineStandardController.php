<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GuidelineStandard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GuidelineStandardController extends Controller
{
    public function index()
    {
        $standards = GuidelineStandard::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $standards
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'group_id' => 'required|exists:guidelines_groups,id',
            'standard_type' => 'required|string|max:100',
            'maturity_level' => 'required|string|max:100',
            'version' => 'required|string|max:20',
            'status' => 'in:active,inactive,draft',
            'author' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'date_published' => 'required|date',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
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
                $filePath = $file->storeAs('guidelines-standards', $fileName, 'public');

                $data['file_path'] = $filePath;
                $data['file_name'] = $file->getClientOriginalName();
                $data['file_size'] = $file->getSize();
                $data['file_type'] = $file->getMimeType();
            }

            $standard = GuidelineStandard::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Guideline standard created successfully',
                'data' => $standard
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating guideline standard: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $standard = GuidelineStandard::active()->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $standard
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        
        if (empty($query)) {
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }

        $standards = GuidelineStandard::active()
            ->search($query)
            ->ordered()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $standards
        ]);
    }

    public function download($id)
    {
        $standard = GuidelineStandard::active()->findOrFail($id);

        // Check if file exists
        if (!$standard->file_path && !$standard->file_url) {
            return response()->json([
                'success' => false,
                'message' => 'File not available for download'
            ], 404);
        }

        // If file_url is provided and it's an external URL, redirect to it
        if ($standard->file_url && filter_var($standard->file_url, FILTER_VALIDATE_URL)) {
            return redirect($standard->file_url);
        }

        // If file_path exists, serve the file
        if ($standard->file_path) {
            // Check if file exists in storage
            if (Storage::disk('public')->exists($standard->file_path)) {
                $filePath = Storage::disk('public')->path($standard->file_path);
                $fileName = $standard->file_name ?: basename($standard->file_path);
                
                // Get file mime type
                $mimeType = mime_content_type($filePath);
                if (!$mimeType) {
                    // Fallback to application/pdf for PDF files
                    $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                    $mimeType = $extension === 'pdf' ? 'application/pdf' : 'application/octet-stream';
                }
                
                // Clear any output buffering to prevent corruption
                if (ob_get_level()) {
                    ob_end_clean();
                }
                
                // Read file contents as binary to ensure no encoding issues
                $fileContents = file_get_contents($filePath);
                $fileSize = filesize($filePath);
                
                // Return file download with proper headers
                return response($fileContents, 200)
                    ->header('Content-Type', $mimeType)
                    ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"')
                    ->header('Content-Length', $fileSize)
                    ->header('Content-Transfer-Encoding', 'binary');
            }
            
            // If file_path doesn't exist in storage, try to construct URL from file_url attribute
            if ($standard->fileUrl) {
                return redirect($standard->fileUrl);
            }
        }

        // If file_url is a relative path, construct full URL
        if ($standard->file_url && !filter_var($standard->file_url, FILTER_VALIDATE_URL)) {
            $fileUrl = asset('storage/' . $standard->file_url);
            return redirect($fileUrl);
        }

        return response()->json([
            'success' => false,
            'message' => 'File not found'
        ], 404);
    }

    public function update(Request $request, $id)
    {
        $standard = GuidelineStandard::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'group_id' => 'sometimes|required|exists:guidelines_groups,id',
            'standard_type' => 'sometimes|required|string|max:100',
            'maturity_level' => 'sometimes|required|string|max:100',
            'version' => 'sometimes|required|string|max:20',
            'status' => 'in:active,inactive,draft',
            'author' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'date_published' => 'sometimes|required|date',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
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
                if ($standard->file_path && Storage::exists($standard->file_path)) {
                    Storage::delete($standard->file_path);
                }

                $file = $request->file('file');
                $fileName = time() . '_' . Str::slug($request->title) . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('guidelines-standards', $fileName, 'public');

                $data['file_path'] = $filePath;
                $data['file_name'] = $file->getClientOriginalName();
                $data['file_size'] = $file->getSize();
                $data['file_type'] = $file->getMimeType();
            }

            $standard->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Guideline standard updated successfully',
                'data' => $standard
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating guideline standard: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $standard = GuidelineStandard::findOrFail($id);

        try {
            // Delete file if exists
            if ($standard->file_path && Storage::exists($standard->file_path)) {
                Storage::delete($standard->file_path);
            }

            $standard->delete();

            return response()->json([
                'success' => true,
                'message' => 'Guideline standard deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting guideline standard: ' . $e->getMessage()
            ], 500);
        }
    }
}
