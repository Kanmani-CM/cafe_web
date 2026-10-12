import React from 'react';
import { Coffee, Heart, Leaf, Award, Users, Calendar } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 text-left">
      {/* HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0D3BE]/60 text-xs font-semibold uppercase tracking-wider text-[#734E41]">
            <Heart className="w-3.5 h-3.5 text-[#B6583E]" />
            <span>Our Origin & Purpose</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#261611] leading-tight">
            Rooted in Slow Roasting & Genuine Gatherings.
          </h1>

          <p className="text-base sm:text-lg text-[#52352B] leading-relaxed font-light">
            Founded in the heart of Historic Old Town, Aurora Café began as an obsession with a vintage 1968 cast-iron drum roaster and a dream to restore warmth, slowness, and community to daily coffee rituals.
          </p>

          <p className="text-sm sm:text-base text-[#52352B] leading-relaxed font-light">
            In a world rushing between screens, we wanted to build a haven where espresso is extracted with precision, pastries are laminated by hand at dawn, and conversations linger without rush.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => navigate('/reservations')}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#261611] text-[#FAF7F2] font-semibold text-sm hover:bg-[#38221B] shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4 text-[#DE9B56]" />
              <span>Reserve a Table With Us</span>
            </button>
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-3 rounded-full bg-[#F5EFE6] text-[#261611] border border-[#E0D3BE] font-semibold text-sm hover:bg-[#ECE2D0]"
            >
              Explore Menu
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80"
              alt="Pouring specialty pour-over coffee at Aurora Café"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs uppercase tracking-widest text-[#DE9B56] font-semibold">
                Est. Historic Old Town
              </span>
              <p className="font-serif text-lg font-bold mt-1">
                Where every bean tells a farmer's journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C47D3C] font-semibold">
            Guiding Principles
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#261611]">
            What We Believe At Our Core
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#F5EFE6] p-7 rounded-3xl border border-[#ECE2D0] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DE9B56]/20 text-[#C47D3C] flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#261611]">Single-Origin Integrity</h3>
            <p className="text-xs text-[#52352B] leading-relaxed font-light">
              We never mask subpar crops with dark blends. Every single-origin roast highlights the soil, elevation, and varietal distinctiveness of its origin.
            </p>
          </div>

          <div className="bg-[#F5EFE6] p-7 rounded-3xl border border-[#ECE2D0] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#261611]">Regenerative Sourcing</h3>
            <p className="text-xs text-[#52352B] leading-relaxed font-light">
              We pay well above fair-trade minimums directly to independent micro-producers who champion soil health and forest canopy biodiversity.
            </p>
          </div>

          <div className="bg-[#F5EFE6] p-7 rounded-3xl border border-[#ECE2D0] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#261611]">Artisanal Bakehouse</h3>
            <p className="text-xs text-[#52352B] leading-relaxed font-light">
              No premixes or freezer deliveries. Our laminated doughs undergo a 72-hour slow cold fermentation with organic flours and unpasteurized cultured butter.
            </p>
          </div>

          <div className="bg-[#F5EFE6] p-7 rounded-3xl border border-[#ECE2D0] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#261611] text-[#FAF7F2] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#261611]">Community Sanctuary</h3>
            <p className="text-xs text-[#52352B] leading-relaxed font-light">
              Our café was sculpted with reclaimed Douglas fir, abundant greenery, and warm natural lighting to nurture genuine human warmth.
            </p>
          </div>
        </div>
      </section>

      {/* MEET THE ARTISANS */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C47D3C] font-semibold">
            The Craftspeople
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#261611]">
            Meet the Hands Behind Every Cup & Plate
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#F5EFE6] rounded-3xl overflow-hidden border border-[#ECE2D0] shadow-sm">
            <div className="aspect-[4/3] bg-[#ECE2D0]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                alt="Mateo Silva - Head Roaster"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#261611]">Mateo Silva</h3>
              <p className="text-xs uppercase tracking-wider text-[#C47D3C] font-semibold">
                Co-Founder & Head Roaster
              </p>
              <p className="text-xs text-[#52352B] leading-relaxed font-light pt-1">
                With a decade visiting coffee farms in Antioquia and Huila, Mateo calibrates roast profiles down to the single degree to highlight fruit sweetness.
              </p>
            </div>
          </div>

          <div className="bg-[#F5EFE6] rounded-3xl overflow-hidden border border-[#ECE2D0] shadow-sm">
            <div className="aspect-[4/3] bg-[#ECE2D0]">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
                alt="Camille Laurent - Executive Pastry Chef"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#261611]">Camille Laurent</h3>
              <p className="text-xs uppercase tracking-wider text-[#C47D3C] font-semibold">
                Executive Pastry Chef
              </p>
              <p className="text-xs text-[#52352B] leading-relaxed font-light pt-1">
                Trained in Lyon and Paris, Camille brings classical French lamination techniques infused with Californian seasonal fruits and botanicals.
              </p>
            </div>
          </div>

          <div className="bg-[#F5EFE6] rounded-3xl overflow-hidden border border-[#ECE2D0] shadow-sm">
            <div className="aspect-[4/3] bg-[#ECE2D0]">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                alt="Maya Sterling - Barista Lead"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#261611]">Maya Sterling</h3>
              <p className="text-xs uppercase tracking-wider text-[#C47D3C] font-semibold">
                Hospitality & Head Barista
              </p>
              <p className="text-xs text-[#52352B] leading-relaxed font-light pt-1">
                A certified Q-grader and latte art finalist, Maya champions sensory workshops and ensures every guest feels at home the moment they step inside.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C47D3C] font-semibold">
            Visual Journal
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#261611]">
            Atmosphere & Mornings at Aurora
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl overflow-hidden aspect-square shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
              alt="Café seating area"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-square shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=600&q=80"
              alt="Espresso machine brewing"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-square shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
              alt="Freshly baked pastries"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-square shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
              alt="Sunlit patio dining"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
