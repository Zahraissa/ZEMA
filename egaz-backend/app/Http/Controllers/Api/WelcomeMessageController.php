<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WelcomeMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class WelcomeMessageController extends Controller
{
    /**
     * Get active welcome messages for public display
     */
    public function getActive()
    {
        try {
            \Log::info('Getting active welcome messages');
            
            $messages = WelcomeMessage::active()->get();
            
            // Ensure each message has the image_url accessor loaded
            $messages->each(function ($message) {
                $message->refresh();
            });
            
            \Log::info('Active welcome messages retrieved', [
                'count' => $messages->count(),
                'messages' => $messages->toArray()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Welcome messages retrieved successfully',
                'data' => $messages
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to retrieve active welcome messages', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve welcome messages',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all welcome messages (management)
     */
    public function index()
    {
        try {
            $messages = WelcomeMessage::orderBy('order', 'asc')->get();
            
            // Ensure each message has the image_url accessor loaded
            $messages->each(function ($message) {
                $message->refresh();
            });
            
            return response()->json([
                'success' => true,
                'message' => 'Welcome messages retrieved successfully',
                'data' => $messages
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve welcome messages',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new welcome message
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'position' => 'required|string|max:255',
                'message' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
                'order' => 'nullable|integer|min:1',
                'status' => 'nullable|in:active,inactive,draft',
                'is_active' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->only(['name', 'position', 'message', 'order', 'status', 'is_active']);
            $data['order'] = $data['order'] ?? 1;
            $data['status'] = $data['status'] ?? 'active';
            $data['is_active'] = $data['is_active'] ?? true;

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('welcome-messages', $imageName, 'public');
                $data['image_path'] = $imagePath;
            }

            $message = WelcomeMessage::create($data);

            // Refresh the model to get the data with accessors
            $message->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Welcome message created successfully',
                'data' => $message
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create welcome message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific welcome message
     */
    public function show($id)
    {
        try {
            $message = WelcomeMessage::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'message' => 'Welcome message retrieved successfully',
                'data' => $message
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Welcome message not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update a welcome message
     */
    public function update(Request $request, $id)
    {
        try {
            \Log::info('Welcome message update request received', [
                'id' => $id,
                'request_data' => $request->all(),
                'has_file' => $request->hasFile('image')
            ]);

            $message = WelcomeMessage::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'position' => 'required|string|max:255',
                'message' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
                'order' => 'nullable|integer|min:1',
                'status' => 'nullable|in:active,inactive,draft',
                'is_active' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                \Log::error('Welcome message update validation failed', [
                    'errors' => $validator->errors()
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->only(['name', 'position', 'message', 'order', 'status', 'is_active']);

            \Log::info('Welcome message update validated data', [
                'validated_data' => $data
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                \Log::info('Processing image upload for welcome message', [
                    'message_id' => $id,
                    'old_image_path' => $message->image_path
                ]);

                // Delete old image if exists
                if ($message->image_path) {
                    Storage::disk('public')->delete($message->image_path);
                }
                
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('welcome-messages', $imageName, 'public');
                $data['image_path'] = $imagePath;

                \Log::info('Image uploaded successfully', [
                    'new_image_path' => $imagePath
                ]);
            }

            $message->update($data);

            // Refresh the model to get the updated data with accessors
            $message->refresh();

            \Log::info('Welcome message updated successfully', [
                'message_id' => $id,
                'updated_data' => $message->toArray()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Welcome message updated successfully',
                'data' => $message
            ]);
        } catch (\Exception $e) {
            \Log::error('Welcome message update failed', [
                'message_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update welcome message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a welcome message
     */
    public function destroy($id)
    {
        try {
            $message = WelcomeMessage::findOrFail($id);
            
            // Delete image if exists
            if ($message->image_path) {
                Storage::disk('public')->delete($message->image_path);
            }
            
            $message->delete();

            return response()->json([
                'success' => true,
                'message' => 'Welcome message deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete welcome message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle active status
     */
    public function toggleActive($id)
    {
        try {
            $message = WelcomeMessage::findOrFail($id);
            $message->is_active = !$message->is_active;
            $message->save();

            return response()->json([
                'success' => true,
                'message' => 'Welcome message status updated successfully',
                'data' => $message
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update welcome message status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
