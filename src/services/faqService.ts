import api from './api';

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Add snake_case versions for API compatibility
  created_at?: string;
  updated_at?: string;
}

export interface CreateFAQData {
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
}

export interface UpdateFAQData {
  question?: string;
  answer?: string;
  category?: string;
  isActive?: boolean;
}

export interface FAQFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface FAQResponse {
  data: FAQ[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class FAQService {
  private baseUrl = '/faqs';

  // Get all FAQs with optional filters
  async getFAQs(filters?: FAQFilters): Promise<FAQResponse> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`${this.baseUrl}?${params.toString()}`);
    return response.data;
  }

  // Get a single FAQ by ID
  async getFAQ(id: number): Promise<FAQ> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  // Get active FAQs for public display
  async getActiveFAQs(): Promise<FAQ[]> {
    const response = await api.get(`${this.baseUrl}/active`);
    return response.data.data; // Access the data property within the response
  }

  // Create a new FAQ
  async createFAQ(data: CreateFAQData): Promise<FAQ> {
    const response = await api.post(this.baseUrl, data);
    return response.data.data;
  }

  // Update an existing FAQ
  async updateFAQ(id: number, data: UpdateFAQData): Promise<FAQ> {
    const response = await api.put(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  // Delete a FAQ
  async deleteFAQ(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  // Toggle FAQ active status
  async toggleFAQStatus(id: number): Promise<FAQ> {
    const response = await api.patch(`${this.baseUrl}/${id}/toggle-status`);
    return response.data.data;
  }

  // Get FAQ categories
  async getCategories(): Promise<string[]> {
    const response = await api.get(`${this.baseUrl}/categories`);
    return response.data.data;
  }

  // Bulk operations
  async bulkUpdateStatus(ids: number[], isActive: boolean): Promise<void> {
    await api.patch(`${this.baseUrl}/bulk-status`, { ids, isActive });
  }

  async bulkDelete(ids: number[]): Promise<void> {
    await api.delete(`${this.baseUrl}/bulk`, { data: { ids } });
  }

  // Search FAQs
  async searchFAQs(query: string): Promise<FAQ[]> {
    const response = await api.get(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  }

  // Get FAQs by category
  async getFAQsByCategory(category: string): Promise<FAQ[]> {
    const response = await api.get(`${this.baseUrl}/category/${encodeURIComponent(category)}`);
    return response.data.data;
  }

  // Export FAQs
  async exportFAQs(format: 'csv' | 'json' | 'pdf' = 'json'): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Import FAQs
  async importFAQs(file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`${this.baseUrl}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  }

  // Analytics
  async getFAQAnalytics(): Promise<{
    totalFAQs: number;
    activeFAQs: number;
    inactiveFAQs: number;
    categories: { name: string; count: number }[];
    recentActivity: { date: string; count: number }[];
  }> {
    const response = await api.get(`${this.baseUrl}/analytics`);
    return response.data.data;
  }
}

export const faqService = new FAQService();
