import { request } from './api';
import { Reservation, ReservationInput, AvailableSlot, Table, ReservationStatus } from '../types';

export interface ReservationFilterParams {
  status?: string;
  date?: string;
  search?: string;
}

export const reservationService = {
  async bookTable(data: ReservationInput): Promise<Reservation> {
    const res = await request<{ success: boolean; data: Reservation; message: string }>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async getAvailableSlots(date: string, guests: number): Promise<AvailableSlot[]> {
    const res = await request<{ success: boolean; data: AvailableSlot[] }>(
      `/reservations/available-slots?date=${encodeURIComponent(date)}&guests=${guests}`
    );
    return res.data;
  },

  async getReservations(filters: ReservationFilterParams = {}): Promise<Reservation[]> {
    const query = new URLSearchParams();
    if (filters.status && filters.status !== 'ALL') query.append('status', filters.status);
    if (filters.date) query.append('date', filters.date);
    if (filters.search) query.append('search', filters.search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<{ success: boolean; count: number; data: Reservation[] }>(`/reservations${qs}`);
    return res.data;
  },

  async getReservationById(id: string): Promise<Reservation> {
    const res = await request<{ success: boolean; data: Reservation }>(`/reservations/${id}`);
    return res.data;
  },

  async updateStatus(id: string, status: ReservationStatus, tableId?: number | null): Promise<Reservation> {
    const res = await request<{ success: boolean; data: Reservation; message: string }>(
      `/reservations/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, tableId }),
      }
    );
    return res.data;
  },

  async deleteReservation(id: string): Promise<void> {
    await request<{ success: boolean; message: string }>(`/reservations/${id}`, {
      method: 'DELETE',
    });
  },

  async getTables(): Promise<Table[]> {
    const res = await request<{ success: boolean; data: Table[] }>('/reservations/tables');
    return res.data;
  },
};
