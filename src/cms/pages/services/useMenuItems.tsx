// src/hooks/useMenuItems.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { MenuItem } from "./MenuItemService";
// import menuItemService from "./MenuItemService";
import menuItemService, { MenuItem } from "./menuItemService";
// Fetch all menu items
export function useMenuItemsQuery() {
  return useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: () => menuItemService.getMenuItems(),
  });
}

// Fetch menu item by ID
export function useMenuItem(id: number) {
  return useQuery<MenuItem>({
    queryKey: ["menuItems", id],
    queryFn: () => menuItemService.getMenuItemById(id),
    enabled: !!id,
  });
}

// Create new menu item
export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation<MenuItem, Error, Omit<MenuItem, "id">>({
    mutationFn: (newMenuItem) => menuItemService.createMenuItem(newMenuItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

// Update menu item
export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation<MenuItem, Error, { id: number; data: Partial<MenuItem> }>({
    mutationFn: ({ id, data }) => menuItemService.updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

// Delete menu item
export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => menuItemService.deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}
