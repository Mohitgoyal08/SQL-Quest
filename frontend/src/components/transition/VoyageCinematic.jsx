import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioService } from '../../services/AudioService';

const ISLAND_DATA = {
  tutorial_island: { name: 'Tutorial Harbor', icon: '⚓', ch: 1, subtitle: 'Where it all began...' },
  merchant_isles: { name: 'Merchant Isles', icon: '🪙', ch: 2, subtitle: '📍 Destination reached. Auditing guilds and market logs await.' },
  smugglers_cove: { name: "Smuggler's Cove", icon: '☠️', ch: 3, subtitle: '📍 Beware the shadows. Secrets and illegal joins lie ahead.' },
  jungle_queries: { name: 'Jungle of Queries', icon: '🌴', ch: 4, subtitle: '📍 Thick vines and tangled syntax. Proceed with caution.' },
  crystal_caverns: { name: 'Crystal Caverns', icon: '🔮', ch: 5, subtitle: '📍 Glowing gems reflect your recursive thoughts.' },
  volcano_island: { name: 'Volcano Island', icon: '🌋', ch: 6, subtitle: '📍 Optimize your queries before they melt.' },
  lost_sea: { name: 'Lost Sea', icon: '🌊', ch: 7, subtitle: '📍 Only pure logic can guide you.' },
  pirate_kings_ship: { name: "Pirate King's Ship", icon: '👑', ch: 8, subtitle: '📍 The final battle for the Codex.' },
};

