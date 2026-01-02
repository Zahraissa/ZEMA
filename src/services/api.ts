/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { API_BASE_URL, STORAGE_BASE_URL } from '@/config';

// API Configuration (centralized in src/config.ts)
// Create axios instance
const api: any = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Auth token:', token ? 'Present' : 'Missing');
    
    // If data is FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Only add auth token for protected routes (not public routes)
    const isPublicRoute = config.url?.includes('/services/active') || 
                         config.url?.includes('/services/') ||
                         config.url?.includes('/news/published') ||
                         config.url?.includes('/news/') ||
                         config.url?.includes('/sliders/active') ||
                         config.url?.includes('/about/active') ||
                         config.url?.includes('/gallery/active') ||
                         config.url?.includes('/faqs/active') ||
                         config.url?.includes('/muhimu/active') ||
                         config.url?.includes('/guidelines/active') ||
                         config.url?.includes('/guidelines-standards/active') ||
                         config.url?.includes('/guidelines-standards/search') ||
                         config.url?.includes('/guidelines-standards/') ||
                         config.url?.includes('/brands/active') ||
                         config.url?.includes('/director-general/active') ||
                         config.url?.includes('/authority-functions/active') ||
                         config.url?.includes('/contact/active') ||
                         config.url?.includes('/menu/active');
    
    if (token && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: any) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    
    // Only redirect to login for protected routes, not public routes
    const isPublicRoute = error.config?.url?.includes('/services/active') || 
                         error.config?.url?.includes('/services/') ||
                         error.config?.url?.includes('/news/published') ||
                         error.config?.url?.includes('/news/') ||
                         error.config?.url?.includes('/sliders/active') ||
                         error.config?.url?.includes('/about/active') ||
                         error.config?.url?.includes('/gallery/active') ||
                         error.config?.url?.includes('/faqs/active') ||
                         error.config?.url?.includes('/muhimu/active') ||
                         error.config?.url?.includes('/guidelines/active') ||
                         error.config?.url?.includes('/guidelines-standards/active') ||
                         error.config?.url?.includes('/guidelines-standards/search') ||
                         error.config?.url?.includes('/guidelines-standards/') ||
                         error.config?.url?.includes('/brands/active') ||
                         error.config?.url?.includes('/director-general/active') ||
                         error.config?.url?.includes('/authority-functions/active') ||
                         error.config?.url?.includes('/contact/active') ||
                         error.config?.url?.includes('/menu/active');
    
    if (error.response?.status === 401 && !isPublicRoute) {
      // Unauthorized - clear token and redirect to login only for protected routes
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'author' | 'subscriber';
  status: 'active' | 'inactive';
  avatar?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  roles?: Role[];
  permissions?: Permission[];
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  users?: User[];
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  slug?: string;
  display_name: string;
  description?: string;
  group?: string;
  created_at?: string;
  updated_at?: string;
  roles?: Role[];
}

