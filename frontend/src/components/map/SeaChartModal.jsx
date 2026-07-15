import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorldManager } from '../../systems/WorldManager';

// Metadata for the 8 islands mapped out on the Sea Chart in sequential order
const ISLANDS_MANIFEST = [
  {
    id: 'tutorial_island',
    name: 'Tutorial Harbor',
    x: '22%',
    y: '50%',
    icon: '⚓',
    index: 1,
    description: 'Where greenhorn privateers learn the ropes of relational crew manifests.',
  },
  {
    id: 'merchant_isles',
    name: 'Merchant Isles',
    x: '38%',
    y: '30%',
    icon: '⛵',
    index: 2,
    description: 'Bustling markets where commodities and transactional logs are audited.',
  },
  {
    id: 'smugglers_cove',
    name: "Smuggler's Cove",
    x: '65%',
    y: '25%',
    icon: '☠️',
    index: 3,
    description: 'A treacherous hiding place for high earners and sorted manifests.',
  },
  {
    id: 'jungle_queries',
    name: 'Jungle of Queries',
    x: '75%',
    y: '55%',
    icon: '🌴',
    index: 4,
    description: 'Dense forests where advanced aggregations and nested joins lie buried.',
  },
  {
    id: 'crystal_caverns',
    name: 'Crystal Caverns',
    x: '58%',
    y: '78%',
    icon: '🔮',
    index: 5,
    description: 'Shimmering caves hiding complex relational structures and subqueries.',
  },
  {
    id: 'volcano_island',
    name: 'Volcano Island',
    x: '35%',
    y: '78%',
    icon: '🌋',
    index: 6,
    description: 'Optimize your queries before they melt.',
  },
  {
    id: 'lost_sea',
    name: 'Lost Sea',
    x: '22%',
    y: '60%',
    icon: '🔭',
    index: 7,
    description: 'Navigate the deep fog of subqueries and complex joins.',
  },
  {
    id: 'pirate_kings_ship',
    name: "Pirate King's Ship",
    x: '50%',
    y: '50%',
    icon: '👑',
    index: 8,
    description: 'Confront the Pirate King in the ultimate SQL showdown.',
  }
];

export default function SeaChartModal({ onClose, progress }) {
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
    const isUnlocked = WorldManager.isIslandUnlocked(island.id, progress);
    if (isUnlocked) {
      // Sea Chart is purely reference. Gameplay starts from Sea World map.
      return;
    }
    setSelectedLockedIsland(island);
  };

  const totalCount = ISLANDS_MANIFEST.length;
  const completedCount = ISLANDS_MANIFEST.filter(island => 
    WorldManager.isIslandCompleted(island.id, progress)
  ).length;

  return (
    <div role="dialog" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 select-none animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Main parchment container */}
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className="relative w-full max-w-4xl h-[85vh] min-h-[620px] bg-[#fdf6e2] border-8 border-double border-[#8c6b3e] rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col overflow-hidden filter sepia-[0.2]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fdf6e2 60%, #ebd9b4 100%)',
          boxShadow: 'inset 0 0 50px rgba(92,68,36,0.35), 0 25px 50px rgba(0,0,0,0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
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
          <div className="absolute inset-0 bg-[linear-gradient(rgba(140,107,62,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(140,107,62,0.1)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

          {/* Dotted route connecting all 8 islands */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <path 
              d="M 22 50 L 38 30 L 65 25 L 75 55 L 58 78 L 35 78 L 22 60 L 50 50" 
              fill="none" 
              stroke="#8c6b3e" 
              strokeWidth="1.5" 
              strokeDasharray="2 2" 
              opacity="0.6"
            />
          </svg>

          {/* Compass visual */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
            className="absolute right-6 bottom-6 opacity-30 text-8xl pointer-events-none select-none filter drop-shadow-md"
          >
            🧭
          </motion.div>

          {/* Islands rendering */}
          {ISLANDS_MANIFEST.map((island) => {
            const physicalIslandId = !progress.unlocks?.merchantIslesVoyaged ? 'tutorial_island' : progress.currentIsland;
            const isCurrentLocation = island.id === physicalIslandId;
            const isUnlocked = WorldManager.isIslandUnlocked(island.id, progress);
            const isCompleted = WorldManager.isIslandCompleted(island.id, progress);
            
            return (
              <motion.div
                key={island.id}
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4 + Math.random() * 2, ease: "easeInOut" }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
                style={{ left: island.x, top: island.y }}
              >
                {/* Shadow */}
                <div className="absolute -bottom-2 w-10 h-2 bg-black/20 rounded-[100%] blur-sm pointer-events-none" />
                
                {/* Island Button / Icon container */}
                <button
                  onClick={() => handleIslandClick(island)}
                  className={`relative group w-14 h-14 rounded-full border-4 flex items-center justify-center text-2xl shadow-md transition-all duration-300 ${
                    isUnlocked
                      ? 'bg-[#ebd9b4] border-[#8c6b3e] hover:bg-[#dfcb9f] hover:scale-105 cursor-pointer'
                      : 'bg-gray-400/50 border-gray-600/50 cursor-pointer hover:border-red-400'
                  }`}
                >
                  {/* Sequence Index Circle Badge */}
                  <div className="absolute -top-2 -left-2 bg-[#fdf6e2] border-2 border-[#8c6b3e] text-[#5c4424] text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm z-20">
                    {island.index}
                  </div>

                  {/* Lock Indicator */}
                  {!isUnlocked && (
                    <div className="absolute -top-1.5 -right-1.5 bg-red-800 text-white w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-[#fdf6e2] text-[10px] font-bold shadow-sm">
                      🔒
                    </div>
                  )}

                  {/* Current Location Ship Indicator */}
                  {isCurrentLocation && (
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className="absolute -top-7 text-xl filter drop-shadow-md z-20"
                      title="Current Location"
                    >
                      ⛵
                    </motion.div>
                  )}

                  <span>{island.icon}</span>
                </button>

                {/* Island Name Label */}
                <span className={`mt-1.5 font-extrabold text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border leading-none ${
                  isUnlocked 
                    ? 'text-[#5c4424] bg-[#ebd9b4] border-[#8c6b3e]/40' 
                    : 'text-gray-500 bg-gray-200 border-gray-400/40'
                }`}>
                  {island.name}
                </span>

                {/* Island Progress/Status Badge */}
                <span className={`mt-1.5 text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border leading-none shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-800 border-emerald-600 text-emerald-100'
                    : isUnlocked
                    ? 'bg-amber-600 border-amber-500 text-amber-50'
                    : 'bg-red-800 border-red-600 text-red-100'
                }`}>
                  {isCompleted ? '✔ Completed' : isUnlocked ? 'Unlocked' : 'Locked'}
                </span>
              </motion.div>
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

        {/* Footer Voyage Progress Dashboard */}
        <div className="mt-4 flex justify-center z-10">
          <div 
            className="px-8 py-2.5 bg-[#0b2b40] border-2 border-double border-[#8c6b3e] rounded-xl shadow-lg text-center"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #0b2b40 0%, #05141f 100%)',
              boxShadow: 'inset 0 0 15px rgba(255, 200, 55, 0.15), 0 4px 10px rgba(0,0,0,0.5)'
            }}
          >
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">
              Your Voyage Progress
            </span>
            <span className="text-xs font-extrabold text-white uppercase tracking-wider mt-0.5 block">
              {completedCount} / {totalCount} Islands Completed
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
