export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isPopular: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MenuItemInput = Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>;

export interface Table {
  id: number;
  tableNumber: number;
  capacity: number;
  location: string;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Reservation {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  specialNotes?: string | null;
  status: ReservationStatus;
  tableId?: number | null;
  table?: Table | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  specialNotes?: string;
}

export interface AvailableSlot {
  timeSlot: string;
  available: boolean;
  remainingTables: number;
  reason?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF';
}

export interface DashboardStats {
  totalMenuItems: number;
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  todayReservations: number;
  totalMessages: number;
  unreadMessages: number;
  recentReservations: Reservation[];
}
