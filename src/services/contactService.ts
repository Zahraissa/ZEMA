import api from './api';

export interface ContactOffice {
  id: number;
  title: string;
  office_type: 'headquarter' | 'regional' | 'research';
  office_name: string;
  location: string;
  postal_address: string;
  email: string;
  phone: string;
  helpdesk?: string;
  map_embed_url?: string;
  map_latitude?: number;
  map_longitude?: number;
  map_rating?: number;
  map_reviews?: number;
  order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ContactOfficesResponse {
  success: boolean;
  data: ContactOffice[];
}

export interface ContactOfficeResponse {
  success: boolean;
  data: ContactOffice;
}

export interface AllOfficesResponse {
  success: boolean;
  data: {
    headquarters: ContactOffice[];
    regional: ContactOffice[];
    research: ContactOffice[];
  };
}

class ContactService {
  private baseUrl = 'contact/offices';

  // Get all active contact offices
  async getActiveOffices(): Promise<ContactOfficesResponse> {
    const response = await api.get(`${this.baseUrl}/active`);
    return response.data;
  }

  // Get all offices organized by type
  async getAllOffices(): Promise<AllOfficesResponse> {
    const response = await api.get(`${this.baseUrl}/all`);
    return response.data;
  }

  // Get all offices for management (including inactive)
  async getAllOfficesForManagement(): Promise<ContactOfficesResponse> {
    try {
      const fullUrl = `${api.defaults.baseURL}${this.baseUrl}`;
      console.log('=== ContactService Debug ===');
      console.log('API Base URL:', api.defaults.baseURL);
      console.log('Base URL:', this.baseUrl);
      console.log('Full URL:', fullUrl);
      console.log('Fetching offices from:', fullUrl);
      console.log('Making API request to:', this.baseUrl);
      
      const response = await api.get(this.baseUrl);
      console.log('Management API Response:', response.data); // Debug log
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response URL:', response.config.url);
      console.log('Full response object:', response);
      console.log('Response data type:', typeof response.data);
      console.log('Response data keys:', Object.keys(response.data || {}));
      
      // The response is paginated, so we need to extract the data array
      if (response.data && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
        console.log('Found nested paginated data with', response.data.data.data.length, 'offices');
        return {
          success: response.data.success,
          data: response.data.data.data
        };
      }
      
      // Check for regular paginated data
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log('Found paginated data with', response.data.data.length, 'offices');
        return {
          success: response.data.success,
          data: response.data.data
        };
      }
      
      // If it's not paginated, return as is
      if (response.data && Array.isArray(response.data)) {
        console.log('Found direct array data with', response.data.length, 'offices');
        return {
          success: true,
          data: response.data
        };
      }
      
      // Additional check for different response structure
      if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data)) {
        console.log('Found alternative paginated data with', response.data.data.length, 'offices');
        return {
          success: response.data.success,
          data: response.data.data
        };
      }
      
      // Check if response.data is directly the array
      if (response.data && Array.isArray(response.data)) {
        console.log('Found direct response data array with', response.data.length, 'offices');
        return {
          success: true,
          data: response.data
        };
      }
      
      // Fallback: return empty array
      console.log('No valid data found, returning empty array');
      console.log('Response data structure:', JSON.stringify(response.data, null, 2));
      return {
        success: false,
        data: []
      };
    } catch (error) {
      console.error('Error in getAllOfficesForManagement:', error);
      throw error;
    }
  }

  // Get headquarters only
  async getHeadquarters(): Promise<ContactOfficesResponse> {
    const response = await api.get(`${this.baseUrl}/headquarters`);
    return response.data;
  }

  // Get regional offices only
  async getRegionalOffices(): Promise<ContactOfficesResponse> {
    const response = await api.get(`${this.baseUrl}/regional`);
    return response.data;
  }

  // Get research centers only
  async getResearchCenters(): Promise<ContactOfficesResponse> {
    const response = await api.get(`${this.baseUrl}/research`);
    return response.data;
  }

  // Get offices by type
  async getOfficesByType(type: 'headquarter' | 'regional' | 'research'): Promise<ContactOfficesResponse> {
    const response = await api.get(`${this.baseUrl}/type/${type}`);
    return response.data;
  }

  // Get single office
  async getOffice(id: number): Promise<ContactOfficeResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Create new office (admin only)
  async createOffice(officeData: Partial<ContactOffice>): Promise<ContactOfficeResponse> {
    console.log('Creating office with data:', officeData);
    const response = await api.post(this.baseUrl, officeData);
    console.log('Create office response:', response.data);
    return response.data;
  }

  // Update office (admin only)
  async updateOffice(id: number, officeData: Partial<ContactOffice>): Promise<ContactOfficeResponse> {
    console.log('Updating office with data:', officeData);
    // Use PUT method directly since the API supports it
    const response = await api.put(`${this.baseUrl}/${id}`, officeData);
    console.log('Update office response:', response.data);
    return response.data;
  }

  // Delete office (admin only)
  async deleteOffice(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Toggle office status (admin only)
  async toggleStatus(id: number): Promise<ContactOfficeResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}/toggle-status`);
    return response.data;
  }
}

export const contactService = new ContactService();
