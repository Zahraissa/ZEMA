<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuType;
use App\Models\MenuGroup;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MenuController extends Controller
{
    // Menu Types
    public function types()
    {
        $types = MenuType::active()->with('menuGroups.menuItems')->get();

        return response()->json([
            'success' => true,
            'data' => $types
        ]);
    }

    public function getType(MenuType $type)
    {
        $type->load(['menuGroups.menuItems']);

        return response()->json([
            'success' => true,
            'data' => $type
        ]);
    }

    public function storeType(Request $request)
    {
        \Log::info('Menu storeType request received', [
            'data' => $request->all()
        ]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'status' => 'in:active,inactive',
            'menu_groups' => 'nullable|array',
            'menu_groups.*.name' => 'required_with:menu_groups|string|max:255',
            'menu_groups.*.description' => 'nullable|string|max:255',
            'menu_groups.*.status' => 'in:active,inactive',
            'menu_groups.*.order' => 'integer|min:1',
            'menu_groups.*.menu_items' => 'nullable|array',
            'menu_groups.*.menu_items.*.name' => 'required_with:menu_groups.*.menu_items|string|max:255',
            'menu_groups.*.menu_items.*.description' => 'nullable|string|max:255',
            'menu_groups.*.menu_items.*.link' => 'nullable|string|max:255',
            'menu_groups.*.menu_items.*.icon' => 'nullable|string|max:255',
            'menu_groups.*.menu_items.*.status' => 'in:active,inactive',
            'menu_groups.*.menu_items.*.order' => 'integer|min:1'
        ]);

        if ($validator->fails()) {
            \Log::error('Menu validation failed', [
                'errors' => $validator->errors()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        $menuGroups = $validated['menu_groups'] ?? [];
        unset($validated['menu_groups']);

        \Log::info('Creating menu type', [
            'validated' => $validated,
            'menuGroups' => $menuGroups
        ]);

        try {
            $type = MenuType::create($validated);

            // Create menu groups and items
            foreach ($menuGroups as $groupData) {
                $menuItems = $groupData['menu_items'] ?? [];
                unset($groupData['menu_items']);
                
                $groupData['menu_type_id'] = $type->id;
                \Log::info('Creating menu group', $groupData);
                $group = MenuGroup::create($groupData);

                // Create menu items for this group
                foreach ($menuItems as $itemData) {
                    $itemData['menu_group_id'] = $group->id;
                    \Log::info('Creating menu item', $itemData);
                    MenuItem::create($itemData);
                }
            }
        } catch (\Exception $e) {
            \Log::error('Error creating menu', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error creating menu: ' . $e->getMessage()
            ], 500);
        }

        // Load the complete structure
        $type->load(['menuGroups.menuItems']);

        \Log::info('Menu type created successfully', [
            'type_id' => $type->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Menu type created successfully',
            'data' => $type
        ], 201);
    }

    public function updateType(Request $request, MenuType $type)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:255',
            'status' => 'in:active,inactive',
            'menu_groups' => 'nullable|array',
            'menu_groups.*.name' => 'required_with:menu_groups|string|max:255',
            'menu_groups.*.description' => 'nullable|string|max:255',
            'menu_groups.*.status' => 'in:active,inactive',
            'menu_groups.*.order' => 'integer|min:1',
            'menu_groups.*.menu_items' => 'nullable|array',
            'menu_groups.*.menu_items.*.name' => 'required_with:menu_groups.*.menu_items|string|max:255',
            'menu_groups.*.menu_items.*.description' => 'nullable|string|max:255',
            'menu_groups.*.menu_items.*.link' => 'nullable|string|max:255',
            'menu_groups.*.menu_items.*.icon' => 'nullable|string|max:255',
            'menu_groups.*.menu_items.*.status' => 'in:active,inactive',
            'menu_groups.*.menu_items.*.order' => 'integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        $menuGroups = $validated['menu_groups'] ?? [];
        unset($validated['menu_groups']);

        $type->update($validated);

        // Delete existing groups and items
        $type->menuGroups()->delete();

        // Create new menu groups and items
        foreach ($menuGroups as $groupData) {
            $menuItems = $groupData['menu_items'] ?? [];
            unset($groupData['menu_items']);
            
            $groupData['menu_type_id'] = $type->id;
            $group = MenuGroup::create($groupData);

            // Create menu items for this group
            foreach ($menuItems as $itemData) {
                $itemData['menu_group_id'] = $group->id;
                MenuItem::create($itemData);
            }
        }

        // Load the complete structure
        $type->load(['menuGroups.menuItems']);

        return response()->json([
            'success' => true,
            'message' => 'Menu type updated successfully',
            'data' => $type
        ]);
    }

    public function destroyType(MenuType $type)
    {
        $type->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu type deleted successfully'
        ]);
    }

    // Menu Groups
    public function groups(Request $request)
    {
        $query = MenuGroup::with('menuItems');

        if ($request->has('menu_type_id')) {
            $query->where('menu_type_id', $request->menu_type_id);
        }

        $groups = $query->active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $groups
        ]);
    }

    public function storeGroup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'menu_type_id' => 'required|exists:menu_types,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
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

        $group = MenuGroup::create($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Menu group created successfully',
            'data' => $group
        ], 201);
    }

    public function updateGroup(Request $request, MenuGroup $group)
    {
        $validator = Validator::make($request->all(), [
            'menu_type_id' => 'sometimes|required|exists:menu_types,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:255',
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

        $group->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Menu group updated successfully',
            'data' => $group
        ]);
    }

    public function destroyGroup(MenuGroup $group)
    {
        $group->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu group deleted successfully'
        ]);
    }

    // Menu Items
    public function items(Request $request)
    {
        $query = MenuItem::with('menuGroup');

        if ($request->has('menu_group_id')) {
            $query->where('menu_group_id', $request->menu_group_id);
        }

        $items = $query->active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    public function storeItem(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'menu_group_id' => 'required|exists:menu_groups,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
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

        $item = MenuItem::create($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Menu item created successfully',
            'data' => $item
        ], 201);
    }

    public function updateItem(Request $request, MenuItem $item)
    {
        $validator = Validator::make($request->all(), [
            'menu_group_id' => 'sometimes|required|exists:menu_groups,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
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

        $item->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Menu item updated successfully',
            'data' => $item
        ]);
    }

    public function destroyItem(MenuItem $item)
    {
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu item deleted successfully'
        ]);
    }

  // Test endpoint to verify authentication and basic functionality
  public function test()
  {
    \Log::info('Menu test endpoint called', [
      'user' => auth()->user() ? auth()->user()->id : 'unauthenticated',
      'timestamp' => now()
    ]);

    return response()->json([
      'success' => true,
      'message' => 'Menu test endpoint working',
      'user' => auth()->user() ? auth()->user()->id : null,
      'timestamp' => now()
    ]);
  }

  // Complete menu structure
  public function structure()
  {
    $menuStructure = MenuType::active()
      ->with(['menuGroups' => function($query) {
        $query->active()->ordered();
      }, 'menuGroups.menuItems' => function($query) {
        $query->active()->ordered();
      }])
      ->get();

    return response()->json([
      'success' => true,
      'data' => $menuStructure
    ]);
  }

  // Reorder menu groups
  public function reorderGroups(Request $request)
  {
    \Log::info('Reorder groups request received', [
      'data' => $request->all(),
      'headers' => $request->headers->all(),
      'method' => $request->method(),
      'url' => $request->url(),
      'user' => $request->user() ? $request->user()->id : 'unauthenticated'
    ]);

    // Log the raw request body
    \Log::info('Raw request body:', [
      'content' => $request->getContent(),
      'content_type' => $request->header('Content-Type')
    ]);

    $validator = Validator::make($request->all(), [
      'groups' => 'required|array|min:1',
      'groups.*.id' => 'required|integer|exists:menu_groups,id',
      'groups.*.order' => 'required|integer|min:1'
    ]);

    if ($validator->fails()) {
      \Log::error('Reorder groups validation failed', [
        'errors' => $validator->errors(),
        'request_data' => $request->all(),
        'validation_rules' => [
          'groups' => 'required|array|min:1',
          'groups.*.id' => 'required|integer|exists:menu_groups,id',
          'groups.*.order' => 'required|integer|min:1'
        ]
      ]);
      return response()->json([
        'success' => false,
        'message' => 'Validation errors',
        'errors' => $validator->errors()
      ], 422);
    }

    try {
      \Log::info('Updating group orders', [
        'groups' => $request->groups
      ]);

      foreach ($request->groups as $groupData) {
        MenuGroup::where('id', $groupData['id'])->update(['order' => $groupData['order']]);
        \Log::info('Updated group order', [
          'id' => $groupData['id'],
          'order' => $groupData['order']
        ]);
      }

      \Log::info('Groups reordered successfully');
      return response()->json([
        'success' => true,
        'message' => 'Menu groups reordered successfully'
      ]);
    } catch (\Exception $e) {
      \Log::error('Error reordering groups', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      return response()->json([
        'success' => false,
        'message' => 'Error reordering menu groups: ' . $e->getMessage()
      ], 500);
    }
  }

  // Reorder menu items
  public function reorderItems(Request $request)
  {
    \Log::info('Reorder items request received', [
      'data' => $request->all(),
      'headers' => $request->headers->all(),
      'method' => $request->method(),
      'url' => $request->url(),
      'user' => $request->user() ? $request->user()->id : 'unauthenticated'
    ]);

    // Log the raw request body
    \Log::info('Raw request body:', [
      'content' => $request->getContent(),
      'content_type' => $request->header('Content-Type')
    ]);

    $validator = Validator::make($request->all(), [
      'items' => 'required|array|min:1',
      'items.*.id' => 'required|integer|exists:menu_items,id',
      'items.*.order' => 'required|integer|min:1'
    ]);

    if ($validator->fails()) {
      \Log::error('Reorder items validation failed', [
        'errors' => $validator->errors(),
        'request_data' => $request->all(),
        'validation_rules' => [
          'items' => 'required|array|min:1',
          'items.*.id' => 'required|integer|exists:menu_items,id',
          'items.*.order' => 'required|integer|min:1'
        ]
      ]);
      return response()->json([
        'success' => false,
        'message' => 'Validation errors',
        'errors' => $validator->errors()
      ], 422);
    }

    try {
      foreach ($request->items as $itemData) {
        MenuItem::where('id', $itemData['id'])->update(['order' => $itemData['order']]);
        \Log::info('Updated item order', [
          'id' => $itemData['id'],
          'order' => $itemData['order']
        ]);
      }

      \Log::info('Items reordered successfully');
      return response()->json([
        'success' => true,
        'message' => 'Menu items reordered successfully'
      ]);
    } catch (\Exception $e) {
      \Log::error('Error reordering items', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      return response()->json([
        'success' => false,
        'message' => 'Error reordering menu items: ' . $e->getMessage()
      ], 500);
    }
  }
}
