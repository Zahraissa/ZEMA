<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guideline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GuidelinesController extends Controller
{
    // Public routes for frontend
    public function index()
    {
        $guidelines = Guideline::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $guidelines
        ]);
    }

    public function mainDocument()
    {
        $mainDocument = Guideline::active()->mainDocument()->first();

        return response()->json([
            'success' => true,
            'data' => $mainDocument
        ]);
    }

    public function relatedDocuments()
    {
        $relatedDocuments = Guideline::active()
            ->where('is_main_document', false)
            ->ordered()
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $relatedDocuments
        ]);
    }

    public function categories()
    {
        $categories = Guideline::active()
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function documentTypes()
    {
        $documentTypes = Guideline::active()
            ->distinct()
            ->pluck('document_type')
            ->filter()
            ->values();

        return response()->json([
            'success' => true,
            'data' => $documentTypes
        ]);
    }

    public function byCategory($category)
    {
        $guidelines = Guideline::active()->byCategory($category)->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $guidelines
        ]);
    }

    public function byDocumentType($documentType)
    {
        $guidelines = Guideline::active()->byDocumentType($documentType)->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $guidelines
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->get('q');
        
        if (!$query) {
            return response()->json([
                'success' => false,
                'message' => 'Search query is required'
            ], 400);
        }

        $guidelines = Guideline::active()->search($query)->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $guidelines
        ]);
    }

    public function show($id)
    {
        $guideline = Guideline::findOrFail($id);
        
        // Increment view count
        $guideline->incrementViewCount();

        return response()->json([
            'success' => true,
            'data' => $guideline
        ]);
    }

    public function download($id)
    {
        $guideline = Guideline::findOrFail($id);
        
        // Check if file exists in storage
        if ($guideline->file_path && Storage::disk('public')->exists($guideline->file_path)) {
            // Increment download count
            $guideline->incrementDownloadCount();
            
            return Storage::disk('public')->download($guideline->file_path, $guideline->file_name);
        }
        
        // Check if file_url exists (external file)
        if ($guideline->file_url) {
            // Increment download count
            $guideline->incrementDownloadCount();
            
            // For external files, redirect to the file URL
            $fileUrl = $guideline->file_url;
            if (!str_starts_with($fileUrl, 'http')) {
                $fileUrl = asset($fileUrl);
            }
            
            return redirect($fileUrl);
        }
        
        // No file available
        return response()->json([
            'success' => false,
            'message' => 'File not found'
        ], 404);
    }

    // Management routes (protected)
    public function managementIndex(Request $request)
    {
        $query = Guideline::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by document type
        if ($request->has('document_type')) {
            $query->where('document_type', $request->document_type);
        }

        // Filter by main document
        if ($request->has('is_main_document')) {
            $query->where('is_main_document', $request->boolean('is_main_document'));
        }

        // Filter by featured
        if ($request->has('featured')) {
            $query->where('featured', $request->boolean('featured'));
        }

        // Search
        if ($request->has('search')) {
            $query->search($request->search);
        }

        $guidelines = $query->ordered()->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $guidelines
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'required|string|max:100',
            'document_type' => 'required|string|max:100',
            'version' => 'required|string|max:20',
            'date_published' => 'required|date',
            'status' => 'in:active,draft,archived',
            'author' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'is_main_document' => 'boolean',
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
                $filePath = $file->storeAs('guidelines', $fileName, 'public');

                $data['file_path'] = $filePath;
                $data['file_name'] = $file->getClientOriginalName();
                $data['file_size'] = $file->getSize();
                $data['file_type'] = $file->getMimeType();
            }

            // Set last_updated to current date
            $data['last_updated'] = now();

            // If this is set as main document, unset other main documents
            if ($data['is_main_document'] ?? false) {
                Guideline::where('is_main_document', true)->update(['is_main_document' => false]);
            }

            $guideline = Guideline::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Guideline created successfully',
                'data' => $guideline
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating guideline: ' . $e->getMessage()
            ], 500);
        }
    }

    public function showGuideline($id)
    {
        $guideline = Guideline::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $guideline
        ]);
    }

    public function update(Request $request, $id)
    {
        $guideline = Guideline::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'sometimes|required|string|max:100',
            'document_type' => 'sometimes|required|string|max:100',
            'version' => 'sometimes|required|string|max:20',
            'date_published' => 'sometimes|required|date',
            'status' => 'in:active,draft,archived',
            'author' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'is_main_document' => 'boolean',
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
                if ($guideline->file_path && Storage::exists($guideline->file_path)) {
                    Storage::delete($guideline->file_path);
                }

                $file = $request->file('file');
                $fileName = time() . '_' . Str::slug($request->title) . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('guidelines', $fileName, 'public');

                $data['file_path'] = $filePath;
                $data['file_name'] = $file->getClientOriginalName();
                $data['file_size'] = $file->getSize();
                $data['file_type'] = $file->getMimeType();
            }

            // Set last_updated to current date
            $data['last_updated'] = now();

            // If this is set as main document, unset other main documents
            if ($data['is_main_document'] ?? false) {
                Guideline::where('is_main_document', true)
                    ->where('id', '!=', $id)
                    ->update(['is_main_document' => false]);
            }

            $guideline->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Guideline updated successfully',
                'data' => $guideline
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating guideline: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $guideline = Guideline::findOrFail($id);

        try {
            // Delete file if exists
            if ($guideline->file_path && Storage::exists($guideline->file_path)) {
                Storage::delete($guideline->file_path);
            }

            $guideline->delete();

            return response()->json([
                'success' => true,
                'message' => 'Guideline deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting guideline: ' . $e->getMessage()
            ], 500);
        }
    }

    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'guidelines' => 'required|array',
            'guidelines.*.id' => 'required|exists:guidelines,id',
            'guidelines.*.order' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            foreach ($request->guidelines as $guidelineData) {
                Guideline::where('id', $guidelineData['id'])->update(['order' => $guidelineData['order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Guidelines reordered successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error reordering guidelines: ' . $e->getMessage()
            ], 500);
        }
    }

    public function toggleFeatured($id)
    {
        $guideline = Guideline::findOrFail($id);
        $guideline->update(['featured' => !$guideline->featured]);

        return response()->json([
            'success' => true,
            'message' => 'Guideline featured status updated successfully',
            'data' => $guideline
        ]);
    }

    public function toggleMainDocument($id)
    {
        $guideline = Guideline::findOrFail($id);
        
        // If setting as main document, unset others
        if (!$guideline->is_main_document) {
            Guideline::where('is_main_document', true)->update(['is_main_document' => false]);
        }
        
        $guideline->update(['is_main_document' => !$guideline->is_main_document]);

        return response()->json([
            'success' => true,
            'message' => 'Guideline main document status updated successfully',
            'data' => $guideline
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,draft,archived'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $guideline = Guideline::findOrFail($id);
        $guideline->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Guideline status updated successfully',
            'data' => $guideline
        ]);
    }

    public function statistics()
    {
        $stats = [
            'total' => Guideline::count(),
            'active' => Guideline::where('status', 'active')->count(),
            'draft' => Guideline::where('status', 'draft')->count(),
            'archived' => Guideline::where('status', 'archived')->count(),
            'main_documents' => Guideline::where('is_main_document', true)->count(),
            'featured' => Guideline::where('featured', true)->count(),
            'categories' => Guideline::distinct()->count('category'),
            'document_types' => Guideline::distinct()->count('document_type'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    public function incrementView($id)
    {
        $guideline = Guideline::findOrFail($id);
        $guideline->incrementViewCount();

        return response()->json([
            'success' => true,
            'message' => 'View count incremented successfully'
        ]);
    }

    public function incrementDownload($id)
    {
        $guideline = Guideline::findOrFail($id);
        $guideline->incrementDownloadCount();

        return response()->json([
            'success' => true,
            'message' => 'Download count incremented successfully'
        ]);
    }

    public function getMainDocuments()
    {
        $mainDocuments = Guideline::active()
            ->where('is_main_document', true)
            ->ordered()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $mainDocuments
        ]);
    }

    public function getRelatedDocuments()
    {
        $relatedDocuments = Guideline::active()
            ->where('is_main_document', false)
            ->ordered()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $relatedDocuments
        ]);
    }
}
