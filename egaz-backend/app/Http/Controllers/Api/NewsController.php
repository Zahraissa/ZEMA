<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\News;


class NewsController extends Controller
{
       
    public function index(Request $request)
    {
        $query = NewsArticle::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $articles = $query->orderBy('publish_date', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $articles
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'author' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'publish_date' => 'required|date',
            'status' => 'in:draft,published,scheduled',
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
            $imagePath = $request->file('image')->store('news', 'public');
            $data['image'] = $imagePath;
        }

        $article = NewsArticle::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Article created successfully',
            'data' => $article
        ], 201);
    }

    public function show(NewsArticle $article)
    {
        return response()->json([
            'success' => true,
            'data' => $article
        ]);
    }

    public function update(Request $request, $id)
    {
        // Find the article manually to handle cases where route model binding fails
        $article = NewsArticle::find($id);
        
        if (!$article) {
            \Log::error('News article not found', ['article_id' => $id]);
            return response()->json([
                'success' => false,
                'message' => 'Article not found',
            ], 404);
        }

        \Log::info('News update request received', [
            'article_id' => $article->id,
            'request_data' => $request->all(),
            'current_status' => $article->status
        ]);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'author' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'publish_date' => 'sometimes|required|date',
            'status' => 'in:draft,published,scheduled',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240'
        ]);

        if ($validator->fails()) {
            \Log::error('News update validation failed', [
                'errors' => $validator->errors()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        \Log::info('News update validated data', [
            'validated_data' => $data
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($article->image) {
                Storage::disk('public')->delete($article->image);
            }
            
            $imagePath = $request->file('image')->store('news', 'public');
            $data['image'] = $imagePath;
        }

        $article->update($data);

        \Log::info('News update completed', [
            'article_id' => $article->id,
            'new_status' => $article->fresh()->status,
            'updated_data' => $article->fresh()->toArray()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Article updated successfully',
            'data' => $article->fresh()
        ]);
    }

    public function destroy(NewsArticle $article)
    {
        // Delete image if exists
        if ($article->image) {
            Storage::disk('public')->delete($article->image);
        }

        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully'
        ]);
    }

    public function published()
    {
        $articles = NewsArticle::published()->orderBy('publish_date', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $articles
        ]);
    }

    public function featured()
    {
        $articles = NewsArticle::published()->orderBy('publish_date', 'desc')->limit(3)->get();

        return response()->json([
            'success' => true,
            'data' => $articles
        ]);
    }

    public function categories()
    {
        $categories = NewsArticle::distinct()->pluck('category')->filter()->values();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

}
