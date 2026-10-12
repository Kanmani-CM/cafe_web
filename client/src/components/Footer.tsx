import React, { useState } from 'react';
import { Coffee, MapPin, Clock, Phone, Mail, Heart } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showToast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }
    showToast('Thank you! You are now subscribed to our coffee tasting & seasonal menu releases.', 'success', 'Subscribed');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#261611] text-[#ECE2D0] pt-16 pb-12 border-t border-[#38221B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#38221B]/80">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DE9B56] text-[#261611] flex items-center justify-center font-bold">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold text-[#FAF7F2]">
                Aurora Café
              </span>
            </div>
            <p className="text-sm text-[#ECE2D0]/80 leading-relaxed font-light">
              Dedicated to small-batch ethical roasting, artisanal morning viennoiserie, and gathering friends around farm-to-table cuisine in a calming sanctuary.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#DE9B56]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-[#38221B] hover:bg-[#DE9B56] hover:text-[#261611] transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-[#38221B] hover:bg-[#DE9B56] hover:text-[#261611] transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Hours & Hospitality */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FAF7F2] tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#DE9B56]" />
              <span>Opening Hours</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-[#ECE2D0]/80">
              <li className="flex justify-between items-center py-1 border-b border-[#38221B]">
                <span className="font-medium text-[#FAF7F2]">Monday – Friday</span>
                <span className="text-[#DE9B56]">7:00 AM – 9:00 PM</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-[#38221B]">
                <span className="font-medium text-[#FAF7F2]">Saturday</span>
                <span className="text-[#DE9B56]">7:30 AM – 10:00 PM</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-[#38221B]">
                <span className="font-medium text-[#FAF7F2]">Sunday</span>
                <span className="text-[#DE9B56]">8:00 AM – 8:00 PM</span>
              </li>
              <li className="text-xs text-[#ECE2D0]/60 pt-1">
                * Kitchen closes 45 minutes prior to closing time.
              </li>
            </ul>
          </div>

          {/* Col 3: Visit Us */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FAF7F2] tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#DE9B56]" />
              <span>Location & Contact</span>
            </h3>
            <div className="space-y-3 text-sm text-[#ECE2D0]/80">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#DE9B56] shrink-0 mt-1" />
                <span>452 Heritage Boulevard, Historic Old Town, CA 94103</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#DE9B56] shrink-0" />
                <span>+1 (555) 321-9876</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#DE9B56] shrink-0" />
                <span>hello@auroracafe.com</span>
              </p>
              <div className="pt-1">
                <button
                  onClick={() => navigate('/contact')}
                  className="text-xs text-[#DE9B56] hover:underline font-medium"
                >
                  View Driving & Parking Directions →
                </button>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FAF7F2] tracking-wide">
              The Artisan Letter
            </h3>
            <p className="text-sm text-[#ECE2D0]/80 leading-relaxed font-light">
              Receive invitations to secret cupping sessions, seasonal specials, and bakery stories.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1B100C] border border-[#52352B] text-sm text-[#FAF7F2] placeholder-[#ECE2D0]/40 focus:outline-none focus:border-[#DE9B56]"
                  aria-label="Email address for newsletter"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#DE9B56] hover:bg-[#C47D3C] text-[#261611] font-medium text-sm transition-colors shadow-md"
              >
                Join Our Table
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#ECE2D0]/60">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Aurora Café & Roastery. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#B6583E] fill-[#B6583E] inline mx-0.5" />
            <span>for coffee lovers.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/about')}
              className="hover:text-[#DE9B56] transition-colors"
            >
              Story & Values
            </button>
            <button
              onClick={() => navigate('/reservations')}
              className="hover:text-[#DE9B56] transition-colors"
            >
              Reserve Table
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className="hover:text-[#DE9B56] transition-colors"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
