import React from 'react';
import { Sparkles, Leaf, ShieldCheck, Check } from 'lucide-react';

interface BadgeProps {
  type: 'vegetarian' | 'vegan' | 'glutenFree' | 'popular' | 'available' | 'table';
  text?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ type, text, size = 'sm' }) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  switch (type) {
    case 'vegetarian':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300/60 ${sizeClasses}`}
          title="Vegetarian"
        >
          <Leaf className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{text || 'Vegetarian'}</span>
        </span>
      );

    case 'vegan':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-teal-100/90 text-teal-800 border border-teal-300/60 ${sizeClasses}`}
          title="Vegan"
        >
          <Leaf className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{text || 'Vegan'}</span>
        </span>
      );

    case 'glutenFree':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-100/90 text-amber-800 border border-amber-300/60 ${sizeClasses}`}
          title="Gluten-Free"
        >
          <ShieldCheck className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{text || 'Gluten-Free'}</span>
        </span>
      );

    case 'popular':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-[#DE9B56]/20 text-[#8B4513] border border-[#DE9B56]/50 ${sizeClasses}`}
          title="Popular Favorite"
        >
          <Sparkles className={isSm ? 'w-3 h-3 text-[#C47D3C]' : 'w-3.5 h-3.5 text-[#C47D3C]'} />
          <span>{text || 'Popular'}</span>
        </span>
      );

    case 'available':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 ${sizeClasses}`}
        >
          <Check className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{text || 'In Stock'}</span>
        </span>
      );

    case 'table':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-[#F5EFE6] text-[#52352B] border border-[#E0D3BE] ${sizeClasses}`}
        >
          <span>{text}</span>
        </span>
      );

    default:
      return null;
  }
};
