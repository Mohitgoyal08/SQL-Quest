import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { WorldManager } from '../../../systems/WorldManager';
import { AudioService } from '../../../services/AudioService';

// Use same percentages as WorldReveal for consistency
const ISLANDS_MANIFEST = [
  { id: 'tutorial_island', name: 'Tutorial Harbor', top: '70%', left: '15%', glowing: true, requirements: null, icon: '⚓' },
  { id: 'merchant_isles', name: 'Merchant Isles', top: '45%', left: '25%', glowing: false, requirements: { requiresShip: true }, icon: '🪙' },
  { id: 'smugglers_cove', name: "Smuggler's Cove", top: '35%', left: '40%', glowing: false, requirements: { requiredChallengeId: 'merchant_02' }, icon: '☠️' },
  { id: 'jungle_queries', name: 'Jungle of Queries', top: '55%', left: '50%', glowing: false, requirements: { requiredChallengeId: 'smugglers_03' }, icon: '🌴' },
  { id: 'crystal_caverns', name: 'Crystal Caverns', top: '40%', left: '65%', glowing: false, requirements: { requiredChallengeId: 'jungle_03' }, icon: '🔮' },
  { id: 'volcano_island', name: 'Volcano Island', top: '25%', left: '75%', glowing: false, requirements: { requiredChallengeId: 'crystal_03' }, icon: '🌋' },
  { id: 'lost_sea', name: 'Lost Sea', top: '65%', left: '80%', glowing: false, requirements: { requiredChallengeId: 'volcano_02' }, icon: '🌊' },
  { id: 'pirate_kings_ship', name: "Pirate King's Ship", top: '30%', left: '90%', glowing: false, requirements: { requiredChallengeId: 'lost_sea_02' }, icon: '👑' },
];

export default function SeaWorld({ progress, onTravelTo }) {
  const currentIslandId = WorldManager.getWorldState(progress).currentIsland;

  useEffect(() => {
    AudioService.startOceanAmbience();
    return () => AudioService.stopOceanAmbience();
  }, []);

  const handleIslandClick = (island) => {
    const isUnlocked = WorldManager.checkRequirements(island.requirements, progress);
    const isCurrentLocation = island.id === currentIslandId;
    
    if (isCurrentLocation) return;

    if (isUnlocked && typeof onTravelTo === 'function') {
      AudioService.playClick();
      onTravelTo(island.id);
    }
  };

  return (
    <div className="flex-1 relative bg-[#0ea5e9] overflow-hidden select-none">
      {/* Ocean Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8] to-[#0284c7]">
        {/* Cartoon Water Texture */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 60%)', backgroundSize: '200px 150px' }} />
        
        {/* Dotted Route */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
          <path 
            d="M 15 70 Q 20 50 25 45 Q 30 40 40 35 Q 45 40 50 55 Q 60 55 65 40 Q 70 30 75 25 Q 80 40 80 65 Q 85 65 90 30" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.4)" 
            strokeWidth="2" 
            strokeDasharray="5 5" 
            strokeLinecap="round"
          />
        </svg>

        {/* Islands */}
        {ISLANDS_MANIFEST.map((island) => {
          const isUnlocked = WorldManager.checkRequirements(island.requirements, progress);
          const isCurrentLocation = island.id === currentIslandId;

          return (
            <motion.div 
              key={island.id} 
              className={`absolute flex flex-col items-center ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`} 
              style={{ top: island.top, left: island.left, transform: 'translate(-50%, -50%)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => handleIslandClick(island)}
            >
              <div 
                className={`
                  relative flex items-center justify-center rounded-full
                  w-16 h-16 md:w-24 md:h-24 text-3xl md:text-5xl shadow-2xl transition-all
                  ${isUnlocked ? 'hover:scale-110' : 'opacity-60 grayscale'}
                  ${isCurrentLocation ? 'ring-4 ring-white bg-green-500' : (isUnlocked ? 'bg-[#8c6b3e] ring-2 ring-amber-300' : 'bg-slate-700')}
                `}
              >
                {island.icon}
                
                {/* Ship Marker */}
                {isCurrentLocation && progress.unlocks?.ship && (
                  <motion.div 
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-10 text-4xl filter drop-shadow-md z-20"
                  >
                    ⛵
                  </motion.div>
                )}
                
                {/* Locked Padlock */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 rounded-full">
                    <span className="text-2xl drop-shadow-md">🔒</span>
                  </div>
                )}
              </div>
              <span className={`mt-3 font-bold text-sm md:text-lg text-center tracking-wide filter drop-shadow-md ${isUnlocked ? 'text-white' : 'text-slate-300'}`}>
                {island.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
