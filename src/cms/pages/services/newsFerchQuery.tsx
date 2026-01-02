// src/hooks/useNewss.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService, { News } from "../services/apiService";
import Swal from "sweetalert2";
// Fetch all Newss
export function NewsQry() {
  return useQuery<News[]>({
    queryKey: ["News"],
    queryFn: () => apiService.getNews(),
  });
}

// Fetch News by ID
export function useNews(NewsId: number) {
  return useQuery<News>({
    queryKey: ["News", NewsId],
    queryFn: () => apiService.getNewsById(NewsId),
    enabled: !!NewsId,
  });
}

// Create new News
export function useCreateNews() {
  const queryClient = useQueryClient();
  return useMutation<News, Error, Omit<News, "id">>({
    mutationFn: (newNews) => apiService.createNews(newNews),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["News"] });
      
    },
  });
}

// Update News
export function useUpdateNews() {
  const queryClient = useQueryClient();
  return useMutation<News, Error, { id: number; data: Partial<News> }>({
    mutationFn: ({ id, data }) => apiService.updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["News"] });
    },
  });
}

// Delete News
export function useDeleteNews() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => apiService.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["News"] });
    },
  });
}
