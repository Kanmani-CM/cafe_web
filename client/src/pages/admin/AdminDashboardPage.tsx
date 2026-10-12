import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  MenuItem,
  MenuItemInput,
  Reservation,
  ContactMessage,
  DashboardStats,
  Table,
  ReservationStatus,
} from '../../types';
import { authService } from '../../services/authService';
import { menuService } from '../../services/menuService';
import { reservationService } from '../../services/reservationService';
import { contactService } from '../../services/contactService';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

type TabType = 'overview' | 'menu' | 'reservations' | 'messages';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { user, logout, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Stats
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Menu State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm] = useState<MenuItemInput>({
    name: '',
    description: '',
    price: 5.0,
    imageUrl: '',
    category: 'Coffee',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isPopular: false,
    isAvailable: true,
  });

  // Reservations State
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [resStatusFilter, setResStatusFilter] = useState('ALL');
  const [resSearch, setResSearch] = useState('');

  // Contact Messages State
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [authLoading, user, navigate]);

  // Load Dashboard Data
  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const data = await authService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadMenu = async () => {
    setLoadingMenu(true);
    try {
      // availableOnly: false so admin sees in-stock and out-of-stock items
      const data = await menuService.getMenuItems({ availableOnly: false });
      setMenuItems(data);
    } catch (err: any) {
      showToast('Failed to load menu items', 'error');
    } finally {
      setLoadingMenu(false);
    }
  };

  const loadReservations = async () => {
    setLoadingReservations(true);
    try {
      const [resData, tableData] = await Promise.all([
        reservationService.getReservations({
          status: resStatusFilter !== 'ALL' ? resStatusFilter : undefined,
          search: resSearch.trim() || undefined,
        }),
        reservationService.getTables(),
      ]);
      setReservations(resData);
      setTables(tableData);
    } catch (err: any) {
      showToast('Failed to load reservations', 'error');
    } finally {
      setLoadingReservations(false);
    }
  };

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const data = await contactService.getMessages();
      setMessages(data);
    } catch (err: any) {
      showToast('Failed to load contact messages', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadStats();
      loadMenu();
      loadReservations();
      loadMessages();
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === 'reservations') {
      loadReservations();
    }
  }, [resStatusFilter, resSearch]);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out securely.', 'info');
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // MENU ITEM HANDLERS
  // ----------------------------------------------------
  const openNewMenuModal = () => {
    setEditingMenuItem(null);
    setMenuForm({
      name: '',
      description: '',
      price: 5.0,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isPopular: false,
      isAvailable: true,
    });
    setIsMenuModalOpen(true);
  };

  const openEditMenuModal = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      category: item.category,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      isPopular: item.isPopular,
      isAvailable: item.isAvailable,
    });
    setIsMenuModalOpen(true);
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMenuItem) {
        await menuService.updateMenuItem(editingMenuItem.id, menuForm);
        showToast('Menu item updated successfully.', 'success');
      } else {
        await menuService.createMenuItem(menuForm);
        showToast('New menu item created successfully.', 'success');
      }
      setIsMenuModalOpen(false);
      loadMenu();
      loadStats();
    } catch (err: any) {
      showToast(err.message || 'Error saving menu item.', 'error');
    }
  };

  const handleToggleMenuAvailability = async (item: MenuItem) => {
    try {
      await menuService.updateMenuItem(item.id, { isAvailable: !item.isAvailable });
      showToast(
        `${item.name} is now ${!item.isAvailable ? 'available' : 'marked out of stock'}.`,
        'info'
      );
      loadMenu();
    } catch (err: any) {
      showToast(err.message || 'Error updating availability.', 'error');
    }
  };

  const handleDeleteMenuItem = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await menuService.deleteMenuItem(id);
      showToast(`"${name}" was deleted.`, 'info');
      loadMenu();
      loadStats();
    } catch (err: any) {
      showToast(err.message || 'Error deleting menu item.', 'error');
    }
  };

  // ----------------------------------------------------
  // RESERVATION HANDLERS
  // ----------------------------------------------------
  const handleUpdateReservationStatus = async (
    id: string,
    status: ReservationStatus,
    tableId?: number | null
  ) => {
    try {
      await reservationService.updateStatus(id, status, tableId);
      showToast(`Reservation status updated to ${status}.`, 'success');
      loadReservations();
      loadStats();
    } catch (err: any) {
      showToast(err.message || 'Failed to update reservation status.', 'error');
    }
  };

  const handleDeleteReservation = async (id: string, ref: string) => {
    if (!window.confirm(`Are you sure you want to delete reservation ${ref}?`)) return;
    try {
      await reservationService.deleteReservation(id);
      showToast(`Reservation ${ref} removed.`, 'info');
      loadReservations();
      loadStats();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete reservation.', 'error');
    }
  };

  // ----------------------------------------------------
  // MESSAGE HANDLERS
  // ----------------------------------------------------
  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    try {
      await contactService.markAsRead(id, !currentRead);
      loadMessages();
      loadStats();
    } catch (err: any) {
      showToast('Error updating message status', 'error');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      await contactService.deleteMessage(id);
      showToast('Message deleted', 'info');
      loadMessages();
      loadStats();
    } catch (err: any) {
      showToast('Error deleting message', 'error');
    }
  };

  // Filtered Menu Items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !menuSearch ||
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (authLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-4 border-[#261611] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#734E41]">Verifying credentials...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      {/* Top Bar: User info, Role badge & actions */}
      <div className="bg-[#F5EFE6] rounded-3xl p-6 border border-[#ECE2D0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#261611] text-[#DE9B56] flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#261611]">
                Admin Management Console
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E0D3BE] text-[11px] font-bold text-[#52352B]">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-[#734E41]">
              Logged in as <strong className="text-[#261611]">{user.name}</strong> ({user.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              loadStats();
              loadMenu();
              loadReservations();
              loadMessages();
              showToast('Console data refreshed', 'info');
            }}
            className="p-2.5 rounded-xl border border-[#E0D3BE] bg-[#FAF7F2] text-[#52352B] hover:bg-[#ECE2D0] transition-colors"
            title="Refresh All Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E0D3BE] bg-[#FAF7F2] text-xs font-semibold text-[#52352B] hover:bg-[#ECE2D0]"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C47D3C]" />
            <span>Public Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#261611] text-[#FAF7F2] hover:bg-[#38221B] text-xs font-semibold shadow-md"
          >
            <LogOut className="w-3.5 h-3.5 text-[#DE9B56]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#ECE2D0] pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#261611] text-[#FAF7F2] shadow-md'
              : 'bg-[#F5EFE6] text-[#52352B] hover:bg-[#ECE2D0]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-[#DE9B56]" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'menu'
              ? 'bg-[#261611] text-[#FAF7F2] shadow-md'
              : 'bg-[#F5EFE6] text-[#52352B] hover:bg-[#ECE2D0]'
          }`}
        >
          <Utensils className="w-4 h-4 text-[#DE9B56]" />
          <span>Menu Items ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'reservations'
              ? 'bg-[#261611] text-[#FAF7F2] shadow-md'
              : 'bg-[#F5EFE6] text-[#52352B] hover:bg-[#ECE2D0]'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#DE9B56]" />
          <span>Reservations ({reservations.length})</span>
          {stats?.pendingReservations ? (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {stats.pendingReservations}
            </span>
          ) : null}
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'messages'
              ? 'bg-[#261611] text-[#FAF7F2] shadow-md'
              : 'bg-[#F5EFE6] text-[#52352B] hover:bg-[#ECE2D0]'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#DE9B56]" />
          <span>Inquiries ({messages.length})</span>
          {stats?.unreadMessages ? (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {stats.unreadMessages}
            </span>
          ) : null}
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F5EFE6] p-6 rounded-3xl border border-[#ECE2D0] space-y-2">
              <div className="flex items-center justify-between text-[#734E41]">
                <span className="text-xs uppercase font-semibold">Total Menu Offerings</span>
                <Utensils className="w-5 h-5 text-[#C47D3C]" />
              </div>
              <div className="font-serif text-3xl font-bold text-[#261611]">
                {stats?.totalMenuItems ?? menuItems.length}
              </div>
              <p className="text-[11px] text-[#734E41]">Active coffee, brunch & pastries</p>
            </div>

            <div className="bg-[#F5EFE6] p-6 rounded-3xl border border-[#ECE2D0] space-y-2">
              <div className="flex items-center justify-between text-[#734E41]">
                <span className="text-xs uppercase font-semibold">Today's Bookings</span>
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="font-serif text-3xl font-bold text-[#261611]">
                {stats?.todayReservations ?? 0}
              </div>
              <p className="text-[11px] text-[#734E41]">Tables seated or expected today</p>
            </div>

            <div className="bg-[#F5EFE6] p-6 rounded-3xl border border-[#ECE2D0] space-y-2">
              <div className="flex items-center justify-between text-[#734E41]">
                <span className="text-xs uppercase font-semibold">Pending Review</span>
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div className="font-serif text-3xl font-bold text-amber-700">
                {stats?.pendingReservations ?? 0}
              </div>
              <p className="text-[11px] text-[#734E41]">Reservations awaiting confirmation</p>
            </div>

            <div className="bg-[#F5EFE6] p-6 rounded-3xl border border-[#ECE2D0] space-y-2">
              <div className="flex items-center justify-between text-[#734E41]">
                <span className="text-xs uppercase font-semibold">Guest Inquiries</span>
                <MessageSquare className="w-5 h-5 text-rose-600" />
              </div>
              <div className="font-serif text-3xl font-bold text-[#261611]">
                {stats?.unreadMessages ?? 0} Unread
              </div>
              <p className="text-[11px] text-[#734E41]">{stats?.totalMessages ?? messages.length} Total messages</p>
            </div>
          </div>

          {/* Recent Reservations Table */}
          <div className="bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#ECE2D0] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#261611]">
                  Recent Table Bookings
                </h3>
                <p className="text-xs text-[#734E41]">
                  Latest customer reservation submissions
                </p>
              </div>
              <button
                onClick={() => setActiveTab('reservations')}
                className="text-xs font-semibold text-[#C47D3C] hover:underline"
              >
                View All Reservations →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#ECE2D0] text-[#734E41] uppercase tracking-wider">
                    <th className="py-3 px-3">Reference</th>
                    <th className="py-3 px-3">Guest Name</th>
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Party</th>
                    <th className="py-3 px-3">Table</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE2D0]">
                  {(stats?.recentReservations || reservations.slice(0, 5)).map((res) => (
                    <tr key={res.id} className="hover:bg-[#ECE2D0]/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#C47D3C]">
                        {res.referenceNumber}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#261611]">
                        {res.customerName}
                      </td>
                      <td className="py-3 px-3 text-[#52352B]">
                        {res.date} at {res.timeSlot}
                      </td>
                      <td className="py-3 px-3 text-[#52352B]">
                        {res.guestCount} guests
                      </td>
                      <td className="py-3 px-3 text-[#52352B]">
                        {res.table ? `T#${res.table.tableNumber} (${res.table.location})` : 'Auto'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            res.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : res.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : res.status === 'CANCELLED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {res.status === 'PENDING' ? (
                          <button
                            onClick={() => handleUpdateReservationStatus(res.id, 'CONFIRMED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-medium hover:bg-emerald-800"
                          >
                            Confirm
                          </button>
                        ) : res.status === 'CONFIRMED' ? (
                          <button
                            onClick={() => handleUpdateReservationStatus(res.id, 'COMPLETED')}
                            className="px-2.5 py-1 rounded-lg bg-[#261611] text-white text-[11px] font-medium hover:bg-[#38221B]"
                          >
                            Mark Seated
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#734E41]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MENU ITEMS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'menu' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#734E41] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Filter menu items..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0D3BE] text-xs text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0D3BE] text-xs text-[#261611] focus:outline-none focus:border-[#C47D3C]"
              >
                <option value="All">All Categories</option>
                <option value="Coffee">Coffee</option>
                <option value="Tea">Tea</option>
                <option value="Brunch">Brunch</option>
                <option value="Pastries">Pastries</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <button
              onClick={openNewMenuModal}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#261611] text-[#FAF7F2] hover:bg-[#38221B] text-xs font-semibold shadow-md transition-all"
            >
              <Plus className="w-4 h-4 text-[#DE9B56]" />
              <span>Add New Menu Item</span>
            </button>
          </div>

          {/* Menu Items Table */}
          <div className="bg-[#F5EFE6] rounded-3xl border border-[#ECE2D0] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#ECE2D0]/60 border-b border-[#ECE2D0] text-[#734E41] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Item</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Dietary Tags</th>
                    <th className="py-3.5 px-4">Availability</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE2D0]">
                  {filteredMenuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#ECE2D0]/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-[#ECE2D0]"
                          />
                          <div>
                            <div className="font-serif font-bold text-sm text-[#261611]">
                              {item.name}
                            </div>
                            <p className="text-[11px] text-[#734E41] line-clamp-1 max-w-xs font-light">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#E0D3BE] text-[11px] font-medium text-[#52352B]">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-serif font-bold text-sm text-[#261611]">
                        ${item.price.toFixed(2)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.isPopular && <Badge type="popular" />}
                          {item.isVegetarian && <Badge type="vegetarian" />}
                          {item.isVegan && <Badge type="vegan" />}
                          {item.isGlutenFree && <Badge type="glutenFree" />}
                          {!item.isVegetarian && !item.isVegan && !item.isGlutenFree && !item.isPopular && (
                            <span className="text-[11px] text-[#734E41]/60">Standard</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleMenuAvailability(item)}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                            item.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Sold Out'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditMenuModal(item)}
                            className="p-1.5 rounded-lg border border-[#E0D3BE] bg-[#FAF7F2] text-[#52352B] hover:bg-[#ECE2D0]"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteMenuItem(item.id, item.name)}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: RESERVATIONS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'reservations' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#734E41] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={resSearch}
                  onChange={(e) => setResSearch(e.target.value)}
                  placeholder="Search by code, customer, email, phone..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0D3BE] text-xs text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                />
              </div>

              <select
                value={resStatusFilter}
                onChange={(e) => setResStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0D3BE] text-xs text-[#261611] focus:outline-none focus:border-[#C47D3C]"
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING">Pending</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="text-xs text-[#734E41] self-center">
              Found <strong>{reservations.length}</strong> reservation(s)
            </div>
          </div>

          {/* Reservations Table */}
          <div className="bg-[#F5EFE6] rounded-3xl border border-[#ECE2D0] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#ECE2D0]/60 border-b border-[#ECE2D0] text-[#734E41] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Ref Code</th>
                    <th className="py-3.5 px-4">Guest Details</th>
                    <th className="py-3.5 px-4">Schedule</th>
                    <th className="py-3.5 px-4">Party Size</th>
                    <th className="py-3.5 px-4">Assigned Table</th>
                    <th className="py-3.5 px-4">Notes</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE2D0]">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-[#ECE2D0]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C47D3C]">
                        {res.referenceNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-sm text-[#261611]">{res.customerName}</div>
                        <div className="text-[11px] text-[#734E41]">{res.customerEmail}</div>
                        <div className="text-[11px] text-[#734E41]">{res.customerPhone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#261611]">{res.date}</div>
                        <div className="text-[11px] text-[#C47D3C] font-semibold">{res.timeSlot}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#261611]">
                          {res.guestCount} {res.guestCount === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {res.table ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#E0D3BE] text-[11px] font-semibold text-[#52352B]">
                            Table #{res.table.tableNumber} ({res.table.location})
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#734E41]/70 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        {res.specialNotes ? (
                          <span className="text-[11px] text-[#52352B] line-clamp-2 italic">
                            "{res.specialNotes}"
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#734E41]/50">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={res.status}
                          onChange={(e) =>
                            handleUpdateReservationStatus(
                              res.id,
                              e.target.value as ReservationStatus
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            res.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : res.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : res.status === 'CANCELLED'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-gray-200 text-gray-800 border-gray-300'
                          }`}
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PENDING">PENDING</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteReservation(res.id, res.referenceNumber)}
                          className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                          title="Delete Reservation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: GUEST INQUIRIES */}
      {/* ======================================================== */}
      {activeTab === 'messages' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#261611]">
              Customer Messages & Private Event Requests
            </h3>
            <span className="text-xs text-[#734E41]">
              Total Messages: <strong>{messages.length}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 rounded-3xl border transition-all space-y-3 ${
                  msg.isRead
                    ? 'bg-[#F5EFE6] border-[#ECE2D0] opacity-80'
                    : 'bg-[#FAF7F2] border-[#C47D3C]/60 shadow-md ring-1 ring-[#C47D3C]/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ECE2D0]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-[#261611]">
                        {msg.subject}
                      </h4>
                      {!msg.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#734E41]">
                      From <strong>{msg.name}</strong> ({msg.email}) {msg.phone ? `• ${msg.phone}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => handleToggleMessageRead(msg.id, msg.isRead)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        msg.isRead
                          ? 'bg-[#FAF7F2] text-[#734E41] border-[#E0D3BE]'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {msg.isRead ? 'Mark Unread' : 'Mark as Read'}
                    </button>

                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#38221B] leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>

                <div className="text-[11px] text-[#734E41]/70">
                  Received on {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MENU ITEM CREATE / EDIT MODAL */}
      {/* ======================================================== */}
      <Modal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        title={editingMenuItem ? 'Edit Menu Item' : 'Create New Menu Item'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveMenuItem} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-1">
              Item Name *
            </label>
            <input
              type="text"
              value={menuForm.name}
              onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
              placeholder="e.g. Cardamom Honey Flat White"
              className="w-full px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-1">
                Category *
              </label>
              <select
                value={menuForm.category}
                onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
              >
                <option value="Coffee">Coffee</option>
                <option value="Tea">Tea</option>
                <option value="Brunch">Brunch</option>
                <option value="Pastries">Pastries</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-1">
                Price (USD) *
              </label>
              <input
                type="number"
                step="0.25"
                min="0.5"
                value={menuForm.price}
                onChange={(e) => setMenuForm({ ...menuForm, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-1">
              Image URL *
            </label>
            <input
              type="url"
              value={menuForm.imageUrl}
              onChange={(e) => setMenuForm({ ...menuForm, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-1">
              Description & Ingredients *
            </label>
            <textarea
              rows={3}
              value={menuForm.description}
              onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
              placeholder="Describe roast notes, origin, garnish..."
              className="w-full px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
              required
            />
          </div>

          {/* Dietary & Badge Toggles */}
          <div className="pt-2 border-t border-[#ECE2D0]">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-2">
              Dietary & Status Flags
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <label className="flex items-center gap-2 text-xs font-medium text-[#261611] cursor-pointer">
                <input
                  type="checkbox"
                  checked={menuForm.isVegetarian}
                  onChange={(e) => setMenuForm({ ...menuForm, isVegetarian: e.target.checked })}
                  className="rounded text-[#C47D3C]"
                />
                <span>Vegetarian</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-[#261611] cursor-pointer">
                <input
                  type="checkbox"
                  checked={menuForm.isVegan}
                  onChange={(e) => setMenuForm({ ...menuForm, isVegan: e.target.checked })}
                  className="rounded text-[#C47D3C]"
                />
                <span>Vegan</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-[#261611] cursor-pointer">
                <input
                  type="checkbox"
                  checked={menuForm.isGlutenFree}
                  onChange={(e) => setMenuForm({ ...menuForm, isGlutenFree: e.target.checked })}
                  className="rounded text-[#C47D3C]"
                />
                <span>Gluten-Free</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-[#261611] cursor-pointer">
                <input
                  type="checkbox"
                  checked={menuForm.isPopular}
                  onChange={(e) => setMenuForm({ ...menuForm, isPopular: e.target.checked })}
                  className="rounded text-[#C47D3C]"
                />
                <span>Featured / Popular</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-[#261611] cursor-pointer">
                <input
                  type="checkbox"
                  checked={menuForm.isAvailable}
                  onChange={(e) => setMenuForm({ ...menuForm, isAvailable: e.target.checked })}
                  className="rounded text-[#C47D3C]"
                />
                <span>Available In Kitchen</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#ECE2D0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsMenuModalOpen(false)}
              className="px-5 py-2.5 rounded-full border border-[#E0D3BE] text-xs font-semibold text-[#52352B] hover:bg-[#ECE2D0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#261611] text-[#FAF7F2] hover:bg-[#38221B] text-xs font-semibold shadow-md"
            >
              {editingMenuItem ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
