// ===== Sprint 9.6 =====
import React, { useEffect, useRef, useState } from 'react';
import { InventoryItem } from '../../inventory/models/InventoryItem';
import { ItemRarity } from '../../inventory/models/ItemTypes';
// ===== Sprint 10.2 Interactive Inventory Foundation START =====
import { ItemUseService, ItemUseResult } from '../../inventory/services/ItemUseService';
// ===== Sprint 10.2 Interactive Inventory Foundation END =====

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

  // ===== Sprint 10.2 Interactive Inventory Foundation START =====
  const [useResult, setUseResult] = useState<ItemUseResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUseResult(null);
    }
  }, [item, isOpen]);

  const handleUseItem = () => {
    if (!item) return;
    const result = ItemUseService.executeItem(item.id);
    setUseResult(result);
  };

  const isUsed = useResult?.effect === 'MARK_USED';
  // ===== Sprint 10.2 Interactive Inventory Foundation END =====

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

        {/* ===== Sprint 10.2 Interactive Inventory Foundation START ===== */}
        {useResult && (
          <div className={`w-full p-3 mb-2 rounded-lg border-2 text-center text-sm font-bold ${
            useResult.success 
              ? 'bg-[#ebd9b4] border-[#8c6b3e] text-[#5c4424]' 
              : 'bg-red-100 border-red-500 text-red-900'
          }`}>
            {useResult.message}
          </div>
        )}
        {/* ===== Sprint 10.2 Interactive Inventory Foundation END ===== */}

        {/* Action Controls */}
        <div className="mt-4 flex gap-4 w-full">
          {/* ===== Sprint 10.2 Interactive Inventory Foundation START ===== */}
          {item.usable !== false && (
            <button
              onClick={handleUseItem}
              disabled={isUsed}
              className={`flex-1 px-6 py-3.5 font-black text-xs uppercase tracking-widest rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-amber-500/50 shadow-md ${
                isUsed
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed border-2 border-gray-500'
                  : 'bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-900 cursor-pointer'
              }`}
            >
              {isUsed ? 'Used' : 'Use Item'}
            </button>
          )}
          {/* ===== Sprint 10.2 Interactive Inventory Foundation END ===== */}
          
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="flex-1 px-6 py-3.5 bg-[#8c6b3e] hover:bg-[#5c4424] text-[#fdf6e2] font-black text-xs uppercase tracking-widest rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-amber-500/50 shadow-md cursor-pointer"
          >
            Stop Inspecting
          </button>
        </div>
      </div>
    </div>
  );
};