import { request } from './api';
import { ContactMessage, ContactMessageInput } from '../types';

export const contactService = {
  async sendMessage(data: ContactMessageInput): Promise<ContactMessage> {
    const res = await request<{ success: boolean; data: ContactMessage; message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async getMessages(): Promise<ContactMessage[]> {
    const res = await request<{ success: boolean; data: ContactMessage[] }>('/contact');
    return res.data;
  },

  async markAsRead(id: string, isRead = true): Promise<ContactMessage> {
    const res = await request<{ success: boolean; data: ContactMessage; message: string }>(
      `/contact/${id}/read`,
      {
        method: 'PATCH',
        body: JSON.stringify({ isRead }),
      }
    );
    return res.data;
  },

  async deleteMessage(id: string): Promise<void> {
    await request<{ success: boolean; message: string }>(`/contact/${id}`, {
      method: 'DELETE',
    });
  },
};
