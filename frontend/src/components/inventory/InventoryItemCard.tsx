// ===== Sprint 9.6 =====
import React from 'react';
import { motion } from 'framer-motion';
import { InventoryItem } from '../../inventory/models/InventoryItem';
import { ItemRarity } from '../../inventory/models/ItemTypes';

interface InventoryItemCardProps {
  item: InventoryItem;
  onClick: () => void;
}

const RARITY_STYLES: Record<ItemRarity, { badge: string; border: string; glow: string }> = {
  [ItemRarity.COMMON]: {
    badge: 'bg-slate-700 text-slate-100 border-slate-900/60',
    border: 'border-[#8c6b3e]/40',
    glow: 'hover:shadow-[0_0_15px_rgba(140,107,62,0.3)]',
  },
  [ItemRarity.RARE]: {
    badge: 'bg-blue-900 text-blue-100 border-blue-400 font-bold',
    border: 'border-blue-900/40',
    glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]',
  },
  [ItemRarity.EPIC]: {
    badge: 'bg-purple-900 text-purple-100 border-purple-400 font-bold',
    border: 'border-purple-900/40',
    glow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]',
  },
  [ItemRarity.LEGENDARY]: {
    badge: 'bg-amber-600 text-amber-950 border-yellow-300 font-black',
    border: 'border-amber-500/60',
    glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.9)] animate-pulse',
  },
};

export const InventoryItemCard: React.FC<InventoryItemCardProps> = ({
  item,
  onClick,
}) => {
  const styles =
    RARITY_STYLES[item.rarity] || RARITY_STYLES[ItemRarity.COMMON];

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={`relative p-3.5 bg-slate-900/80 backdrop-blur border-2 rounded-xl flex items-start gap-3.5 transition-colors duration-300 hover:bg-slate-800 cursor-pointer overflow-hidden group ${styles.border} ${styles.glow}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Light Sweep Animation on Hover (Phase 12) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      {/* Icon Wrapper */}
      <div className="w-12 h-12 bg-[#fdf6e2] border-2 border-[#8c6b3e]/60 rounded-lg shrink-0 flex items-center justify-center text-2xl shadow-inner select-none">
        {item.icon}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="font-black text-sm text-[#5c4424] truncate leading-tight">
            {item.name}
          </span>

          {item.quantity > 1 && (
            <span className="font-mono text-xs font-extrabold px-1.5 py-0.5 bg-[#5c4424] text-[#fdf6e2] rounded shadow-sm shrink-0">
              x{item.quantity}
            </span>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span
            className={`inline-block text-[9px] uppercase px-2 py-0.5 rounded border tracking-wider ${styles.badge}`}
          >
            {item.rarity}
          </span>

          <span className="inline-block text-[9px] uppercase font-bold px-2 py-0.5 bg-[#dfcb9f]/80 text-[#5c4424] rounded border border-[#8c6b3e]/40 tracking-wider">
            {item.category.replace('_', ' ')}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-snug">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
};