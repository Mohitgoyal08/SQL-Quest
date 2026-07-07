// ===== Sprint 9.4B Phase 2 =====
import React from 'react';
import { InventoryItem } from '../../inventory/models/InventoryItem';
import { ItemRarity } from '../../inventory/models/ItemTypes';

interface InventoryItemCardProps {
  item: InventoryItem;
}

const RARITY_STYLES: Record<ItemRarity, { badge: string; border: string }> = {
  [ItemRarity.COMMON]: {
    badge: 'bg-[#ebd9b4] text-[#5c4424] border-[#8c6b3e]/60',
    border: 'border-[#8c6b3e]/60 hover:border-[#8c6b3e]'
  },
  [ItemRarity.RARE]: {
    badge: 'bg-blue-900 text-blue-100 border-blue-400 font-bold',
    border: 'border-blue-900/60 hover:border-blue-600'
  },
  [ItemRarity.EPIC]: {
    badge: 'bg-purple-900 text-purple-100 border-purple-400 font-bold',
    border: 'border-purple-900/60 hover:border-purple-600'
  },
  [ItemRarity.LEGENDARY]: {
    badge: 'bg-amber-600 text-amber-950 border-yellow-300 font-black animate-pulse',
    border: 'border-amber-600 hover:border-yellow-500 shadow-md'
  }
};

export const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item }) => {
  const styles = RARITY_STYLES[item.rarity] || RARITY_STYLES[ItemRarity.COMMON];

  return (
    <div
      className={`p-3.5 bg-[#ebd9b4]/60 border-2 rounded-xl flex items-start gap-3.5 transition-all duration-200 transform hover:-translate-y-0.5 hover:bg-[#ebd9b4] hover:shadow-lg ${styles.border}`}
    >
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
        <p className="text-xs text-amber-950/80 font-medium leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
    </div>
  );
};