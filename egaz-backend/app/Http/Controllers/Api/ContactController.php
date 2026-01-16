<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactOffice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactOffice::query();

        // Filter by office type
        if ($request->has('office_type')) {
            $query->byType($request->office_type);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $offices = $query->ordered()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $offices
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'office_type' => 'required|in:headquarter,regional,research',
            'office_name' => 'required|string|max:255',
            'location' => 'required|string',
            'postal_address' => 'required|string',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'helpdesk' => 'nullable|string|max:255',
            'map_embed_url' => 'nullable|url',
            'map_latitude' => 'nullable|numeric|between:-90,90',
            'map_longitude' => 'nullable|numeric|between:-180,180',
            'map_rating' => 'nullable|numeric|between:0,5',
            'map_reviews' => 'nullable|integer|min:0',
            'order' => 'integer|min:0',
            'status' => 'in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $office = ContactOffice::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Contact office created successfully',
            'data' => $office
        ], 201);
    }

    public function show(ContactOffice $contact)
    {
        return response()->json([
            'success' => true,
            'data' => $contact
        ]);
    }

    public function update(Request $request, ContactOffice $contact)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'office_type' => 'sometimes|required|in:headquarter,regional,research',
            'office_name' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string',
            'postal_address' => 'sometimes|required|string',
            'email' => 'sometimes|required|email|max:255',
            'phone' => 'sometimes|required|string|max:255',
            'helpdesk' => 'nullable|string|max:255',
            'map_embed_url' => 'nullable|url',
            'map_latitude' => 'nullable|numeric|between:-90,90',
            'map_longitude' => 'nullable|numeric|between:-180,180',
            'map_rating' => 'nullable|numeric|between:0,5',
            'map_reviews' => 'nullable|integer|min:0',
            'order' => 'integer|min:0',
            'status' => 'in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $contact->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Contact office updated successfully',
            'data' => $contact
        ]);
    }

    public function destroy(ContactOffice $contact)
    {
        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contact office deleted successfully'
        ]);
    }

    public function active()
    {
        $offices = ContactOffice::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $offices
        ]);
    }

    public function byType($type)
    {
        $offices = ContactOffice::active()->byType($type)->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $offices
        ]);
    }

    public function headquarters()
    {
        $offices = ContactOffice::active()->headquarters()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $offices
        ]);
    }

    public function regional()
    {
        $offices = ContactOffice::active()->regional()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $offices
        ]);
    }

    public function research()
    {
        $offices = ContactOffice::active()->research()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $offices
        ]);
    }

    public function allOffices()
    {
        $headquarters = ContactOffice::active()->headquarters()->ordered()->get();
        $regional = ContactOffice::active()->regional()->ordered()->get();
        $research = ContactOffice::active()->research()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => [
                'headquarters' => $headquarters,
                'regional' => $regional,
                'research' => $research
            ]
        ]);
    }

    public function toggleStatus(ContactOffice $contact)
    {
        $contact->update([
            'status' => $contact->status === 'active' ? 'inactive' : 'active'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Contact office status updated successfully',
            'data' => $contact
        ]);
    }
}
