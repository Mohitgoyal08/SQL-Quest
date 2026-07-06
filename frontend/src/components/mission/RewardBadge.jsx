import React from 'react';

export default function RewardBadge({ icon, label, variant = 'default' }) {
  const getVariantStyles = (type) => {
    switch (type) {
      case 'xp':
        return 'text-amber-600 font-black';
      case 'coins':
        return 'text-yellow-600 font-black';
      case 'stars':
        return 'text-amber-500 font-black';
      case 'items':
        return 'text-emerald-700 font-black';
      case 'badges':
        return 'text-purple-700 font-black';
      default:
        return 'text-amber-800 font-bold';
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-[#fdf6e2] border border-[#8c6b3e]/40 px-3 py-1.5 rounded-lg shadow-sm">
      <span className={`text-sm select-none ${getVariantStyles(variant)}`}>
        {icon}
      </span>
      <span className="font-extrabold text-[#5c4424] text-xs md:text-sm">
        {label}
      </span>
    </div>
  );
}