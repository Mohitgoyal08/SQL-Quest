import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorldManager } from '../../systems/WorldManager';

// Metadata for the islands mapped out on the Sea Chart
const ISLANDS_MANIFEST = [
  {
    id: 'tutorial_island',
    name: 'Tutorial Harbor',
    x: '20%',
    y: '50%',
    icon: '⚓',
    description: 'Where greenhorn privateers learn the ropes of relational crew manifests.',
    requirements: null,
  },
  {
    id: 'merchant_isles',
    name: 'Merchant Isles',
    x: '45%',
    y: '30%',
    icon: '🪙',
    description: 'Bustling markets where commodities and transactional logs are audited.',
    requirements: { requiresShip: true },
  },
  {
    id: 'smugglers_cove',
    name: "Smuggler's Cove",
    x: '75%',
    y: '25%',
    icon: '☠️',
    description: 'A treacherous hiding place for high earners and sorted manifests.',
    requirements: { requiredChallengeId: 'chal_99' },
  },
  {
    id: 'jungle_queries',
    name: 'Jungle of Queries',
    x: '80%',
    y: '65%',
    icon: '🌴',
    description: 'Dense forests where advanced aggregations and nested joins lie buried.',
    requirements: { requiredChallengeId: 'chal_99' },
  },
  {
    id: 'crystal_caverns',
    name: 'Crystal Caverns',
    x: '48%',
    y: '70%',
    icon: '🔮',
    description: 'Shimmering caves hiding complex relational structures and subqueries.',
    requirements: { requiredChallengeId: 'chal_99' },
  }
];