export default function VoyageCinematic({ onComplete, progress, originId, destinationId }) {
  const [stage, setStage] = useState(1); // 1: Departure, 2: Open Sea, 3: Arrival

  const origin = ISLAND_DATA[originId] || ISLAND_DATA.tutorial_island;
  const dest = ISLAND_DATA[destinationId] || ISLAND_DATA.merchant_isles;

  useEffect(() => {
    AudioService.startOceanAmbience();
    // Stage 1 (Departure): 3 seconds
    const t1 = setTimeout(() => setStage(2), 3000);
    
    // Stage 2 (Open Sea - lengthened for scale and atmosphere): 6 seconds
    const t2 = setTimeout(() => setStage(3), 9000);
    
    // Stage 3 (Arrival): 4 seconds
    const t3 = setTimeout(() => {
      onComplete();
    }, 13000);

    return () => {
      AudioService.stopOceanAmbience();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const activeShipName = progress?.fleet?.activeShipId && progress?.fleet?.ships?.[progress.fleet.activeShipId]
    ? progress.fleet.ships[progress.fleet.activeShipId].name
    : 'The Sloop';

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950 overflow-hidden select-none font-sans">
      
      {/* Parallax Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f283d] via-[#07131f] to-[#040810] z-0 pointer-events-none" />
      
      {/* Drifting Clouds & Seagulls (Phase 5) */}
      <div className="absolute top-10 left-0 right-0 h-40 pointer-events-none select-none overflow-hidden z-10">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          className="absolute w-[300%] h-full opacity-30 bg-repeat-x"
          style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'50\'><circle cx=\'30\' cy=\'30\' r=\'20\' fill=\'%23ffffff\' opacity=\'0.1\'/><circle cx=\'60\' cy=\'25\' r=\'25\' fill=\'%23ffffff\' opacity=\'0.1\'/></svg>")' }}
        />
        {/* Seagulls */}
        <motion.div 
          animate={{ x: [-100, window.innerWidth + 100], y: [0, 20, -10, 15, 0] }}
          transition={{ x: { repeat: Infinity, duration: 18, ease: "linear" }, y: { repeat: Infinity, duration: 8, ease: "easeInOut" } }}
          className="absolute top-20 left-0 text-white/40 text-xs"
        >
          🦅
        </motion.div>
        <motion.div 
          animate={{ x: [window.innerWidth + 100, -100], y: [10, -15, 5, -20, 10] }}
          transition={{ x: { repeat: Infinity, duration: 25, ease: "linear", delay: 3 }, y: { repeat: Infinity, duration: 10, ease: "easeInOut" } }}
          className="absolute top-12 left-0 text-white/30 text-[10px]"
          style={{ transform: 'scaleX(-1)' }}
        >
          🦅
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Stage 1: Departure from Tutorial Harbor */}
        {stage === 1 && (
          <motion.div
            key="departure"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20"
          >
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-[#fdf6e2]/10 backdrop-blur-md border border-[#8c6b3e]/40 p-6 rounded-2xl max-w-md shadow-2xl"
            >
              <span className="text-5xl mb-3 block">👋</span>
              <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2 font-mono">
                Leaving {origin.name}
              </h3>
              <p className="text-sm text-[#ebd9b4] font-bold italic leading-relaxed">
                "The anchors are weighed and the canvas is full. You cast off into the unknown..."
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Stage 2: Open Ocean (Silent, atmospheric sailing) */}
        {stage === 2 && (
          <motion.div
            key="opensea"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20"
          >
            {/* Minimal atmospheric labels so players absorb scale */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 5 }}
              className="text-[#ebd9b4]/50 font-mono text-xs uppercase tracking-[0.3em] pointer-events-none select-none"
            >
              Cruising the SQL Seas
            </motion.div>
          </motion.div>
        )}

        {/* Stage 3: Arrival at Merchant Isles */}
        {stage === 3 && (
          <motion.div
            key="arrival"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-[#ebd9b4] border-8 border-double border-[#5c4424] p-8 rounded-xl shadow-2xl max-w-md"
              style={{
                backgroundImage: 'radial-gradient(circle, #fdf6e2 60%, #ebd9b4 100%)',
                boxShadow: 'inset 0 0 35px rgba(92,68,36,0.2), 0 25px 50px rgba(0,0,0,0.6)'
              }}
            >
              <span className="text-6xl mb-3 block filter drop-shadow-md">{dest.icon}</span>
              <h2 className="text-xs font-bold text-[#8c6b3e] uppercase tracking-[0.2em] mb-1 font-mono">
                Chapter {dest.ch}
              </h2>
              <h1 className="text-3xl font-black text-[#5c4424] uppercase tracking-widest leading-none mb-4 font-serif">
                {dest.name}
              </h1>
              <div className="w-16 h-0.5 bg-[#8c6b3e] mx-auto mb-4" />
              <p className="text-xs text-amber-950 font-extrabold uppercase tracking-wide leading-normal">
                {dest.subtitle}
              </p>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Sailing Ship Layer (Auto-sailing left-to-right parallax) */}
      <div className="absolute inset-x-0 bottom-1/4 h-32 flex items-center justify-center z-10 pointer-events-none">
        
        {/* Parallax Wave back layer */}
        <motion.div 
          animate={{ x: [0, -100] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-x-0 bottom-0 h-10 w-[200%] bg-[#0c2a45]/20" 
          style={{ backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05) 100%)', backgroundSize: '20px 20px' }}
        />

        {/* Floating Ship */}
        <motion.div
          animate={{ 
            y: [0, -6, 0],
            rotate: [0, 1.5, -1.5, 0],
            x: stage === 1 ? [-300, 0] : stage === 3 ? [0, 300] : 0
          }}
          transition={{
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
            x: { duration: 3, ease: "easeOut" }
          }}
          className="relative flex flex-col items-center filter drop-shadow-2xl"
        >
          {/* Ship Wake Trail (Phase 5) */}
          <motion.div 
            animate={{ scaleX: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-2 -left-16 w-16 h-2 bg-white/30 rounded-full blur-sm origin-right"
          />

          {/* Animated Water Spray Foam */}
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="absolute bottom-1 -left-4 text-2xl filter drop-shadow-md"
          >
            🌊
          </motion.div>

          <span className="text-8xl select-none relative z-10">⛵</span>
          
          <span className="absolute -bottom-6 text-[10px] font-mono uppercase bg-slate-900/90 text-amber-500 border border-amber-500/40 px-2 py-0.5 rounded shadow-sm tracking-wider whitespace-nowrap z-20">
            {activeShipName}
          </span>
        </motion.div>

        {/* Parallax Wave front layer */}
        <motion.div 
          animate={{ x: [0, -100] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute inset-x-0 bottom-0 h-8 w-[200%] bg-[#0b2137]/45" 
          style={{ backgroundImage: 'linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.03) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.03) 75%, rgba(255,255,255,0.03) 100%)', backgroundSize: '30px 30px' }}
        />

      </div>

      {/* Footer bar */}
      <footer className="relative z-20 bg-[#07131f] border-t border-[#8c6b3e]/30 px-4 py-2 flex items-center justify-between text-[10px] text-[#ebd9b4]/50 font-mono">
        <span>SQL Quest Voyage Simulator</span>
        <span>Speed: 10 Knots | Heading: North-East</span>
      </footer>

    </div>
  );
}
