import { request } from './api';
import { User, DashboardStats } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const res = await request<{ success: boolean; data: User; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return res.data;
  },

  async logout(): Promise<void> {
    await request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await request<{ success: boolean; data: User }>('/auth/me');
      return res.data;
    } catch {
      return null;
    }
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await request<{ success: boolean; data: DashboardStats }>('/admin/stats');
    return res.data;
  },
};