export default function SeaChartModal({ onClose, progress, onTravelTo }) {
  const [selectedLockedIsland, setSelectedLockedIsland] = useState(null);

  // Close map on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleIslandClick = (island) => {
    const isUnlocked = WorldManager.checkRequirements(island.requirements, progress);
    
    // TODO (ADR-0022): Separate story progression challenge tracking from physical location state.
    // Temporarily derive the player's physical coordinates from the first voyage unlock state.
    const physicalIslandId = !progress.unlocks?.merchantIslesVoyaged ? 'tutorial_island' : progress.currentIsland;
    const isCurrentLocation = island.id === physicalIslandId;
    
    if (isCurrentLocation) {
      return;
    }

    if (isUnlocked) {
      if (typeof onTravelTo === 'function') {
        onTravelTo(island.id);
      }
      return;
    }
    // Set the selected locked island to trigger the custom parchment warning card
    setSelectedLockedIsland(island);
  };

  return (
    <div role="dialog" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Main parchment container */}
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className="relative w-full max-w-4xl h-[75vh] min-h-[500px] bg-[#fdf6e2] border-8 border-double border-[#8c6b3e] rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle, #fdf6e2 60%, #ebd9b4 100%)',
          boxShadow: 'inset 0 0 50px rgba(92,68,36,0.25), 0 25px 50px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()} // Prevent close on modal body click
      >
        {/* Header / Title */}
        <div className="flex items-center justify-between border-b-2 border-[#8c6b3e]/40 pb-3 mb-4 z-10">
          <div>
            <h2 className="text-2xl font-black text-[#5c4424] uppercase tracking-wider leading-none">
              Sea Chart
            </h2>
            <span className="text-[10px] font-bold text-[#8c6b3e] uppercase tracking-widest mt-1 block">
              Map of the Uncharted Relational Seas
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Map"
            className="w-10 h-10 bg-[#ebd9b4] hover:bg-[#dfcb9f] text-[#5c4424] font-black text-lg rounded-xl border-2 border-[#8c6b3e] flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#5c4424]"
          >
            ✕
          </button>
        </div>

        {/* Map Grid / Visualization */}
        <div className="relative flex-1 bg-[#ebd9b4]/30 border-2 border-dashed border-[#8c6b3e]/50 rounded-xl overflow-hidden shadow-inner">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(140,107,62,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(140,107,62,0.05)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

          {/* Compass visual */}
          <div className="absolute right-6 bottom-6 opacity-25 text-8xl pointer-events-none select-none">
            🧭
          </div>

          {/* Islands rendering */}
          {ISLANDS_MANIFEST.map((island) => {
            // TODO (ADR-0022): Use physicalIslandId here as well to correctly position the ship icon.
            const physicalIslandId = !progress.unlocks?.merchantIslesVoyaged ? 'tutorial_island' : progress.currentIsland;
            const isCurrentLocation = island.id === physicalIslandId;
            const isUnlocked = WorldManager.checkRequirements(island.requirements, progress);
            
            return (
              <div
                key={island.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: island.x, top: island.y }}
              >
                {/* Island Button / Icon container */}
                <button
                  onClick={() => handleIslandClick(island)}
                  className={`relative group w-16 h-16 rounded-full border-4 flex items-center justify-center text-3xl shadow-lg transition-all duration-300 ${
                    isUnlocked
                      ? 'bg-[#ebd9b4] border-[#8c6b3e] hover:bg-[#dfcb9f] hover:scale-110 cursor-pointer'
                      : 'bg-gray-400/50 border-gray-600/50 cursor-pointer hover:border-red-400'
                  }`}
                >
                  {/* Lock Indicator */}
                  {!isUnlocked && (
                    <div className="absolute -top-1 -right-1 bg-red-800 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#fdf6e2] text-xs font-bold shadow-md">
                      🔒
                    </div>
                  )}

                  {/* Current Location Ship Indicator */}
                  {isCurrentLocation && (
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className="absolute -top-7 text-2xl filter drop-shadow-md"
                      title="Current Location"
                    >
                      ⛵
                    </motion.div>
                  )}

                  <span>{island.icon}</span>
                </button>

                {/* Island Name */}
                <span className={`mt-2 font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded border ${
                  isUnlocked 
                    ? 'text-[#5c4424] bg-[#ebd9b4] border-[#8c6b3e]/40' 
                    : 'text-gray-500 bg-gray-200 border-gray-400/40'
                }`}>
                  {island.name}
                </span>
              </div>
            );
          })}

          {/* Parchment requirements warning overlay */}
          <AnimatePresence>
            {selectedLockedIsland && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-[#000]/60 flex items-center justify-center p-4 z-20"
              >
                <div 
                  className="w-full max-w-sm bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-xl p-6 shadow-2xl relative text-center"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #fdf6e2 60%, #ebd9b4 100%)',
                    boxShadow: 'inset 0 0 30px rgba(92,68,36,0.2)'
                  }}
                >
                  <span className="text-4xl mb-3 block">🌊</span>
                  <h3 className="text-lg font-black text-[#5c4424] uppercase tracking-wide mb-1 font-serif">
                    {selectedLockedIsland.name}
                  </h3>
                  <div className="w-16 h-0.5 bg-[#8c6b3e] mx-auto mb-3" />
                  
                  <p className="text-xs text-amber-950/80 font-bold uppercase tracking-wider leading-relaxed mb-5 italic max-w-xs mx-auto">
                    "These waters cannot be crossed without a seaworthy vessel."
                  </p>

                  <div className="p-3 bg-[#ebd9b4]/50 border-2 border-dashed border-[#8c6b3e]/40 rounded-lg text-[10px] text-amber-900 font-extrabold uppercase tracking-widest mb-5 leading-normal">
                    📌 Quest Objective:<br/>
                    Continue story training at Tutorial Harbor to unlock and repair your first ship!
                  </div>

                  <button
                    onClick={() => setSelectedLockedIsland(null)}
                    className="px-6 py-2.5 bg-[#8c6b3e] hover:bg-[#5c4424] text-[#fdf6e2] border-2 border-[#5c4424] font-black text-[10px] uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                  >
                    Return to Harbor
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
