import axios from 'axios';
import { API_BASE_URL, NORMALIZED_API_BASE_URL } from '@/config';

// Create a dedicated axios instance for guidelines API
const guidelinesAPI = axios.create({
  baseURL: `${NORMALIZED_API_BASE_URL}guidelines`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate instance for management API
const managementAPI = axios.create({
  baseURL: NORMALIZED_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and handle FormData
const addAuthToken = (config: any) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // If FormData is being sent, remove Content-Type header to let axios set it automatically with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
};

const handleRequestError = (error: any) => {
  return Promise.reject(error);
};

const handleResponseError = (error: any) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    window.location.href = '/cms/login';
  }
  return Promise.reject(error);
};

// Apply interceptors to both instances
guidelinesAPI.interceptors.request.use(addAuthToken, handleRequestError);
guidelinesAPI.interceptors.response.use(
  (response) => response,
  handleResponseError
);

managementAPI.interceptors.request.use(addAuthToken, handleRequestError);
managementAPI.interceptors.response.use(
  (response) => response,
  handleResponseError
);

export interface PolicyGuideline {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  document_type: string;
  version: string;
  author: string;
  department: string;
  date_published: string;
  status: string;
  tags?: string[] | null;
  isMainDocument: boolean;
  featured: boolean;
  order: number;
  file_name?: string;
  file_size?: number;
  file_path?: string;
  fileUrl?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePolicyGuidelineData {
  title: string;
  description: string;
  category: string;
  document_type: string;
  version: string;
  author: string;
  department: string;
  date_published: string;
  status: string;
  tags: string[];
  is_main_document: boolean;
  featured: boolean;
  order: number;
  file?: File;
}

export interface UpdatePolicyGuidelineData {
  id: number;
  title: string;
  description: string;
  category: string;
  document_type: string;
  version: string;
  author: string;
  department: string;
  date_published: string;
  status: string;
  tags: string[];
  is_main_document: boolean;
  featured: boolean;
  order: number;
  file?: File;
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

export interface CreateStandardData {
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
  tags?: string[];
  featured: boolean;
  order: number;
  file?: File;
  file_url?: string;
}

export interface UpdateStandardData extends CreateStandardData {
  id: number;
}

export interface CreateSampleTemplateData {
  title: string;
  description?: string;
  content?: string;
  template_type: string;
  category: string;
  template_category?: string;
  use_case?: string;
  version: string;
  status: 'active' | 'inactive' | 'draft';
  author?: string;
  department?: string;
  date_published: string;
  tags?: string[];
  prerequisites?: string[];
  estimated_time?: string;
  complexity?: string;
  featured: boolean;
  order: number;
  file?: File;
  file_url?: string;
}

export interface UpdateSampleTemplateData extends CreateSampleTemplateData {
  id: number;
}

export interface SampleTemplate {
  id: number;
  title: string;
  description?: string;
  content?: string;
  template_type: string;
  category: string;
  templateCategory?: string;
  useCase?: string;
  version: string;
  status: 'active' | 'inactive' | 'draft';
  author?: string;
  department?: string;
  date_published: string;
  tags?: string[] | null;
  prerequisites?: string[] | null;
  estimatedTime?: string;
  complexity?: string;
  featured: boolean;
  order: number;
  file_name?: string;
  file_size?: number;
  file_path?: string;
  fileUrl?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

class EnhancedGuidelinesService {
  // ===== POLICY GUIDELINES =====
  async getPolicyGuidelineById(id: number): Promise<PolicyGuideline> {
    try {
      console.log('Fetching policy guideline by ID:', id);
      console.log('API URL:', `${API_BASE_URL}guidelines/${id}/edit`);
      
      // Use the management endpoint for editing
      const response = await managementAPI.get(`/guidelines/${id}/edit`);
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      const guideline = response.data.data;
      
      // Normalize file URL
      if (!guideline.fileUrl) {
        if (guideline.file_url) {
          guideline.fileUrl = guideline.file_url;
        } else if (guideline.file_path) {
          const baseUrl = API_BASE_URL.replace('/api/api/', '').replace('/api/', '').replace(/\/+$/, '');
          guideline.fileUrl = `${baseUrl}/storage/${guideline.file_path}`;
        }
      }
      
      return guideline;
    } catch (error: any) {
      console.error('Error fetching policy guideline by ID:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error;
    }
  }

  async getAllPolicyGuidelines(): Promise<PolicyGuideline[]> {
    try {
      // Check authentication status
      const token = localStorage.getItem('authToken');
      console.log('Auth token exists:', !!token);
      console.log('Auth token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      console.log('Fetching policy guidelines from:', `${API_BASE_URL}guidelines-management`);
      
      const response = await managementAPI.get('/guidelines-management');
      console.log('Raw API Response:', response);
      console.log('Response status:', response.status);
      console.log('Response data structure:', response.data);
      
      // Handle paginated response structure
      const guidelines = response.data.data.data || response.data.data || response.data || [];
      console.log('Extracted guidelines:', guidelines);
      console.log('Number of guidelines:', guidelines.length);
      
      // Normalize file URLs - ensure fileUrl is set from file_url or file_path
      const normalizedGuidelines = guidelines.map((guideline: any) => {
        // If fileUrl doesn't exist, try to get it from file_url or construct from file_path
        if (!guideline.fileUrl) {
          if (guideline.file_url) {
            guideline.fileUrl = guideline.file_url;
          } else if (guideline.file_path) {
            // Construct storage URL from file_path
            const baseUrl = API_BASE_URL.replace('/api/api/', '').replace('/api/', '').replace(/\/+$/, '');
            guideline.fileUrl = `${baseUrl}/storage/${guideline.file_path}`;
          }
        }
        return guideline;
      });
      
      return normalizedGuidelines;
    } catch (error: any) {
      console.error('Error fetching policy guidelines:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  }

  async createPolicyGuideline(data: CreatePolicyGuidelineData): Promise<PolicyGuideline> {
    try {
      const formData = new FormData();
      
      // Append all fields to FormData
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('document_type', data.document_type);
      formData.append('version', data.version);
      formData.append('author', data.author);
      formData.append('department', data.department);
      formData.append('date_published', data.date_published);
      formData.append('status', data.status);
      formData.append('is_main_document', data.is_main_document ? '1' : '0');
      formData.append('featured', data.featured ? '1' : '0');
      formData.append('order', data.order.toString());
      
      // Handle tags array
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }
      
      // Handle file upload - CRITICAL: Must append file to FormData
      if (data.file) {
        console.log('Appending file to FormData:', {
          name: data.file.name,
          size: data.file.size,
          type: data.file.type
        });
        formData.append('file', data.file);
      } else {
        console.warn('No file provided in createPolicyGuideline');
      }
      
      // Log FormData contents for debugging
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, ':', { name: value.name, size: value.size, type: value.type });
        } else {
          console.log(key, ':', value);
        }
      }

      // Don't set Content-Type manually - axios will set it automatically with the correct boundary
      const response = await guidelinesAPI.post('', formData);
      
      // Check if file was actually uploaded
      const guideline = response.data.data || response.data;
      
      console.log('Create response:', {
        success: response.data.success,
        message: response.data.message,
        guideline: guideline,
        has_file_path: !!guideline.file_path,
        file_path: guideline.file_path,
        file_name: guideline.file_name
      });
      
      // Normalize file URL - ensure fileUrl is set from file_url or file_path
      if (!guideline.fileUrl) {
        if (guideline.file_url) {
          guideline.fileUrl = guideline.file_url;
        } else if (guideline.file_path) {
          // Construct storage URL from file_path
          const baseUrl = API_BASE_URL.replace('/api/api/', '').replace('/api/', '').replace(/\/+$/, '');
          guideline.fileUrl = `${baseUrl}/storage/${guideline.file_path}`;
        }
      }
      
      if (data.file && !guideline.file_path && !guideline.fileUrl) {
        console.warn('File was provided but not uploaded:', {
          file_name: data.file.name,
          guideline_id: guideline.id,
          response_data: response.data
        });
        throw new Error('File upload failed. The guideline was created but the file was not uploaded.');
      }

      return guideline;
    } catch (error: any) {
      console.error('Error creating policy guideline:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  async updatePolicyGuideline(data: UpdatePolicyGuidelineData): Promise<PolicyGuideline> {
    try {
      const formData = new FormData();
      
      // Append all fields to FormData
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('document_type', data.document_type);
      formData.append('version', data.version);
      formData.append('author', data.author);
      formData.append('department', data.department);
      formData.append('date_published', data.date_published);
      formData.append('status', data.status);
      formData.append('is_main_document', data.is_main_document ? '1' : '0');
      formData.append('featured', data.featured ? '1' : '0');
      formData.append('order', data.order.toString());
      
      // Handle tags array
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }
      
      // Handle file upload - CRITICAL: Must append file to FormData
      if (data.file) {
        console.log('Appending file to FormData (update):', {
          name: data.file.name,
          size: data.file.size,
          type: data.file.type
        });
        formData.append('file', data.file);
      } else {
        console.warn('No file provided in updatePolicyGuideline');
      }

      // Log FormData contents for debugging
      console.log('FormData entries (update):');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, ':', { name: value.name, size: value.size, type: value.type });
        } else {
          console.log(key, ':', value);
        }
      }

      // Try PUT request first - axios handles FormData with PUT correctly
      // Don't set Content-Type manually - axios will set it automatically with the correct boundary
      let response;
      try {
        response = await guidelinesAPI.put(`/${data.id}`, formData);
      } catch (putError: any) {
        // If PUT fails with method not allowed (405) or not found (404), try POST with _method override
        if (putError.response?.status === 405 || putError.response?.status === 404) {
          console.log('PUT request failed, trying POST with _method override');
          // Create a new FormData to avoid appending _method multiple times
          const formDataWithMethod = new FormData();
          for (let [key, value] of formData.entries()) {
            formDataWithMethod.append(key, value);
          }
          formDataWithMethod.append('_method', 'PUT');
          response = await guidelinesAPI.post(`/${data.id}`, formDataWithMethod);
        } else {
          throw putError;
        }
      }
      
      // Check if file was actually uploaded
      const guideline = response.data.data || response.data;
      
      console.log('Update response:', {
        success: response.data.success,
        message: response.data.message,
        guideline: guideline,
        has_file_path: !!guideline.file_path,
        file_path: guideline.file_path,
        file_name: guideline.file_name,
        fileUrl: guideline.fileUrl
      });
      
      // Normalize file URL - ensure fileUrl is set from file_url or file_path
      if (!guideline.fileUrl) {
        if (guideline.file_url) {
          guideline.fileUrl = guideline.file_url;
        } else if (guideline.file_path) {
          // Construct storage URL from file_path
          const baseUrl = API_BASE_URL.replace('/api/api/', '').replace('/api/', '').replace(/\/+$/, '');
          guideline.fileUrl = `${baseUrl}/storage/${guideline.file_path}`;
        }
      }
      
      if (data.file && !guideline.file_path && !guideline.fileUrl) {
        console.warn('File was provided but not uploaded (update):', {
          file_name: data.file.name,
          guideline_id: guideline.id,
          response_data: response.data
        });
        throw new Error('File upload failed. The guideline was updated but the file was not uploaded.');
      }

      return guideline;
    } catch (error: any) {
      console.error('Error updating policy guideline:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  }

  async deletePolicyGuideline(id: number): Promise<boolean> {
    try {
      await guidelinesAPI.delete(`/${id}`);
      return true;
    } catch (error: any) {
      console.error('Error deleting policy guideline:', error);
      throw error;
    }
  }

  // ===== GUIDELINES GROUPS =====
  async getAllGuidelinesGroups(): Promise<GuidelinesGroup[]> {
    try {
      console.log('Fetching guidelines groups from:', `${API_BASE_URL}guidelines-groups`);
      
      const response = await managementAPI.get('/guidelines-groups');
      console.log('Guidelines groups response:', response.data);
      
      // Handle different response structures
      const groups = response.data.data || response.data || [];
      console.log('Extracted groups:', groups);
      
      return groups;
    } catch (error: any) {
      console.error('Error fetching guidelines groups:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Return empty array if no data found
      return [];
    }
  }

  // ===== GUIDELINES STANDARDS =====
  async getAllGuidelinesStandards(): Promise<GuidelineStandard[]> {
    try {
      console.log('Fetching guidelines standards from:', `${API_BASE_URL}guidelines-standards`);
      
      const response = await managementAPI.get('/guidelines-standards');
      console.log('Guidelines standards response:', response.data);
      
      // Handle different response structures
      const standards = response.data.data || response.data || [];
      console.log('Extracted standards:', standards);
      
      return standards;
    } catch (error: any) {
      console.error('Error fetching guidelines standards:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Return empty array if no data found
      return [];
    }
  }

  // ===== SAMPLES & TEMPLATES =====
  async getAllSamplesTemplates(): Promise<SampleTemplate[]> {
    try {
      console.log('Fetching samples templates from:', `${API_BASE_URL}samples-templates`);
      
      const response = await managementAPI.get('/samples-templates');
      console.log('Samples templates response:', response.data);
      
      // Handle different response structures
      const templates = response.data.data || response.data || [];
      console.log('Extracted templates:', templates);
      
      return templates;
    } catch (error: any) {
      console.error('Error fetching samples templates:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Return empty array if no data found
      return [];
    }
  }

  async deleteSampleTemplate(id: number): Promise<boolean> {
    try {
      console.log('Deleting sample template with ID:', id);
      
      await managementAPI.delete(`/samples-templates/${id}`);
      console.log('Sample template deleted successfully');
      
      return true;
    } catch (error: any) {
      console.error('Error deleting sample template:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      throw error;
    }
  }

  async getSampleTemplateById(id: number): Promise<SampleTemplate> {
    try {
      const response = await managementAPI.get(`/samples-templates/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching sample template by ID:', error);
      throw error;
    }
  }

  async createSampleTemplate(data: CreateSampleTemplateData): Promise<SampleTemplate> {
    try {
      const formData = new FormData();
      
      // Append all required fields to FormData
      formData.append('title', data.title);
      formData.append('template_type', data.template_type);
      formData.append('category', data.category);
      formData.append('version', data.version);
      formData.append('status', data.status);
      formData.append('date_published', data.date_published);
      formData.append('featured', data.featured ? '1' : '0');
      formData.append('order', data.order.toString());
      
      // Append optional fields
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.content) {
        formData.append('content', data.content);
      }
      if (data.template_category) {
        formData.append('template_category', data.template_category);
      }
      if (data.use_case) {
        formData.append('use_case', data.use_case);
      }
      if (data.author) {
        formData.append('author', data.author);
      }
      if (data.department) {
        formData.append('department', data.department);
      }
      if (data.estimated_time) {
        formData.append('estimated_time', data.estimated_time);
      }
      if (data.complexity) {
        formData.append('complexity', data.complexity);
      }
      if (data.file_url) {
        formData.append('file_url', data.file_url);
      }
      
      // Handle tags array
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }
      
      // Handle prerequisites array
      if (data.prerequisites && data.prerequisites.length > 0) {
        data.prerequisites.forEach((prereq, index) => {
          formData.append(`prerequisites[${index}]`, prereq);
        });
      }
      
      // Handle file upload
      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await managementAPI.post('/samples-templates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error creating sample template:', error);
      throw error;
    }
  }

  async deleteStandard(id: number): Promise<boolean> {
    try {
      console.log('Deleting standard with ID:', id);
      
      await managementAPI.delete(`/guidelines-standards/${id}`);
      console.log('Standard deleted successfully');
      
      return true;
    } catch (error: any) {
      console.error('Error deleting standard:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      throw error;
    }
  }

  async getStandardById(id: number): Promise<GuidelineStandard> {
    try {
      const response = await managementAPI.get(`/guidelines-standards/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching standard by ID:', error);
      throw error;
    }
  }

  async createStandard(data: CreateStandardData): Promise<GuidelineStandard> {
    try {
      const formData = new FormData();
      
      // Append all required fields to FormData
      formData.append('title', data.title);
      formData.append('group_id', data.group_id.toString());
      formData.append('standard_type', data.standard_type);
      formData.append('maturity_level', data.maturity_level);
      formData.append('version', data.version);
      formData.append('status', data.status);
      formData.append('date_published', data.date_published);
      formData.append('featured', data.featured ? '1' : '0');
      formData.append('order', data.order.toString());
      
      // Append optional fields
      // Always append description (can be empty string)
      formData.append('description', data.description || '');
      if (data.content) {
        formData.append('content', data.content);
      }
      if (data.author) {
        formData.append('author', data.author);
      }
      if (data.department) {
        formData.append('department', data.department);
      }
      if (data.file_url) {
        formData.append('file_url', data.file_url);
      }
      
      // Handle tags array
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }
      
      // Handle file upload
      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await managementAPI.post('/guidelines-standards', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error creating standard:', error);
      throw error;
    }
  }

  async updateStandard(data: UpdateStandardData): Promise<GuidelineStandard> {
    try {
      const formData = new FormData();
      
      // Append all required fields to FormData
      formData.append('title', data.title);
      formData.append('group_id', data.group_id.toString());
      formData.append('standard_type', data.standard_type);
      formData.append('maturity_level', data.maturity_level);
      formData.append('version', data.version);
      formData.append('status', data.status);
      formData.append('date_published', data.date_published);
      formData.append('featured', data.featured ? '1' : '0');
      formData.append('order', data.order.toString());
      
      // Append optional fields
      // Always append description (can be empty string)
      formData.append('description', data.description || '');
      if (data.content) {
        formData.append('content', data.content);
      }
      if (data.author) {
        formData.append('author', data.author);
      }
      if (data.department) {
        formData.append('department', data.department);
      }
      if (data.file_url) {
        formData.append('file_url', data.file_url);
      }
      
      // Handle tags array
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }
      
      // Handle file upload
      if (data.file) {
        formData.append('file', data.file);
      }

      // Add method override for PUT request
      formData.append('_method', 'PUT');

      const response = await managementAPI.post(`/guidelines-standards/${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error updating standard:', error);
      throw error;
    }
  }
}

// Create and export service instance
export const enhancedGuidelinesService = new EnhancedGuidelinesService();
export default enhancedGuidelinesService;
