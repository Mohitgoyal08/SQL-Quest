import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MERCHANT_CONFIG } from '../../config/merchantConfig';
import { ITEM_CATALOG } from '../../inventory/data/ItemCatalog';

export default function Shop({ merchantId, progress, onClose, onPurchase }) {
  const config = MERCHANT_CONFIG[merchantId];
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmingItem, setConfirmingItem] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);

  // Close shop on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!config) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-amber-100 p-4">
        <div className="bg-[#fdf6e2] border-4 border-[#8c6b3e] p-6 rounded-2xl">
          <p>⚠️ Shop Configuration not found for [{merchantId}].</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-[#8c6b3e] text-[#fdf6e2] rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setConfirmingItem(null);
    setPurchaseError(null);
    setPurchaseSuccess(false);
  };

  const handleInitiatePurchase = (item) => {
    if (progress.coins < item.price) {
      setPurchaseError("Not enough gold in your pouch!");
      return;
    }
    setConfirmingItem(item);
  };

  const handleConfirmPurchase = () => {
    if (!confirmingItem) return;
    onPurchase(confirmingItem.id, confirmingItem.price);
    
    setPurchaseSuccess(true);
    setConfirmingItem(null);
    
    // Clear success message after 2 seconds
    setTimeout(() => {
      setPurchaseSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 select-none animate-fadeIn">
      {/* Outer Click to Close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-4xl h-[80vh] min-h-[500px] bg-[#fdf6e2] border-8 border-double border-[#8c6b3e] rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 overflow-hidden z-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #fdf6e2 60%, #ebd9b4 100%)',
          boxShadow: 'inset 0 0 50px rgba(92,68,36,0.2), 0 25px 50px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left Hand: Shopkeeper & Item List */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#8c6b3e]/40 pb-3 mb-4">
            <div>
              <h2 className="text-2xl font-black text-[#5c4424] uppercase tracking-wider leading-none">
                {config.shopName}
              </h2>
              <span className="text-[10px] font-bold text-[#8c6b3e] uppercase tracking-widest mt-1 block">
                Storekeeper: {config.shopkeeperName}
              </span>
            </div>
            
            <div className="flex items-center gap-2 bg-[#ebd9b4]/60 border border-[#8c6b3e]/40 rounded-xl px-3 py-1.5 shadow-inner">
              <span className="text-xl">🪙</span>
              <span className="font-mono font-black text-amber-950 text-sm">
                {progress.coins} Gold
              </span>
            </div>
          </div>

          {/* Shopkeeper Greeting */}
          <div className="bg-[#fdf6e2]/80 border border-[#8c6b3e]/30 rounded-xl p-3 mb-4 flex gap-3 items-center">
            <span className="text-4xl filter drop-shadow-sm">{config.shopkeeperAvatar}</span>
            <p className="text-[11px] text-amber-900 font-extrabold italic leading-relaxed">
              "{config.greeting}"
            </p>
          </div>

          {/* Item Grid */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-2.5">
            {config.items.map((shopItem) => {
              const catalogItem = ITEM_CATALOG[shopItem.id];
              if (!catalogItem) return null;

              const isSelected = selectedItem?.id === shopItem.id;
              const isOwned = progress.inventory.includes(shopItem.id);
              const isSoldOut = !catalogItem.stackable && isOwned;

              return (
                <button
                  key={shopItem.id}
                  onClick={() => handleItemSelect({ ...catalogItem, ...shopItem })}
                  className={`w-full text-left p-3 rounded-xl border-2 flex items-center justify-between transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#dfcb9f] border-[#5c4424] shadow-md'
                      : 'bg-[#fdf6e2]/40 border-[#8c6b3e]/20 hover:border-[#8c6b3e]/60 hover:bg-[#ebd9b4]/40 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl filter drop-shadow-sm">{catalogItem.icon}</span>
                    <div>
                      <h4 className="font-black text-[#5c4424] text-xs uppercase tracking-wide leading-tight">
                        {catalogItem.name}
                      </h4>
                      <span className="text-[8px] font-bold text-[#8c6b3e] uppercase tracking-wider block mt-0.5">
                        Category: {catalogItem.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isSoldOut ? (
                      <span className="text-[10px] font-black text-amber-900/60 uppercase tracking-widest bg-amber-950/10 px-2.5 py-1 rounded border border-amber-950/20">
                        Sold Out
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 bg-amber-950/5 border border-[#8c6b3e]/30 px-3 py-1 rounded-lg">
                        <span className="text-xs">🪙</span>
                        <span className="font-mono font-black text-[#5c4424] text-xs">
                          {shopItem.price}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Hand: Selected Item View / Inspection Pane */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l-2 border-[#8c6b3e]/40 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div 
                key={selectedItem.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex-1 flex flex-col justify-between"
              >
                {/* Details */}
                <div className="text-center md:text-left">
                  <span className="text-7xl block my-4 filter drop-shadow-md text-center">
                    {selectedItem.icon}
                  </span>
                  
                  <h3 className="text-lg font-black text-[#5c4424] uppercase tracking-wider mb-1 font-serif text-center">
                    {selectedItem.name}
                  </h3>
                  
                  <div className="flex justify-center gap-1.5 mb-4">
                    <span className="text-[8px] font-black bg-[#8c6b3e]/15 text-[#8c6b3e] px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#8c6b3e]/30">
                      {selectedItem.rarity}
                    </span>
                    <span className="text-[8px] font-black bg-amber-950/15 text-amber-950 px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-950/20">
                      {selectedItem.category}
                    </span>
                  </div>

                  <p className="text-xs text-amber-950 font-bold uppercase tracking-wide leading-relaxed italic border-t border-[#8c6b3e]/20 pt-3 text-center md:text-left">
                    "{selectedItem.description}"
                  </p>
                </div>

                {/* Purchase Actions */}
                <div className="mt-6 border-t-2 border-[#8c6b3e]/30 pt-4 flex flex-col gap-2 text-center">
                  
                  {purchaseSuccess && (
                    <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold py-2 rounded-lg uppercase tracking-wide">
                      🎉 Item purchased! Added to satchel.
                    </div>
                  )}

                  {purchaseError && (
                    <div className="bg-red-100 border border-red-300 text-red-800 text-[10px] font-bold py-2 rounded-lg uppercase tracking-wide">
                      ❌ {purchaseError}
                    </div>
                  )}

                  {confirmingItem ? (
                    <div className="bg-amber-100 border border-amber-300 p-3 rounded-lg flex flex-col gap-2">
                      <p className="text-[10px] font-black text-amber-950 uppercase tracking-wide">
                        Purchase this item for {confirmingItem.price} gold?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleConfirmPurchase}
                          className="flex-1 py-1.5 bg-emerald-700 text-white font-bold text-[9px] uppercase tracking-widest rounded cursor-pointer hover:bg-emerald-800"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmingItem(null)}
                          className="flex-1 py-1.5 bg-gray-500 text-white font-bold text-[9px] uppercase tracking-widest rounded cursor-pointer hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleInitiatePurchase(selectedItem)}
                      disabled={progress.inventory.includes(selectedItem.id) && !selectedItem.stackable}
                      className={`w-full py-3 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all duration-200 border-2 ${
                        progress.inventory.includes(selectedItem.id) && !selectedItem.stackable
                          ? 'bg-gray-400/50 border-gray-500 text-gray-500/80 cursor-not-allowed'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-950 shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
                      }`}
                    >
                      {progress.inventory.includes(selectedItem.id) && !selectedItem.stackable
                        ? 'Already Purchased'
                        : `Buy for ${selectedItem.price} Gold`}
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                <span className="text-5xl mb-2">📜</span>
                <p className="text-xs font-bold text-[#8c6b3e] uppercase tracking-widest">
                  Inspect an item to make an offer.
                </p>
              </div>
            )}
          </AnimatePresence>

          <button
            onClick={onClose}
            className="w-full mt-4 py-2 bg-transparent hover:bg-[#8c6b3e]/10 text-[#5c4424] border border-[#8c6b3e] font-black text-[9px] uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
          >
            Leave Shop
          </button>
        </div>

      </motion.div>
    </div>
  );
}
