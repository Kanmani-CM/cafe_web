import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Utensils,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  ArrowRight,
  Coffee,
  Award,
  Wheat,
  Star,
} from 'lucide-react';
import { MenuItem } from '../types';
import { menuService } from '../services/menuService';
import { Badge } from '../components/Badge';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const items = await menuService.getMenuItems({ popular: true });
        // Take top 6 popular items
        setFeaturedItems(items.slice(0, 6));
      } catch (err) {
        console.error('Failed to load featured items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & Intro */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0D3BE]/60 border border-[#C47D3C]/30 text-xs font-semibold tracking-wider uppercase text-[#734E41]">
                <Sparkles className="w-3.5 h-3.5 text-[#C47D3C]" />
                <span>Small Batch Roastery & Artisanal Kitchen</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#261611] tracking-tight leading-[1.15]">
                Awaken Your Senses with Every Handcrafted Pour.
              </h1>

              <p className="text-base sm:text-lg text-[#52352B] leading-relaxed max-w-2xl font-light">
                Welcome to <strong className="font-semibold text-[#261611]">Aurora Café</strong>. We blend ethically harvested single-origin beans, traditional French viennoiserie, and seasonal organic brunch in a sunlit, peaceful retreat.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/reservations')}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#261611] text-[#FAF7F2] hover:bg-[#38221B] font-medium text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  <Calendar className="w-5 h-5 text-[#DE9B56]" />
                  <span>Book a Table</span>
                </button>

                <button
                  onClick={() => navigate('/menu')}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#F5EFE6] text-[#261611] hover:bg-[#ECE2D0] border border-[#E0D3BE] font-medium text-sm sm:text-base transition-all transform hover:-translate-y-0.5"
                >
                  <Utensils className="w-5 h-5 text-[#734E41]" />
                  <span>View Our Menu</span>
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#ECE2D0]">
                <div>
                  <div className="text-2xl font-serif font-bold text-[#261611]">4.9★</div>
                  <div className="text-xs text-[#734E41] font-medium">1,200+ Reviews</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-[#261611]">100%</div>
                  <div className="text-xs text-[#734E41] font-medium">Single-Origin</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-[#261611]">Daily</div>
                  <div className="text-xs text-[#734E41] font-medium">Fresh Bakehouse</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Image */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 aspect-[4/5] relative">
                  <img
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"
                    alt="Cozy sunlit café interior with espresso bar"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                    <span className="text-xs uppercase tracking-widest text-[#DE9B56] font-semibold">
                      Signature Atmosphere
                    </span>
                    <h3 className="font-serif text-xl font-bold mt-1">
                      A Warm Sanctuary for Coffee & Conversations
                    </h3>
                  </div>
                </div>

                {/* Floating Floating Pill 1 */}
                <div className="absolute -top-4 -left-6 bg-[#FAF7F2] p-3.5 rounded-2xl shadow-xl border border-[#ECE2D0] flex items-center gap-3 animate-bounce-subtle hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-[#DE9B56]/20 flex items-center justify-center text-[#C47D3C]">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-[#261611]">Artisan Pour-Over</p>
                    <p className="text-[11px] text-[#734E41]">Geisha & Yirgacheffe</p>
                  </div>
                </div>

                {/* Floating Pill 2 */}
                <div className="absolute -bottom-6 -right-4 bg-[#FAF7F2] p-4 rounded-2xl shadow-xl border border-[#ECE2D0] flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-[#4F735B]/20 flex items-center justify-center text-[#4F735B]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#261611]">Open Every Day</p>
                    <p className="text-[11px] text-[#734E41]">7:00 AM – 9:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS / VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#F5EFE6] p-8 rounded-3xl border border-[#ECE2D0] text-left hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#DE9B56]/20 text-[#C47D3C] flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#261611] mb-2">
              Ethical Direct Trade
            </h3>
            <p className="text-sm text-[#52352B] leading-relaxed">
              We partner directly with regenerative micro-lot farms across Ethiopia, Colombia, and Guatemala, ensuring fair prices and exceptional harvest quality.
            </p>
          </div>

          <div className="bg-[#F5EFE6] p-8 rounded-3xl border border-[#ECE2D0] text-left hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#C47D3C]/20 text-[#734E41] flex items-center justify-center mb-6">
              <Wheat className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#261611] mb-2">
              Baked Fresh at Dawn
            </h3>
            <p className="text-sm text-[#52352B] leading-relaxed">
              Our French viennoiserie and sourdough loaves are laminated and baked in-house every morning using organic unbleached flours and cultured French butter.
            </p>
          </div>

          <div className="bg-[#F5EFE6] p-8 rounded-3xl border border-[#ECE2D0] text-left hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#4F735B]/20 text-[#4F735B] flex items-center justify-center mb-6">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#261611] mb-2">
              Farm-to-Table Brunch
            </h3>
            <p className="text-sm text-[#52352B] leading-relaxed">
              Seasonal savory dishes featuring pasture-raised eggs, heirloom produce, and wild mushrooms sourced from regional California organic growers.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED MENU ITEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C47D3C] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Chef & Roaster Highlights</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#261611]">
              Featured Café Favorites
            </h2>
            <p className="text-sm sm:text-base text-[#734E41] mt-2 font-light">
              Crafted with perfection, beloved by our neighborhood regulars.
            </p>
          </div>

          <button
            onClick={() => navigate('/menu')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#261611] hover:text-[#C47D3C] transition-colors"
          >
            <span>Explore Complete Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-[#F5EFE6] rounded-3xl p-4 animate-pulse">
                <div className="w-full h-48 bg-[#ECE2D0] rounded-2xl mb-4" />
                <div className="h-5 bg-[#ECE2D0] rounded w-2/3 mb-2" />
                <div className="h-4 bg-[#ECE2D0] rounded w-full mb-3" />
                <div className="h-6 bg-[#ECE2D0] rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-[#F5EFE6] rounded-3xl overflow-hidden border border-[#ECE2D0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col text-left"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#ECE2D0]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
                    {item.isPopular && <Badge type="popular" />}
                    {item.isVegetarian && <Badge type="vegetarian" />}
                    {item.isVegan && <Badge type="vegan" />}
                    {item.isGlutenFree && <Badge type="glutenFree" />}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-[#261611]/80 backdrop-blur-sm text-xs font-medium text-[#FAF7F2]">
                    {item.category}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif text-lg font-bold text-[#261611] group-hover:text-[#C47D3C] transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-serif font-bold text-base text-[#261611] shrink-0">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-[#52352B] leading-relaxed line-clamp-2 font-light">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#ECE2D0] flex items-center justify-between">
                    <span className="text-xs font-medium text-[#734E41]">
                      Prepared to order
                    </span>
                    <button
                      onClick={() => navigate('/reservations')}
                      className="text-xs font-semibold text-[#261611] hover:text-[#C47D3C] transition-colors inline-flex items-center gap-1"
                    >
                      <span>Reserve Table</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AMBIENCE STORY TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#261611] text-[#FAF7F2] rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 text-left">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#DE9B56] font-semibold">
                Our Roasting Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                "Coffee is not merely fuel. It is an invitation to pause and connect."
              </h2>
              <p className="text-sm sm:text-base text-[#ECE2D0]/80 leading-relaxed font-light">
                Every batch of green coffee beans is gently roasted inside our heritage vintage drum roaster in small 5kg batches, coaxing out natural sweetness, floral aromatics, and rich cocoa undertones.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => navigate('/about')}
                  className="px-6 py-3 rounded-full bg-[#DE9B56] text-[#261611] font-semibold text-sm hover:bg-[#C47D3C] transition-colors shadow-lg"
                >
                  Read Our Full Story
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-xl border-2 border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80"
                  alt="Barista crafting latte art"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION, HOURS & CONTACT DETAILS CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5EFE6] rounded-3xl border border-[#ECE2D0] p-8 sm:p-12 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DE9B56]/20 text-[#C47D3C] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#261611]">Opening Hours</h3>
              <p className="text-sm text-[#52352B]">
                <strong className="text-[#261611]">Monday – Friday:</strong> 7:00 AM – 9:00 PM<br />
                <strong className="text-[#261611]">Saturday:</strong> 7:30 AM – 10:00 PM<br />
                <strong className="text-[#261611]">Sunday:</strong> 8:00 AM – 8:00 PM
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DE9B56]/20 text-[#C47D3C] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#261611]">Visit Our Roastery</h3>
              <p className="text-sm text-[#52352B]">
                452 Heritage Boulevard<br />
                Historic Old Town, CA 94103<br />
                <span className="text-xs text-[#734E41]">Complimentary guest parking behind café</span>
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DE9B56]/20 text-[#C47D3C] flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#261611]">Get in Touch</h3>
              <p className="text-sm text-[#52352B]">
                Phone: +1 (555) 321-9876<br />
                Email: hello@auroracafe.com<br />
                Inquiries: events@auroracafe.com
              </p>
              <div>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-xs font-semibold text-[#C47D3C] hover:underline"
                >
                  Send us a direct message →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
