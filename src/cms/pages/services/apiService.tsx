// src/services/apiService.ts
import axios from "axios";
import { API_BASE_URL } from "../../../config";
export interface News {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  author_name: string;
  status: string;
  publishDate: string;
  views: string;
}

class ApiService {
  async getNews(): Promise<News[]> {
    const res = await axios.get<News[]>(`${API_BASE_URL}news`);
    return res.data;
  }

  async getNewsById(id: number): Promise<News> {
    const res = await axios.get<News>(`${API_BASE_URL}news/${id}`);
    return res.data;
  }

  async createNews(NewsData: Omit<News, "id">): Promise<News> {
    const res = await axios.post<News>(`${API_BASE_URL}news`, NewsData);
    return res.data;
  }

  async updateNews(id: number, NewsData: Partial<News>): Promise<News> {
    const res = await axios.put<News>(`${API_BASE_URL}news/${id}`, NewsData);
    return res.data;
  }

  async deleteNews(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}news/${id}`);
  }
}

export default new ApiService();
