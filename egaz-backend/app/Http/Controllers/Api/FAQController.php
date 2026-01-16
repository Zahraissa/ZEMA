<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FAQ;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class FAQController extends Controller
{
    /**
     * Display a listing of FAQs with optional filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = FAQ::with(['creator', 'updater']);

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        if ($request->has('isActive')) {
            $isActive = filter_var($request->isActive, FILTER_VALIDATE_BOOLEAN);
            $query->where('is_active', $isActive);
        }

        // Pagination
        $perPage = $request->get('limit', 15);
        $page = $request->get('page', 1);

        $faqs = $query->ordered()->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $faqs->items(),
            'total' => $faqs->total(),
            'page' => $faqs->currentPage(),
            'limit' => $faqs->perPage(),
            'totalPages' => $faqs->lastPage(),
            'message' => 'FAQs retrieved successfully'
        ]);
    }

    /**
     * Store a newly created FAQ
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'question' => 'required|string|max:1000',
            'answer' => 'required|string|max:10000',
            'category' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'order' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $faq = FAQ::create([
            'question' => $request->question,
            'answer' => $request->answer,
            'category' => $request->category,
            'is_active' => $request->get('is_active', true),
            'order' => $request->get('order', 0),
            'created_by' => Auth::id(),
            'updated_by' => Auth::id()
        ]);

        $faq->load(['creator', 'updater']);

        return response()->json([
            'data' => $faq,
            'message' => 'FAQ created successfully'
        ], 201);
    }

    /**
     * Display the specified FAQ
     */
    public function show(FAQ $faq): JsonResponse
    {
        $faq->load(['creator', 'updater']);

        return response()->json([
            'data' => $faq,
            'message' => 'FAQ retrieved successfully'
        ]);
    }

    /**
     * Update the specified FAQ
     */
    public function update(Request $request, FAQ $faq): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'question' => 'sometimes|required|string|max:1000',
            'answer' => 'sometimes|required|string|max:10000',
            'category' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'order' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $faq->update([
            'question' => $request->get('question', $faq->question),
            'answer' => $request->get('answer', $faq->answer),
            'category' => $request->get('category', $faq->category),
            'is_active' => $request->get('is_active', $faq->is_active),
            'order' => $request->get('order', $faq->order),
            'updated_by' => Auth::id()
        ]);

        $faq->load(['creator', 'updater']);

        return response()->json([
            'data' => $faq,
            'message' => 'FAQ updated successfully'
        ]);
    }

    /**
     * Remove the specified FAQ
     */
    public function destroy(FAQ $faq): JsonResponse
    {
        $faq->delete();

        return response()->json([
            'message' => 'FAQ deleted successfully'
        ]);
    }

    /**
     * Get active FAQs for public display
     */
    public function active(): JsonResponse
    {
        $faqs = FAQ::active()->ordered()->get();

        return response()->json([
            'data' => $faqs,
            'message' => 'Active FAQs retrieved successfully'
        ]);
    }

    /**
     * Toggle FAQ active status
     */
    public function toggleStatus(FAQ $faq): JsonResponse
    {
        $faq->update([
            'is_active' => !$faq->is_active,
            'updated_by' => Auth::id()
        ]);

        $faq->load(['creator', 'updater']);

        return response()->json([
            'data' => $faq,
            'message' => 'FAQ status updated successfully'
        ]);
    }

    /**
     * Get FAQ categories
     */
    public function categories(): JsonResponse
    {
        $categories = FAQ::whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return response()->json([
            'data' => $categories,
            'message' => 'Categories retrieved successfully'
        ]);
    }

    /**
     * Search FAQs
     */
    public function search(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'q' => 'required|string|min:2'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $faqs = FAQ::search($request->q)
            ->active()
            ->ordered()
            ->get();

        return response()->json([
            'data' => $faqs,
            'message' => 'Search results retrieved successfully'
        ]);
    }

    /**
     * Get FAQs by category
     */
    public function byCategory(string $category): JsonResponse
    {
        $faqs = FAQ::byCategory($category)
            ->active()
            ->ordered()
            ->get();

        return response()->json([
            'data' => $faqs,
            'message' => 'FAQs by category retrieved successfully'
        ]);
    }

    /**
     * Bulk update status
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:faqs,id',
            'is_active' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        FAQ::whereIn('id', $request->ids)->update([
            'is_active' => $request->is_active,
            'updated_by' => Auth::id()
        ]);

        return response()->json([
            'message' => 'FAQs status updated successfully'
        ]);
    }

    /**
     * Bulk delete FAQs
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:faqs,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        FAQ::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => 'FAQs deleted successfully'
        ]);
    }

    /**
     * Get FAQ analytics
     */
    public function analytics(): JsonResponse
    {
        $totalFAQs = FAQ::count();
        $activeFAQs = FAQ::active()->count();
        $inactiveFAQs = FAQ::inactive()->count();

        $categories = FAQ::whereNotNull('category')
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->category,
                    'count' => $item->count
                ];
            });

        $recentActivity = FAQ::selectRaw('DATE(created_at) as date, count(*) as count')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'count' => $item->count
                ];
            });

        return response()->json([
            'data' => [
                'totalFAQs' => $totalFAQs,
                'activeFAQs' => $activeFAQs,
                'inactiveFAQs' => $inactiveFAQs,
                'categories' => $categories,
                'recentActivity' => $recentActivity
            ],
            'message' => 'Analytics retrieved successfully'
        ]);
    }

    /**
     * Export FAQs
     */
    public function export(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'format' => Rule::in(['json', 'csv'])
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $faqs = FAQ::with(['creator', 'updater'])->ordered()->get();

        $format = $request->get('format', 'json');

        if ($format === 'csv') {
            // Generate CSV
            $csv = "ID,Question,Answer,Category,Active,Order,Created At,Updated At\n";
            foreach ($faqs as $faq) {
                $csv .= sprintf(
                    "%d,\"%s\",\"%s\",\"%s\",%s,%d,%s,%s\n",
                    $faq->id,
                    str_replace('"', '""', $faq->question),
                    str_replace('"', '""', $faq->answer),
                    str_replace('"', '""', $faq->category ?? ''),
                    $faq->is_active ? 'Yes' : 'No',
                    $faq->order,
                    $faq->created_at->format('Y-m-d H:i:s'),
                    $faq->updated_at->format('Y-m-d H:i:s')
                );
            }

            return response($csv)
                ->header('Content-Type', 'text/csv')
                ->header('Content-Disposition', 'attachment; filename="faqs.csv"');
        }

        // JSON format
        return response()->json([
            'data' => $faqs,
            'message' => 'FAQs exported successfully'
        ]);
    }
}
