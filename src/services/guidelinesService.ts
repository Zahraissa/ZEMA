/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "./api";

export interface Guideline {
  id: number;
  title: string;
  description: string;
  category: string;
  documentType: string;
  version: string;
  datePublished: string;
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
  fileUrl?: string;
  tags: string[];
  author: string;
  department: string;
  createdAt?: string;
  updatedAt?: string;
  isMainDocument?: boolean;
  featured?: boolean;
  viewCount?: number;
  downloadCount?: number;
  order?: number;
  relatedDocuments?: number[];
}

export interface CreateGuidelineRequest {
  title: string;
  description: string;
  category: string;
  documentType: string;
  version: string;
  status: 'active' | 'draft' | 'archived';
  fileUrl?: string;
  tags: string[];
  author: string;
  department: string;
}

export interface UpdateGuidelineRequest extends Partial<CreateGuidelineRequest> {
  id: number;
}

class GuidelinesService {
  private baseUrl = '/api/guidelines';

  // Get all guidelines
  async getAllGuidelines() {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching guidelines:', error);
      throw error;
    }
  }

  // Get active guidelines only
  async getActiveGuidelines() {
    try {
      const response = await api.get(`${this.baseUrl}/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active guidelines:', error);
      throw error;
    }
  }

  // Get guidelines by category
  async getGuidelinesByCategory(category: string): Promise<Guideline[]> {
    try {
      const response = await api.get(`${this.baseUrl}/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching guidelines by category:', error);
      throw error;
    }
  }

  // Get guidelines by document type
  async getGuidelinesByType(documentType: string): Promise<Guideline[]> {
    try {
      const response = await api.get(`${this.baseUrl}/type/${documentType}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching guidelines by type:', error);
      throw error;
    }
  }

  // Search guidelines
  async searchGuidelines(query: string): Promise<Guideline[]> {
    try {
      const response = await api.get(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching guidelines:', error);
      throw error;
    }
  }

  // Get single guideline by ID
  async getGuidelineById(id: number): Promise<Guideline> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching guideline:', error);
      throw error;
    }
  }

  // Create new guideline (admin only)
  async createGuideline(data: CreateGuidelineRequest): Promise<Guideline> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating guideline:', error);
      throw error;
    }
  }

  // Update guideline (admin only)
  async updateGuideline(data: UpdateGuidelineRequest): Promise<Guideline> {
    try {
      const response = await api.put(`${this.baseUrl}/${data.id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating guideline:', error);
      throw error;
    }
  }

  // Delete guideline (admin only)
  async deleteGuideline(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting guideline:', error);
      throw error;
    }
  }

  // Get categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await api.get(`${this.baseUrl}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get document types
  async getDocumentTypes(): Promise<string[]> {
    try {
      const response = await api.get(`${this.baseUrl}/document-types`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document types:', error);
      throw error;
    }
  }

  // Get statistics
  async getStatistics(): Promise<{
    total: number;
    active: number;
    draft: number;
    archived: number;
    categories: number;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  // Increment view count
  async incrementViewCount(id: number): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${id}/increment-view`);
    } catch (error) {
      console.error('Error incrementing view count:', error);
      throw error;
    }
  }

  // Increment download count
  async incrementDownloadCount(id: number): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${id}/increment-download`);
    } catch (error) {
      console.error('Error incrementing download count:', error);
      throw error;
    }
  }

  // Get main documents
  async getMainDocuments(): Promise<Guideline[]> {
    try {
      const response = await api.get(`${this.baseUrl}/main-documents`);
      return response.data;
    } catch (error) {
      console.error('Error fetching main documents:', error);
      throw error;
    }
  }

  // Get related documents
  async getRelatedDocuments(): Promise<Guideline[]> {
    try {
      const response = await api.get(`${this.baseUrl}/related-documents`);
      return response.data;
    } catch (error) {
      console.error('Error fetching related documents:', error);
      throw error;
    }
  }
}

export const guidelinesService = new GuidelinesService();
