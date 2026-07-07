import React, { useEffect, useRef } from 'react';
import { useInventory } from '../../inventory/hooks/useInventory';
import { ItemCategory } from '../../inventory/models/ItemTypes';
import { InventoryItemCard } from './InventoryItemCard';

interface InventoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_DISPLAY_ORDER: { key: ItemCategory; label: string }[] = [
  { key: ItemCategory.QUEST_ITEM, label: 'Quest Items' },
  { key: ItemCategory.KEY, label: 'Keys' },
  { key: ItemCategory.ARTIFACT, label: 'Artifacts' },
  { key: ItemCategory.TOOL, label: 'Tools' },
];

export const InventoryPanel: React.FC<InventoryPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { items } = useInventory();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Auto-focus the close button on mount for keyboard accessibility
    closeButtonRef.current?.focus();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-300 opacity-100 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col max-h-[85vh] transition-all duration-300 transform scale-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-[#8c6b3e] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none">🎒</span>
            <div>
              <h2
                id="inventory-title"
                className="text-2xl md:text-3xl font-black text-[#5c4424] uppercase tracking-wider leading-none"
              >
                Explorer's Satchel
              </h2>
              <span className="text-xs font-bold text-[#8c6b3e] uppercase tracking-widest mt-1 block">
                Total Carried: {totalItemCount}
              </span>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close Inventory"
            className="w-10 h-10 bg-[#ebd9b4] hover:bg-[#dfcb9f] text-[#5c4424] font-black text-lg rounded-xl border-2 border-[#8c6b3e] flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#5c4424]"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 md:pr-2">
          {items.length === 0 ? (
            /* Elegant Empty State */
            <div className="py-12 px-6 text-center border-2 border-dashed border-[#8c6b3e]/60 bg-[#ebd9b4]/30 rounded-2xl my-4">
              <span className="text-5xl block mb-3 opacity-80 animate-bounce">🎒</span>
              <h3 className="text-lg font-black text-[#5c4424] uppercase tracking-wide mb-1">
                Your satchel is empty.
              </h3>
              <p className="text-xs md:text-sm font-medium text-amber-950/70 max-w-sm mx-auto leading-relaxed">
                Complete missions to collect useful tools, keys, and artifacts across the harbor islands.
              </p>
            </div>
          ) : (
            /* Grouped Sections - Filtered to show only categories with items */
            CATEGORY_DISPLAY_ORDER
              .filter(({ key }) => items.some((item) => item.category === key))
              .map(({ key, label }) => {
                const categoryItems = items.filter((item) => item.category === key);

                return (
                  <section key={key} className="space-y-3">
                    {/* Section Title & Count */}
                    <div className="flex items-center justify-between border-b-2 border-[#8c6b3e]/40 pb-1.5">
                      <span className="text-xs font-black uppercase tracking-widest text-[#8c6b3e]">
                        {label}
                      </span>
                      <span className="text-[10px] font-extrabold text-[#5c4424] bg-[#ebd9b4] px-2 py-0.5 rounded-full border border-[#8c6b3e]/40">
                        {categoryItems.length}
                      </span>
                    </div>

                    {/* Section Content */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {categoryItems.map((item) => (
                        <InventoryItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                );
              })
          )}
        </div>
        {/* Footer */}
        <div className="border-t-2 border-[#8c6b3e]/40 pt-4 mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#8c6b3e] hover:bg-[#5c4424] text-[#fdf6e2] font-black text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5c4424]"
          >
            Close Satchel
          </button>
        </div>
      </div>
    </div>
  );
};