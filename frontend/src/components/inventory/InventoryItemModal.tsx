// ===== Sprint 9.6 =====
import React, { useEffect, useRef } from 'react';
import { InventoryItem } from '../../inventory/models/InventoryItem';
import { ItemRarity } from '../../inventory/models/ItemTypes';

interface InventoryItemModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onClose: () => void;
}

const RARITY_COLORS: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: 'bg-[#ebd9b4] text-[#5c4424] border-[#8c6b3e]/60',
  [ItemRarity.RARE]: 'bg-blue-900 text-blue-100 border-blue-400 font-bold',
  [ItemRarity.EPIC]: 'bg-purple-900 text-purple-100 border-purple-400 font-bold',
  [ItemRarity.LEGENDARY]: 'bg-amber-600 text-amber-950 border-yellow-400 font-black'
};

export const InventoryItemModal: React.FC<InventoryItemModalProps> = ({ 
  isOpen, 
  item, 
  onClose 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Focus trap & Escape key handler (uses capture phase to prevent closing outer panel)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation(); 
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    // Auto-focus close button for keyboard accessibility
    closeBtnRef.current?.focus();

    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  // Handle click outside nested modal viewport
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      e.stopPropagation();
      onClose();
    }
  };

  const rarityStyle = RARITY_COLORS[item.rarity] || RARITY_COLORS[ItemRarity.COMMON];

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 opacity-100 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspection-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-sm bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-2xl p-8 shadow-2xl flex flex-col items-center transition-all duration-300 transform scale-100 text-center relative"
      >
        {/* Item Icon */}
        <div className="w-24 h-24 mb-5 bg-[#ebd9b4] border-4 border-[#8c6b3e]/60 rounded-2xl flex items-center justify-center text-5xl shadow-inner">
          {item.icon}
        </div>

        {/* Title */}
        <h2 
          id="inspection-title" 
          className="text-2xl font-black text-[#5c4424] uppercase tracking-wider mb-3 leading-tight"
        >
          {item.name}
        </h2>

        {/* Badges */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-5">
          <span className={`text-[10px] uppercase px-2.5 py-1 rounded border tracking-widest ${rarityStyle}`}>
            {item.rarity}
          </span>
          <span className="text-[10px] uppercase font-bold px-2.5 py-1 bg-[#dfcb9f]/80 text-[#5c4424] rounded border border-[#8c6b3e]/40 tracking-widest">
            {item.category.replace('_', ' ')}
          </span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#8c6b3e]/30 my-2"></div>

        {/* Description & Lore */}
        <div className="my-4">
          <p className="text-sm text-amber-950/90 font-medium leading-relaxed italic mb-4">
            "{item.description}"
          </p>
          <p className="text-[10px] text-[#8c6b3e] font-extrabold uppercase tracking-widest">
         An item recovered during your search for the Lost Codex.
          </p>
        </div>

        {/* Close Controls */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="mt-4 w-full px-6 py-3.5 bg-[#8c6b3e] hover:bg-[#5c4424] text-[#fdf6e2] font-black text-xs uppercase tracking-widest rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-amber-500/50 shadow-md cursor-pointer"
        >
          Stop Inspecting
        </button>
      </div>
    </div>
  );
};