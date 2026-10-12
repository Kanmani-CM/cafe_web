import React, { useState } from 'react';
import { Coffee, Menu, X, Calendar, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About Us', path: '/about' },
    { name: 'Reservations', path: '/reservations' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#ECE2D0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 text-left group focus:outline-none"
            aria-label="Aurora Café Home"
          >
            <div className="w-11 h-11 rounded-full bg-[#261611] text-[#DE9B56] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#261611]">
                Aurora Café
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-[#734E41] font-medium -mt-1">
                Roastery & Kitchen
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#E0D3BE]/60 text-[#261611] font-semibold'
                      : 'text-[#52352B] hover:text-[#261611] hover:bg-[#F5EFE6]'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button
                onClick={() => handleNav('/admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                  currentPath.startsWith('/admin')
                    ? 'bg-[#261611] text-[#DE9B56] border-[#261611]'
                    : 'bg-[#F5EFE6] text-[#52352B] border-[#E0D3BE] hover:bg-[#ECE2D0]'
                }`}
                title={`Logged in as ${user.name}`}
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C47D3C]" />
                <span>Admin Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav('/admin/login')}
                className="text-xs text-[#734E41] hover:text-[#261611] px-2 py-1 transition-colors flex items-center gap-1 font-medium"
                title="Staff & Admin Portal"
              >
                <Shield className="w-3 h-3 opacity-60" />
                <span>Staff</span>
              </button>
            )}

            <button
              onClick={() => handleNav('/reservations')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#261611] text-[#FAF7F2] hover:bg-[#38221B] text-sm font-medium shadow-md hover:shadow-lg transition-all transform active:scale-95"
            >
              <Calendar className="w-4 h-4 text-[#DE9B56]" />
              <span>Book a Table</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#261611] hover:bg-[#F5EFE6] focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#ECE2D0] bg-[#FAF7F2] px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E0D3BE]/60 text-[#261611] font-semibold'
                      : 'text-[#52352B] hover:bg-[#F5EFE6]'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#ECE2D0] flex flex-col gap-2.5">
            <button
              onClick={() => handleNav('/reservations')}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#261611] text-[#FAF7F2] font-medium shadow-md"
            >
              <Calendar className="w-4 h-4 text-[#DE9B56]" />
              <span>Book a Table</span>
            </button>

            {user ? (
              <button
                onClick={() => handleNav('/admin')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5EFE6] text-[#261611] text-sm font-medium border border-[#E0D3BE]"
              >
                <UserCheck className="w-4 h-4 text-[#C47D3C]" />
                <span>Admin Dashboard ({user.name})</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav('/admin/login')}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs text-[#734E41] hover:text-[#261611]"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Staff & Admin Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
