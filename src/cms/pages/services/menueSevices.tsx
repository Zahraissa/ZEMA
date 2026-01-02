// src/services/apiService.ts
import axios from "axios";
import { API_BASE_URL } from "../../../config";
export interface MenuType {
  id: number;
  name: string;
  translation: string;
  description: string;
}

class MenueSevices {
  async getMenuTypes(): Promise<MenuType[]> {
    const res = await axios.get<MenuType[]>(`${API_BASE_URL}menu_types`);
    return res.data;
  }

  async getMenuTypeById(id: number): Promise<MenuType> {
    const res = await axios.get<MenuType>(`${API_BASE_URL}menu_types/${id}`);
    return res.data;
  }

  async createMenuType(MenuTypeData: Omit<MenuType, "id">): Promise<MenuType> {
    const res = await axios.post<MenuType>(
      `${API_BASE_URL}menu_types`,
      MenuTypeData
    );
    return res.data;
  }

  async updateMenuType(
    id: number,
    MenuTypeData: Partial<MenuType>
  ): Promise<MenuType> {
    const res = await axios.put<MenuType>(
      `${API_BASE_URL}menu_types/${id}`,
      MenuTypeData
    );
    return res.data;
  }

  async deleteMenuType(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}menu_types/${id}`);
  }
}

export default new MenueSevices();
