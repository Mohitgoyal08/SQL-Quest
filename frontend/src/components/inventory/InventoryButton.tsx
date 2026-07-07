// ===== Sprint 9.4B Phase 2 =====
import React from 'react';

interface InventoryButtonProps {
  itemCount: number;
  onClick: () => void;
}

export const InventoryButton: React.FC<InventoryButtonProps> = ({
  itemCount,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={`Open Inventory (${itemCount} items)`}
      className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-[#8c6b3e] hover:bg-[#5c4424] text-[#fdf6e2] font-black text-xs md:text-sm uppercase tracking-widest rounded-xl border-4 border-[#5c4424] shadow-2xl transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2.5 cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-amber-500/50"
    >
      <span className="text-xl leading-none">🎒</span>
      <span className="hidden sm:inline">Satchel</span>
      {itemCount > 0 && (
        <span className="px-2 py-0.5 bg-emerald-700 text-white font-mono text-xs font-bold rounded-full border border-emerald-400 animate-pulse">
          {itemCount}
        </span>
      )}
    </button>
  );
};