export interface Slider {
  id: number;
  title: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  image_path?: string;
  badge?: string;
  year?: string;
  has_video: boolean;
  order: number;
  status: 'active' | 'inactive' | 'draft';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  description: string;
  author?: string;
  category?: string;
  image?: string;
  publish_date: string;
  status: 'draft' | 'published' | 'scheduled';
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price?: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  image_path?: string;
  features?: string[];
  client_count?: number;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export interface BandMember {
  id: number;
  name: string;
  position: string;
  image_path?: string;
  social_facebook?: string;
  social_twitter?: string;
  social_instagram?: string;
  social_linkedin?: string;
  status: 'active' | 'inactive';
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: number;
  section: string;
  title: string;
  content: string;
  image_path?: string;
  additional_data?: any;
  status: 'active' | 'inactive';
  order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuType {
  menu_items: any;
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  menu_groups?: MenuGroup[];
  created_at: string;
  updated_at: string;
}

export interface MenuGroup {
  id: number;
  menu_type_id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  order: number;
  menu_items?: MenuItem[];
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: number;
  menu_group_id: number;
  name: string;
  description?: string;
  link?: string;
  icon?: string;
  status: 'active' | 'inactive';
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Guide {
  id: number;
  title: string;
  description?: string;
  content?: string;
  category: string;
  file_path?: string;
  file_name?: string;
  file_size?: string;
  file_type?: string;
  file_url?: string;
  status: 'active' | 'inactive' | 'draft';
  order: number;
  author?: string;
  tags?: string[];
  featured: boolean;
  view_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface GuidelineStandard {
  id: number;
  title: string;
  description?: string;
  content?: string;
  group_id: number;
  standard_type: string;
  maturity_level: string;
  version: string;
  status: 'active' | 'inactive' | 'draft';
  author?: string;
  department?: string;
  date_published: string;
  tags?: string[] | null;
  featured: boolean;
  order: number;
  file_name?: string;
  file_size?: number;
  file_path?: string;
  fileUrl?: string;
  created_at: string;
  updated_at: string;
}

export interface GuidelinesGroup {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  order: number;
  created_at: string;
  updated_at: string;
}

export interface GroupWithStandards {
  id: number;
  name: string;
  description?: string;
  order: number;
  main_document: GuidelineStandard | null;
  related_documents: GuidelineStandard[];
  total_documents: number;
}

export interface Gallery {
  id: number;
  title: string;
  description?: string;
  image_path?: string;
  category?: string;
  order: number;
  status: 'active' | 'inactive' | 'draft';
  is_active: boolean;
  featured: boolean;
  alt_text?: string;
  caption?: string;
  created_at: string;
  updated_at: string;
}

export interface WelcomeMessage {
  id: number;
  name: string;
  position: string;
  message: string;
  image_path?: string;
  image_url?: string;
  order: number;
  status: 'active' | 'inactive' | 'draft';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  logo_path?: string;
  website_url?: string;
  status: 'active' | 'inactive';
  order: number;
  created_at: string;
  updated_at: string;
}

export interface WebsiteService {
  id: number;
  front_icon?: string;
  front_title: string;
  front_description: string;
  back_title: string;
  back_description: string;
  back_image?: string;
  link?: string;
  order: number;
  status: 'active' | 'inactive' | 'draft';
  is_active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface DirectorGeneral {
  id: number;
  name: string;
  title: string;
  message: string;
  image_path?: string;
  additional_data?: any;
  status: 'active' | 'inactive';
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  description?: string;
  published_date: string;
  is_active: boolean;
  order: number;
  file_url?: string;
  file_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: number;
  title: string;
  description?: string;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url: string;
  is_main: boolean;
  is_active: boolean;
  order: number;
  duration?: string;
  published_date: string;
  created_at: string;
  updated_at: string;
}

export interface Download {
  id: number;
  title: string;
  description?: string;
  file_url: string;
  file_name: string;
  file_size?: string;
  file_type?: string;
  download_count: number;
  is_active: boolean;
  order: number;
  published_date: string;
  created_at: string;
  updated_at: string;
}

// Muhimu types (public aggregate endpoint)
export interface MuhimuAnnouncement {
  id: number;
  title: string;
  published: string; // humanized string from backend
  file_url?: string;
  file_name?: string;
}

export interface MuhimuDownload {
  id: number;
  title: string;
  published: string;
  file_url: string;
  file_name: string;
  file_size?: string;
  file_type?: string;
  download_count: number;
}

export interface MuhimuData {
  announcements: MuhimuAnnouncement[];
  videos: Video[];
  downloads: MuhimuDownload[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: any[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string, password_confirmation: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/register', { name, email, password, password_confirmation });
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post('/logout');
    return response.data;
  },

  getUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/user');
    return response.data;
  },
};

// Public Content API
export const publicAPI = {
  // Sliders
  getActiveSliders: async (): Promise<ApiResponse<Slider[]>> => {
    const response = await api.get('/sliders/active');
    return response.data;
  },

  // News
  getPublishedNews: async (page = 1): Promise<PaginatedResponse<NewsArticle>> => {
    const response = await api.get(`/news/published?page=${page}`);
    return response.data;
  },

  getFeaturedNews: async (): Promise<ApiResponse<NewsArticle[]>> => {
    const response = await api.get('/news/featured');
    return response.data;
  },

  getNewsCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/news/categories');
    return response.data;
  },

  // Services
  getActiveServices: async (): Promise<ApiResponse<Service[]>> => {
    const response = await api.get('/services/active');
    return response.data;
  },

  getFeaturedServices: async (): Promise<ApiResponse<Service[]>> => {
    const response = await api.get('/services/featured');
    return response.data;
  },

  getServiceCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/services/categories');
    return response.data;
  },

  getService: async (id: number): Promise<ApiResponse<Service>> => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Band Members
  getActiveBandMembers: async (): Promise<ApiResponse<BandMember[]>> => {
    const response = await api.get('/band-members/active');
    return response.data;
  },

  // About Content
  getActiveAboutContent: async (): Promise<ApiResponse<AboutContent[]>> => {
    const response = await api.get('/about/active');
    return response.data;
  },

  getAboutSections: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/about/sections');
    return response.data;
  },

  getAboutContentBySection: async (section: string): Promise<ApiResponse<AboutContent[]>> => {
    const response = await api.get(`/about/section/${section}`);
    return response.data;
  },

  // Menu
  getMenuStructure: async (): Promise<ApiResponse<MenuType[]>> => {
    const response = await api.get('/menu/structure');
    return response.data;
  },

  // Guides
  getActiveGuides: async (): Promise<ApiResponse<Guide[]>> => {
    const response = await api.get('/guides/active');
    return response.data;
  },

  getFeaturedGuides: async (): Promise<ApiResponse<Guide[]>> => {
    const response = await api.get('/guides/featured');
    return response.data;
  },

  getGuideCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/guides/categories');
    return response.data;
  },

  getGuidesByCategory: async (category: string): Promise<ApiResponse<Guide[]>> => {
    const response = await api.get(`/guides/category/${category}`);
    return response.data;
  },

  getGuide: async (id: number): Promise<ApiResponse<Guide>> => {
    const response = await api.get(`/guides/${id}`);
    return response.data;
  },

  downloadGuide: async (id: number): Promise<Blob> => {
    const response = await api.get(`/guides/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Gallery
  getActiveGallery: async (): Promise<ApiResponse<Gallery[]>> => {
    const response = await api.get('/gallery/active');
    return response.data;
  },

  getFeaturedGallery: async (): Promise<ApiResponse<Gallery[]>> => {
    const response = await api.get('/gallery/featured');
    return response.data;
  },

  getGalleryCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/gallery/categories');
    return response.data;
  },

  getGalleryByCategory: async (category: string): Promise<ApiResponse<Gallery[]>> => {
    const response = await api.get(`/gallery/category/${category}`);
    return response.data;
  },

  // Welcome Messages
  getActiveWelcomeMessages: async (): Promise<ApiResponse<WelcomeMessage[]>> => {
    const response = await api.get('/welcome-messages/active', {
      params: { _t: Date.now() }
    });
    return response.data;
  },

  // Brands
  getActiveBrands: async (): Promise<ApiResponse<Brand[]>> => {
    const response = await api.get('/brands/active');
    return response.data;
  },

  // Website Services
  getActiveWebsiteServices: async (): Promise<ApiResponse<WebsiteService[]>> => {
    const response = await api.get('/website-services/active');
    return response.data;
  },

  // Guidelines (Miogozo ya Kisera)
  getActiveGuidelines: async (): Promise<ApiResponse<Guide[]>> => {
    const response = await api.get('/guidelines');
    return response.data;
  },

  getMainDocument: async (): Promise<ApiResponse<Guide | null>> => {
    const response = await api.get('/guidelines/main-document');
    return response.data;
  },

  getRelatedDocuments: async (): Promise<ApiResponse<Guide[]>> => {
    const response = await api.get('/guidelines/related-documents');
    return response.data;
  },

  getGuidelineCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/guidelines/categories');
    return response.data;
  },

  getGuidelineDocumentTypes: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/guidelines/document-types');
    return response.data;
  },

  getGuidelinesByCategory: async (category: string): Promise<ApiResponse<Guide[]>> => {
    const response = await api.get(`/guidelines/category/${category}`);
    return response.data;
  },

  getGuidelinesByDocumentType: async (documentType: string): Promise<ApiResponse<Guide[]>> => {
    const response = await api.get(`/guidelines/type/${documentType}`);
    return response.data;
  },

  searchGuidelines: async (query: string): Promise<ApiResponse<Guide[]>> => {
    const response = await api.get('/guidelines/search', { params: { q: query } });
    return response.data;
  },

  getGuideline: async (id: number): Promise<ApiResponse<Guide>> => {
    const response = await api.get(`/guidelines/${id}`);
    return response.data;
  },

  downloadGuideline: async (id: number): Promise<Blob> => {
    const response = await api.get(`/guidelines/${id}/download`, {
      responseType: 'blob',
      validateStatus: function (status) {
        // Accept all status codes, we'll check manually
        return status >= 200 && status < 500;
      }
    });
    
    // Check if response is actually a JSON error (backend returns JSON on error)
    const contentType = response.headers['content-type'] || '';
    if (contentType.includes('application/json') || response.status === 404) {
      // Response is JSON error, not a blob - try to parse it
      try {
        const text = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(response.data);
        });
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || 'File not found');
      } catch (parseError: any) {
        // If parsing fails, it might be a real blob, but status suggests error
        if (response.status === 404) {
          throw new Error('File not found');
        }
        throw parseError;
      }
    }
    
    // Check status code
    if (response.status >= 400) {
      throw new Error('Failed to download file');
    }
    
    return response.data;
  },

  incrementGuidelineView: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.post(`/guidelines/${id}/increment-view`);
    return response.data;
  },

  incrementGuidelineDownload: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.post(`/guidelines/${id}/increment-download`);
    return response.data;
  },

  // Guidelines Standards (Viwango na Miongo)
  getActiveStandards: async (): Promise<ApiResponse<GuidelineStandard[]>> => {
    const response = await api.get('/guidelines-standards/active');
    return response.data;
  },

  getStandard: async (id: number): Promise<ApiResponse<GuidelineStandard>> => {
    const response = await api.get(`/guidelines-standards/${id}`);
    return response.data;
  },

  searchStandards: async (query: string): Promise<ApiResponse<GuidelineStandard[]>> => {
    const response = await api.get('/guidelines-standards/search', { params: { q: query } });
    return response.data;
  },

  // Guidelines Groups (Categories)
  getActiveGroups: async (): Promise<ApiResponse<GuidelinesGroup[]>> => {
    const response = await api.get('/guidelines-groups/active');
    return response.data;
  },

  getGroupsWithStandards: async (): Promise<ApiResponse<GroupWithStandards[]>> => {
    const response = await api.get('/guidelines-groups/with-standards');
    return response.data;
  },

  downloadStandard: async (id: number): Promise<Blob> => {
    const response = await api.get(`/guidelines-standards/${id}/download`, {
      responseType: 'blob',
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
    
    // Check if response is actually a JSON error
    const contentType = response.headers['content-type'] || '';
    if (contentType.includes('application/json') || response.status === 404) {
      try {
        const text = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(response.data);
        });
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || 'File not found');
      } catch (parseError: any) {
        if (response.status === 404) {
          throw new Error('File not found');
        }
        throw parseError;
      }
    }
    
    if (response.status >= 400) {
      throw new Error('Failed to download file');
    }
    
    return response.data;
  },

  // Muhimu (aggregate public content)
  getMuhimu: async (): Promise<ApiResponse<MuhimuData>> => {
    const response = await api.get('/muhimu', { params: { _t: Date.now() } });
    return response.data;
  },

  incrementMuhimuDownload: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.post(`/muhimu/downloads/${id}/increment`);
    return response.data;
  },
};

// Protected Management API
export const managementAPI = {
  // Sliders Management
  getSliders: async (): Promise<ApiResponse<Slider[]>> => {
    const response = await api.get('/sliders');
    return response.data;
  },

  createSlider: async (data: FormData): Promise<ApiResponse<Slider>> => {
    // FormData will be handled by the request interceptor which removes Content-Type header
    const response = await api.post('/sliders', data);
    return response.data;
  },

  updateSlider: async (id: number, data: FormData): Promise<ApiResponse<Slider>> => {
    // Use POST with method override for file uploads in Laravel
    data.append('_method', 'PUT');
    // FormData will be handled by the request interceptor which removes Content-Type header
    const response = await api.post(`/sliders/${id}`, data);
    return response.data;
  },

  deleteSlider: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/sliders/${id}`);
    return response.data;
  },

  reorderSliders: async (sliders: { id: number; order: number }[]): Promise<ApiResponse<null>> => {
    const response = await api.post('/sliders/reorder', { sliders });
    return response.data;
  },

  // Brand Management
  getBrands: async (): Promise<PaginatedResponse<Brand>> => {
    const response = await api.get('/brands');
    return response.data;
  },

  getBrand: async (id: number): Promise<ApiResponse<Brand>> => {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  createBrand: async (data: FormData): Promise<ApiResponse<Brand>> => {
    const response = await api.post('/brands', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateBrand: async (id: number, data: FormData): Promise<ApiResponse<Brand>> => {
    // Use POST with method override for file uploads in Laravel
    data.append('_method', 'PUT');
    const response = await api.post(`/brands/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteBrand: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },

  reorderBrands: async (brands: { id: number; order: number }[]): Promise<ApiResponse<null>> => {
    const response = await api.post('/brands/reorder', { brands });
    return response.data;
  },

  // News Management
  getNews: async (params?: any): Promise<PaginatedResponse<NewsArticle>> => {
    const response = await api.get('/news', { params });
    return response.data;
  },

  createNews: async (data: FormData): Promise<ApiResponse<NewsArticle>> => {
    const response = await api.post('/news', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateNews: async (id: number, data: FormData): Promise<ApiResponse<NewsArticle>> => {
    // Add method override for Laravel file uploads
    data.append('_method', 'PUT');
    const response = await api.post(`/news/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteNews: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  // Services Management
  getServices: async (params?: any): Promise<PaginatedResponse<Service>> => {
    const response = await api.get('/services', { params });
    return response.data;
  },

  getService: async (id: number): Promise<ApiResponse<Service>> => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  createService: async (data: FormData): Promise<ApiResponse<Service>> => {
    const response = await api.post('/services', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateService: async (id: number, data: FormData): Promise<ApiResponse<Service>> => {
    // Add method override for Laravel
    data.append('_method', 'PUT');
    const response = await api.post(`/services/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteService: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  // Band Members Management
  getBandMembers: async (params?: any): Promise<PaginatedResponse<BandMember>> => {
    const response = await api.get('/band-members', { params });
    return response.data;
  },

  createBandMember: async (data: FormData): Promise<ApiResponse<BandMember>> => {
    console.log('Sending FormData to API:')
    for (const [key, value] of data.entries()) {
      console.log(key, ':', value)
    }
    const response = await api.post('/band-members', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('API Response:', response.data);
    return response.data;
  },

  // updateBandMember: async (id: number, data: FormData): Promise<ApiResponse<BandMember>> => {
  //   const response = await api.put(`/band-members/${id}`, data, {
  //     headers: { 'Content-Type': 'multipart/form-data' },
  //   });
  //   return response.data;
  // },

  // deleteBandMember: async (id: number): Promise<ApiResponse<null>> => {
  //   const response = await api.delete(`/band-members/${id}`);
  //   return response.data;
  // },

  // reorderBandMembers: async (members: { id: number; order: number }[]): Promise<ApiResponse<null>> => {
  //   const response = await api.post('/band-members/reorder', { members });
  //   return response.data;
  // },

  // About Content Management
  getAboutContent: async (params?: any): Promise<PaginatedResponse<AboutContent>> => {
    const response = await api.get('/about', { params });
    return response.data;
  },

  createAboutContent: async (data: FormData): Promise<ApiResponse<AboutContent>> => {
    const response = await api.post('/about', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateAboutContent: async (id: number, data: FormData): Promise<ApiResponse<AboutContent>> => {
    const response = await api.put(`/about/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteAboutContent: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/about/${id}`);
    return response.data;
  },

  // Menu Management
  getMenuTypes: async (): Promise<ApiResponse<MenuType[]>> => {
    const response = await api.get('/menu/types');
    return response.data;
  },

  getMenuType: async (id: number): Promise<ApiResponse<MenuType>> => {
    const response = await api.get(`/menu/types/${id}`);
    return response.data;
  },

  createMenuType: async (data: Partial<MenuType>): Promise<ApiResponse<MenuType>> => {
    const response = await api.post('/menu/types', data);
    return response.data;
  },

  updateMenuType: async (id: number, data: Partial<MenuType>): Promise<ApiResponse<MenuType>> => {
    const response = await api.put(`/menu/types/${id}`, data);
    return response.data;
  },

  deleteMenuType: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/menu/types/${id}`);
    return response.data;
  },

  getMenuGroups: async (params?: any): Promise<ApiResponse<MenuGroup[]>> => {
    const response = await api.get('/menu/groups', { params });
    return response.data;
  },

  createMenuGroup: async (data: Partial<MenuGroup>): Promise<ApiResponse<MenuGroup>> => {
    const response = await api.post('/menu/groups', data);
    return response.data;
  },

  updateMenuGroup: async (id: number, data: Partial<MenuGroup>): Promise<ApiResponse<MenuGroup>> => {
    const response = await api.put(`/menu/groups/${id}`, data);
    return response.data;
  },

  deleteMenuGroup: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/menu/groups/${id}`);
    return response.data;
  },

  getMenuItems: async (params?: any): Promise<ApiResponse<MenuItem[]>> => {
    const response = await api.get('/menu/items', { params });
    return response.data;
  },

  createMenuItem: async (data: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> => {
    const response = await api.post('/menu/items', data);
    return response.data;
  },

  updateMenuItem: async (id: number, data: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> => {
    const response = await api.put(`/menu/items/${id}`, data);
    return response.data;
  },

  deleteMenuItem: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/menu/items/${id}`);
    return response.data;
  },

  reorderMenuGroups: async (groups: { id: number; order: number }[]): Promise<ApiResponse<null>> => {
    console.log('API: Sending reorderMenuGroups request with data:', groups);
    try {
      const response = await api.post('/menu/groups/reorder', { groups });
      console.log('API: reorderMenuGroups response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: reorderMenuGroups error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: { groups }
      });
      throw error;
    }
  },

  reorderMenuItems: async (items: { id: number; order: number }[]): Promise<ApiResponse<null>> => {
    console.log('API: Sending reorderMenuItems request with data:', items);
    try {
      const response = await api.post('/menu/items/reorder', { items });
      console.log('API: reorderMenuItems response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: reorderMenuItems error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: { items }
      });
      throw error;
    }
  },

  // User Management
  getUsers: async (params?: any): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUser: async (id: number): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    status: string;
    send_welcome_email?: boolean;
  }): Promise<ApiResponse<User>> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  updateUser: async (id: number, data: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    status?: string;
  }): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id: number, status: string): Promise<ApiResponse<User>> => {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  assignUserRoles: async (id: number, roleIds: number[]): Promise<ApiResponse<User>> => {
    const response = await api.post(`/users/${id}/assign-roles`, { role_ids: roleIds });
    return response.data;
  },

  // Role Management
  getRoles: async (): Promise<ApiResponse<Role[]>> => {
    const response = await api.get('/roles');
    return response.data;
  },

  getRole: async (id: number): Promise<ApiResponse<Role>> => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  createRole: async (data: { name: string; description?: string }): Promise<ApiResponse<Role>> => {
    const response = await api.post('/roles', data);
    return response.data;
  },

  updateRole: async (id: number, data: { name?: string; description?: string }): Promise<ApiResponse<Role>> => {
    const response = await api.put(`/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  },

  assignRoleUsers: async (roleId: number, userIds: number[]): Promise<ApiResponse<Role>> => {
    const response = await api.post(`/roles/${roleId}/assign-users`, { user_ids: userIds });
    return response.data;
  },

  assignRolePermissions: async (roleId: number, permissionIds: number[]): Promise<ApiResponse<Role>> => {
    const response = await api.post(`/roles/${roleId}/assign-permissions`, { permission_ids: permissionIds });
    return response.data;
  },

  getAllPermissions: async (): Promise<ApiResponse<Permission[]>> => {
    const response = await api.get('/roles/permissions/all');
    return response.data;
  },

  // Permission Management
  getPermissions: async (): Promise<ApiResponse<Permission[]>> => {
    const response = await api.get('/permissions');
    return response.data;
  },

  getPermission: async (id: number): Promise<ApiResponse<Permission>> => {
    const response = await api.get(`/permissions/${id}`);
    return response.data;
  },

  createPermission: async (data: { name: string; description?: string; category?: string }): Promise<ApiResponse<Permission>> => {
    const response = await api.post('/permissions', data);
    return response.data;
  },

  updatePermission: async (id: number, data: { name?: string; description?: string; category?: string }): Promise<ApiResponse<Permission>> => {
    const response = await api.put(`/permissions/${id}`, data);
    return response.data;
  },

  deletePermission: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/permissions/${id}`);
    return response.data;
  },

  // Guide Management
  getGuides: async (params?: any): Promise<PaginatedResponse<Guide>> => {
    const response = await api.get('/guides', { params });
    return response.data;
  },

  getGuide: async (id: number): Promise<ApiResponse<Guide>> => {
    const response = await api.get(`/guides/${id}`);
    return response.data;
  },

  createGuide: async (data: FormData): Promise<ApiResponse<Guide>> => {
    const response = await api.post('/guides', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateGuide: async (id: number, data: FormData): Promise<ApiResponse<Guide>> => {
    data.append('_method', 'PUT');
    const response = await api.post(`/guides/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteGuide: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/guides/${id}`);
    return response.data;
  },

  reorderGuides: async (guides: { id: number; order: number }[]): Promise<ApiResponse<null>> => {
    const response = await api.post('/guides/reorder', { guides });
    return response.data;
  },

  toggleGuideFeatured: async (id: number): Promise<ApiResponse<Guide>> => {
    const response = await api.patch(`/guides/${id}/featured`);
    return response.data;
  },

  updateGuideStatus: async (id: number, status: string): Promise<ApiResponse<Guide>> => {
    const response = await api.patch(`/guides/${id}/status`, { status });
    return response.data;
  },

  // Welcome Message Management
  getWelcomeMessages: async (params?: any): Promise<ApiResponse<WelcomeMessage[]>> => {
    const response = await api.get('/welcome-messages', { params });
    return response.data;
  },

  getWelcomeMessage: async (id: number): Promise<ApiResponse<WelcomeMessage>> => {
    const response = await api.get(`/welcome-messages/${id}`);
    return response.data;
  },

  createWelcomeMessage: async (data: FormData): Promise<ApiResponse<WelcomeMessage>> => {
    const response = await api.post('/welcome-messages', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateWelcomeMessage: async (id: number, data: FormData): Promise<ApiResponse<WelcomeMessage>> => {
    data.append('_method', 'PUT');
    const response = await api.post(`/welcome-messages/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteWelcomeMessage: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/welcome-messages/${id}`);
    return response.data;
  },

  toggleWelcomeMessageActive: async (id: number): Promise<ApiResponse<WelcomeMessage>> => {
    const response = await api.patch(`/welcome-messages/${id}/toggle-active`);
    return response.data;
  },

  // Gallery Management
  getGallery: async (): Promise<ApiResponse<Gallery[]>> => {
    const response = await api.get('/gallery');
    return response.data;
  },

  createGallery: async (data: FormData): Promise<ApiResponse<Gallery>> => {
    const response = await api.post('/gallery', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateGallery: async (id: number, data: FormData): Promise<ApiResponse<Gallery>> => {
    data.append('_method', 'PUT');
    const response = await api.post(`/gallery/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteGallery: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  },

  reorderGallery: async (galleries: Array<{ id: number; order: number }>): Promise<ApiResponse<null>> => {
    const response = await api.post('/gallery/reorder', { galleries });
    return response.data;
  },

  toggleGalleryStatus: async (id: number): Promise<ApiResponse<Gallery>> => {
    const response = await api.patch(`/gallery/${id}/toggle-status`);
    return response.data;
  },

  toggleGalleryFeatured: async (id: number): Promise<ApiResponse<Gallery>> => {
    const response = await api.patch(`/gallery/${id}/toggle-featured`);
    return response.data;
  },

  // Website Services Management
  getWebsiteServices: async (params?: any): Promise<PaginatedResponse<WebsiteService>> => {
    const response = await api.get('/website-services', { params });
    return response.data;
  },

  getWebsiteService: async (id: number): Promise<ApiResponse<WebsiteService>> => {
    const response = await api.get(`/website-services/${id}`);
    return response.data;
  },

  createWebsiteService: async (data: FormData): Promise<ApiResponse<WebsiteService>> => {
    const response = await api.post('/website-services', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateWebsiteService: async (id: number, data: FormData): Promise<ApiResponse<WebsiteService>> => {
    data.append('_method', 'PUT');
    const response = await api.post(`/website-services/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteWebsiteService: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/website-services/${id}`);
    return response.data;
  },

  reorderWebsiteServices: async (services: { id: number; order: number }[]): Promise<ApiResponse<null>> => {
    const response = await api.post('/website-services/reorder', { services });
    return response.data;
  },

  toggleWebsiteServiceStatus: async (id: number): Promise<ApiResponse<WebsiteService>> => {
    const response = await api.patch(`/website-services/${id}/toggle-status`);
    return response.data;
  },

  toggleWebsiteServiceFeatured: async (id: number): Promise<ApiResponse<WebsiteService>> => {
    const response = await api.patch(`/website-services/${id}/toggle-featured`);
    return response.data;
  },


  updateBandMember: async (id: number, data: FormData): Promise<ApiResponse<BandMember>> => {
    data.append('_method', 'PUT');
    const response = await api.post(`/band-members/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteBandMember: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/band-members/${id}`);
    return response.data;
  },

  reorderBandMembers: async (members: { id: number; order: number }[]): Promise<ApiResponse<null>> => {
    const response = await api.post('/band-members/reorder', { members });
    return response.data;
  },

  toggleBandMemberStatus: async (id: number): Promise<ApiResponse<BandMember>> => {
    const response = await api.patch(`/band-members/${id}/toggle-status`);
    return response.data;
  },

  // Director General Management
  getDirectorGeneral: async (params?: any): Promise<ApiResponse<DirectorGeneral[]>> => {
    const response = await api.get('/director-general', { params });
    return response.data;
  },

  getDirectorGeneralById: async (id: number): Promise<ApiResponse<DirectorGeneral>> => {
    const response = await api.get(`/director-general/${id}`);
    return response.data;
  },

  createDirectorGeneral: async (data: FormData): Promise<ApiResponse<DirectorGeneral>> => {
    const response = await api.post('/director-general', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateDirectorGeneral: async (id: number, data: FormData): Promise<ApiResponse<DirectorGeneral>> => {
    data.append('_method', 'PUT');
    const response = await api.post(`/director-general/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteDirectorGeneral: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/director-general/${id}`);
    return response.data;
  },

  reorderDirectorGeneral: async (directors: { id: number; order: number }[]): Promise<ApiResponse<null>> => {
    const response = await api.post('/director-general/reorder', { items: directors });
    return response.data;
  },

  // Announcements Management
  getAnnouncements: async (): Promise<ApiResponse<Announcement[]>> => {
    const response = await api.get('/announcements');
    return response.data;
  },

  getAnnouncement: async (id: number): Promise<ApiResponse<Announcement>> => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },

  createAnnouncement: async (data: FormData): Promise<ApiResponse<Announcement>> => {
    const response = await api.post('/announcements', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateAnnouncement: async (id: number, data: FormData): Promise<ApiResponse<Announcement>> => {
    // Use POST with method override for file uploads in Laravel
    data.append('_method', 'PUT');
    const response = await api.post(`/announcements/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteAnnouncement: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },

  toggleAnnouncementStatus: async (id: number): Promise<ApiResponse<Announcement>> => {
    const response = await api.patch(`/announcements/${id}/toggle-status`);
    return response.data;
  },

  reorderAnnouncements: async (announcements: { id: number; order: number }[]): Promise<ApiResponse<null>> => {
    const response = await api.post('/announcements/reorder', { announcements });
    return response.data;
  },

  // Videos Management
  getVideos: async (): Promise<ApiResponse<Video[]>> => {
    const response = await api.get('/videos');
    return response.data;
  },

  getVideo: async (id: number): Promise<ApiResponse<Video>> => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  createVideo: async (data: FormData): Promise<ApiResponse<Video>> => {
    const response = await api.post('/videos', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateVideo: async (id: number, data: FormData): Promise<ApiResponse<Video>> => {
    // Use POST with method override for file uploads in Laravel
    data.append('_method', 'PUT');
    const response = await api.post(`/videos/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteVideo: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },

  toggleVideoStatus: async (id: number): Promise<ApiResponse<Video>> => {
    const response = await api.patch(`/videos/${id}/toggle-status`);
    return response.data;
  },

  toggleVideoMain: async (id: number): Promise<ApiResponse<Video>> => {
    const response = await api.patch(`/videos/${id}/toggle-main`);
    return response.data;
  },

  reorderVideos: async (videos: { id: number; order: number }[]): Promise<ApiResponse<null>> => {
    const response = await api.post('/videos/reorder', { videos });
    return response.data;
  },

  // Downloads Management
  getDownloads: async (): Promise<ApiResponse<Download[]>> => {
    const response = await api.get('/downloads');
    return response.data;
  },

  getDownload: async (id: number): Promise<ApiResponse<Download>> => {
    const response = await api.get(`/downloads/${id}`);
    return response.data;
  },

  createDownload: async (data: FormData): Promise<ApiResponse<Download>> => {
    const response = await api.post('/downloads', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateDownload: async (id: number, data: FormData): Promise<ApiResponse<Download>> => {
    // Use POST with method override for file uploads in Laravel
    data.append('_method', 'PUT');
    const response = await api.post(`/downloads/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteDownload: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/downloads/${id}`);
    return response.data;
  },

  toggleDownloadStatus: async (id: number): Promise<ApiResponse<Download>> => {
    const response = await api.patch(`/downloads/${id}/toggle-status`);
    return response.data;
  },

  reorderDownloads: async (downloads: { id: number; order: number }[]): Promise<ApiResponse<null>> => {
    const response = await api.post('/downloads/reorder', { downloads });
    return response.data;
  },
};

// Role Management API
export const roleAPI = {
  getRoles: async (): Promise<ApiResponse<Role[]>> => {
    const response = await api.get('/roles');
    return response.data;
  },

  getRole: async (id: number): Promise<ApiResponse<Role>> => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  createRole: async (data: Partial<Role>): Promise<ApiResponse<Role>> => {
    const response = await api.post('/roles', data);
    return response.data;
  },

  updateRole: async (id: number, data: Partial<Role>): Promise<ApiResponse<Role>> => {
    const response = await api.put(`/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  },

  getRolePermissions: async (id: number): Promise<ApiResponse<Permission[]>> => {
    const response = await api.get(`/roles/${id}/permissions`);
    return response.data;
  },
};

// Permission Management API
export const permissionAPI = {
  getPermissions: async (): Promise<ApiResponse<Permission[]>> => {
    const response = await api.get('/permissions');
    return response.data;
  },

  getPermission: async (id: number): Promise<ApiResponse<Permission>> => {
    const response = await api.get(`/permissions/${id}`);
    return response.data;
  },

  createPermission: async (data: Partial<Permission>): Promise<ApiResponse<Permission>> => {
    const response = await api.post('/permissions', data);
    return response.data;
  },

  updatePermission: async (id: number, data: Partial<Permission>): Promise<ApiResponse<Permission>> => {
    const response = await api.put(`/permissions/${id}`, data);
    return response.data;
  },

  deletePermission: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/permissions/${id}`);
    return response.data;
  },

  getPermissionsGrouped: async (): Promise<ApiResponse<Record<string, Permission[]>>> => {
    const response = await api.get('/permissions/grouped');
    return response.data;
  },

  getPermissionGroups: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/permissions/groups');
    return response.data;
  },
};

// User Role Management API
export const userRoleAPI = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserRoles: async (userId: number): Promise<ApiResponse<Role[]>> => {
    const response = await api.get(`/users/${userId}/roles`);
    return response.data;
  },

  assignUserRoles: async (userId: number, roleIds: number[]): Promise<ApiResponse<Role[]>> => {
    const response = await api.post(`/users/${userId}/assign-roles`, { roles: roleIds });
    return response.data;
  },

  getUserPermissions: async (userId: number): Promise<ApiResponse<Permission[]>> => {
    const response = await api.get(`/users/${userId}/permissions`);
    return response.data;
  },

  checkUserPermission: async (userId: number, permission: string): Promise<ApiResponse<{ has_permission: boolean }>> => {
    const response = await api.post(`/users/${userId}/check-permission`, { permission });
    return response.data;
  },
};

export default api;
