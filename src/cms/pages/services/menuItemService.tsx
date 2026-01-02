// src/services/menuItemService.ts
import axios from "axios";
import { API_BASE_URL } from "../../../config";

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  link?: string;
  icon?: string;
  status: 'active' | 'inactive';
  order: number;
  menu_group_id: number;
  created_at: string;
  updated_at: string;
}

// Create axios instance with auth headers
const createAuthAxios = () => {
  const token = localStorage.getItem('authToken');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
};

class MenuItemService {
  async getMenuItems(): Promise<MenuItem[]> {
    const api = createAuthAxios();
    const res = await api.get<{success: boolean, data: MenuItem[]}>(`menu/items`);
    return res.data.data;
  }

  async getMenuItemById(id: number): Promise<MenuItem> {
    const api = createAuthAxios();
    const res = await api.get<{success: boolean, data: MenuItem}>(`menu/items/${id}`);
    return res.data.data;
  }

  async createMenuItem(menuItemData: Omit<MenuItem, "id" | "created_at" | "updated_at">): Promise<MenuItem> {
    const api = createAuthAxios();
    const res = await api.post<{success: boolean, data: MenuItem}>(
      `menu/items`,
      menuItemData
    );
    return res.data.data;
  }

  async updateMenuItem(
    id: number,
    menuItemData: Partial<MenuItem>
  ): Promise<MenuItem> {
    const api = createAuthAxios();
    const res = await api.put<{success: boolean, data: MenuItem}>(
      `menu/items/${id}`,
      menuItemData
    );
    return res.data.data;
  }

  async deleteMenuItem(id: number): Promise<void> {
    const api = createAuthAxios();
    await api.delete(`menu/items/${id}`);
  }
}

export default new MenuItemService();
