// src/hooks/useMenuTypess.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import menueSevices from "../services/menueSevices";
import { MenuType } from "./menueSevices";
// Fetch all MenuTypess
export function MenuTypesQry() {
  return useQuery<MenuType[]>({
    queryKey: ["MenuTypes"],
    queryFn: () => menueSevices.getMenuTypes(),
  });
}

// Fetch MenuTypes by ID
export function useMenuTypes(MenuTypesId: number) {
  return useQuery<MenuType>({
    queryKey: ["MenuTypes", MenuTypesId],
    queryFn: () => menueSevices.getMenuTypeById(MenuTypesId),
    enabled: !!MenuTypesId,
  });
}

// Create new MenuTypes
export function useCreateMenuTypes() {
  const queryClient = useQueryClient();
  return useMutation<MenuType, Error, Omit<MenuType, "id">>({
    mutationFn: (newMenuTypes) => menueSevices.createMenuType(newMenuTypes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MenuTypes"] });
    },
  });
}

// Update MenuTypes
export function useUpdateMenuTypes() {
  const queryClient = useQueryClient();
  return useMutation<MenuType, Error, { id: number; data: Partial<MenuType> }>({
    mutationFn: ({ id, data }) => menueSevices.updateMenuType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MenuTypes"] });
    },
  });
}

// Delete MenuTypes
export function useDeleteMenuTypes() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => menueSevices.deleteMenuType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MenuTypes"] });
    },
  });
}
