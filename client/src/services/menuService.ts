import { request } from './api';
import { MenuItem, MenuItemInput } from '../types';

export interface MenuQueryParams {
  category?: string;
  search?: string;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  popular?: boolean;
  availableOnly?: boolean;
}

export const menuService = {
  async getMenuItems(params: MenuQueryParams = {}): Promise<MenuItem[]> {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.vegetarian) query.append('vegetarian', 'true');
    if (params.vegan) query.append('vegan', 'true');
    if (params.glutenFree) query.append('glutenFree', 'true');
    if (params.popular) query.append('popular', 'true');
    if (params.availableOnly !== undefined) query.append('availableOnly', String(params.availableOnly));

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<{ success: boolean; data: MenuItem[] }>(`/menu${qs}`);
    return res.data;
  },

  async getMenuItemById(id: string): Promise<MenuItem> {
    const res = await request<{ success: boolean; data: MenuItem }>(`/menu/${id}`);
    return res.data;
  },

  async createMenuItem(data: MenuItemInput): Promise<MenuItem> {
    const res = await request<{ success: boolean; data: MenuItem; message: string }>('/menu', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateMenuItem(id: string, data: Partial<MenuItemInput>): Promise<MenuItem> {
    const res = await request<{ success: boolean; data: MenuItem; message: string }>(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteMenuItem(id: string): Promise<void> {
    await request<{ success: boolean; message: string }>(`/menu/${id}`, {
      method: 'DELETE',
    });
  },
};
