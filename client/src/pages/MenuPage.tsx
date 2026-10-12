import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Calendar,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';
import { MenuItem } from '../types';
import { menuService } from '../services/menuService';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

interface MenuPageProps {
  navigate: (path: string) => void;
}

const CATEGORIES = ['All', 'Coffee', 'Tea', 'Brunch', 'Pastries', 'Desserts', 'Beverages'];

export const MenuPage: React.FC<MenuPageProps> = ({ navigate }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterVegetarian, setFilterVegetarian] = useState<boolean>(false);
  const [filterVegan, setFilterVegan] = useState<boolean>(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState<boolean>(false);
  const [filterPopular, setFilterPopular] = useState<boolean>(false);

  // Modal Detail Item
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Fetch menu from backend API
  const fetchMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await menuService.getMenuItems({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchTerm.trim() || undefined,
        vegetarian: filterVegetarian || undefined,
        vegan: filterVegan || undefined,
        glutenFree: filterGlutenFree || undefined,
        popular: filterPopular || undefined,
      });
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [
    selectedCategory,
    searchTerm,
    filterVegetarian,
    filterVegan,
    filterGlutenFree,
    filterPopular,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterVegetarian) count++;
    if (filterVegan) count++;
    if (filterGlutenFree) count++;
    if (filterPopular) count++;
    return count;
  }, [filterVegetarian, filterVegan, filterGlutenFree, filterPopular]);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setFilterVegetarian(false);
    setFilterVegan(false);
    setFilterGlutenFree(false);
    setFilterPopular(false);
  };

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0D3BE]/60 text-xs font-semibold uppercase tracking-wider text-[#734E41]">
          <Sparkles className="w-3.5 h-3.5 text-[#C47D3C]" />
          <span>Farm Fresh & Artisan Roasted</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#261611]">
          Our Artisanal Menu
        </h1>
        <p className="text-base text-[#52352B] leading-relaxed font-light">
          From micro-lot pour-overs and ceremonial teas to flaky morning viennoiserie and savory brunch classics, all crafted with pure, unhurried devotion.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#F5EFE6] rounded-3xl p-6 border border-[#ECE2D0] shadow-sm space-y-6">
        {/* Top: Search and Dietary Toggles */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#734E41]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by dish name or ingredient..."
              className="w-full pl-11 pr-10 py-2.5 rounded-full bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] placeholder-[#734E41]/60 focus:outline-none focus:border-[#C47D3C] focus:ring-1 focus:ring-[#C47D3C]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#734E41] hover:text-[#261611]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dietary Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterPopular(!filterPopular)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                filterPopular
                  ? 'bg-[#DE9B56] text-[#261611] border-[#DE9B56] font-semibold'
                  : 'bg-[#FAF7F2] text-[#52352B] border-[#E0D3BE] hover:bg-[#ECE2D0]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C47D3C]" />
              <span>Popular</span>
            </button>

            <button
              onClick={() => setFilterVegetarian(!filterVegetarian)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filterVegetarian
                  ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                  : 'bg-[#FAF7F2] text-[#52352B] border-[#E0D3BE] hover:bg-[#ECE2D0]'
              }`}
            >
              Vegetarian
            </button>

            <button
              onClick={() => setFilterVegan(!filterVegan)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filterVegan
                  ? 'bg-teal-700 text-white border-teal-700 font-semibold'
                  : 'bg-[#FAF7F2] text-[#52352B] border-[#E0D3BE] hover:bg-[#ECE2D0]'
              }`}
            >
              Vegan
            </button>

            <button
              onClick={() => setFilterGlutenFree(!filterGlutenFree)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filterGlutenFree
                  ? 'bg-amber-700 text-white border-amber-700 font-semibold'
                  : 'bg-[#FAF7F2] text-[#52352B] border-[#E0D3BE] hover:bg-[#ECE2D0]'
              }`}
            >
              Gluten-Free
            </button>

            {(searchTerm || activeFiltersCount > 0 || selectedCategory !== 'All') && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-[#B6583E] hover:underline font-medium px-2 py-1"
              >
                Reset All
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-[#ECE2D0] pt-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#261611] text-[#FAF7F2] shadow-md'
                    : 'bg-[#FAF7F2] text-[#52352B] hover:bg-[#ECE2D0] border border-[#E0D3BE]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Item Count / Feedback */}
      <div className="flex items-center justify-between text-xs text-[#734E41] px-2">
        <span>
          Showing <strong className="text-[#261611]">{items.length}</strong> menu creation{items.length === 1 ? '' : 's'}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </span>
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#C47D3C]" />
          <span>Click any item for detailed ingredients & notes</span>
        </span>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
          <p className="text-sm font-semibold text-rose-800">{error}</p>
          <button
            onClick={fetchMenu}
            className="px-4 py-2 bg-rose-800 text-white text-xs rounded-xl hover:bg-rose-900"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#F5EFE6] rounded-3xl p-5 border border-[#ECE2D0] animate-pulse space-y-4">
              <div className="w-full h-48 bg-[#ECE2D0] rounded-2xl" />
              <div className="h-5 bg-[#ECE2D0] rounded w-2/3" />
              <div className="h-4 bg-[#ECE2D0] rounded w-full" />
              <div className="h-4 bg-[#ECE2D0] rounded w-4/5" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-[#ECE2D0] rounded w-16" />
                <div className="h-6 bg-[#ECE2D0] rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && items.length === 0 && (
        <div className="py-20 text-center bg-[#F5EFE6] rounded-3xl border border-[#ECE2D0] p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#E0D3BE] mx-auto flex items-center justify-center text-[#734E41]">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#261611]">
            No Items Found
          </h3>
          <p className="text-sm text-[#52352B] font-light">
            We couldn't find any dishes matching your current search or dietary filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-6 py-2.5 rounded-full bg-[#261611] text-[#FAF7F2] text-xs font-semibold hover:bg-[#38221B] shadow-md"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* MENU GRID */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-[#F5EFE6] rounded-3xl overflow-hidden border border-[#ECE2D0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col text-left cursor-pointer hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#ECE2D0]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Badges Overlay */}
                <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
                  {item.isPopular && <Badge type="popular" />}
                  {item.isVegetarian && <Badge type="vegetarian" />}
                  {item.isVegan && <Badge type="vegan" />}
                  {item.isGlutenFree && <Badge type="glutenFree" />}
                </div>

                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-[#261611]/85 backdrop-blur-sm text-xs font-medium text-[#FAF7F2]">
                  {item.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif text-lg font-bold text-[#261611] group-hover:text-[#C47D3C] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <span className="font-serif font-bold text-base text-[#261611] shrink-0">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-[#52352B] leading-relaxed line-clamp-3 font-light">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#ECE2D0] flex items-center justify-between text-xs">
                  <span className="text-[#734E41] font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>In Kitchen</span>
                  </span>
                  <span className="text-[#C47D3C] group-hover:underline font-semibold">
                    View Dish →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ITEM DETAIL MODAL */}
      <Modal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name || 'Menu Item Details'}
        maxWidth="lg"
      >
        {selectedItem && (
          <div className="space-y-6 text-left">
            <div className="rounded-2xl overflow-hidden aspect-[16/9] shadow-md">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#E0D3BE] text-xs font-semibold text-[#52352B]">
                {selectedItem.category}
              </span>
              <span className="font-serif text-2xl font-bold text-[#261611]">
                ${selectedItem.price.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedItem.isPopular && <Badge type="popular" size="md" />}
              {selectedItem.isVegetarian && <Badge type="vegetarian" size="md" />}
              {selectedItem.isVegan && <Badge type="vegan" size="md" />}
              {selectedItem.isGlutenFree && <Badge type="glutenFree" size="md" />}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#734E41]">
                Description & Preparation
              </h4>
              <p className="text-sm text-[#38221B] leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#ECE2D0] flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 rounded-full border border-[#E0D3BE] text-xs font-semibold text-[#52352B] hover:bg-[#ECE2D0]"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedItem(null);
                  navigate('/reservations');
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#261611] text-[#FAF7F2] hover:bg-[#38221B] text-xs font-semibold shadow-md"
              >
                <Calendar className="w-4 h-4 text-[#DE9B56]" />
                <span>Book Table to Taste</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
