import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoyageCinematic({ onComplete, progress }) {
  const [stage, setStage] = useState(1); // 1: Departure, 2: Open Sea, 3: Arrival

  useEffect(() => {
    // Stage 1 (Departure): 3 seconds
    const t1 = setTimeout(() => setStage(2), 3000);
    
    // Stage 2 (Open Sea - lengthened for scale and atmosphere): 6 seconds
    const t2 = setTimeout(() => setStage(3), 9000);
    
    // Stage 3 (Arrival): 4 seconds
    const t3 = setTimeout(() => {
      onComplete();
    }, 13000);

    return () => {
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
      
      {/* Drifting Clouds */}
      <div className="absolute top-10 left-0 right-0 h-40 pointer-events-none opacity-30 select-none overflow-hidden z-10">
        <div className="absolute w-[200%] h-full bg-repeat-x bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%2250%22><circle cx=%2230%22 cy=%2230%22 r=%2220%22 fill=%22%23ffffff%22 opacity=%220.1%22/><circle cx=%2260%22 cy=%2225%22 r=%2225%22 fill=%22%23ffffff%22 opacity=%220.1%22/></svg>')] animate-cloudDrift" />
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
                Leaving Tutorial Harbor
              </h3>
              <p className="text-sm text-[#ebd9b4] font-bold italic leading-relaxed">
                "The anchors are weighed and the canvas is full. Blackbeard watches from the lighthouse as you cast off into the unknown..."
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
              <span className="text-6xl mb-3 block filter drop-shadow-md">🪙</span>
              <h2 className="text-xs font-bold text-[#8c6b3e] uppercase tracking-[0.2em] mb-1 font-mono">
                Chapter 2
              </h2>
              <h1 className="text-3xl font-black text-[#5c4424] uppercase tracking-widest leading-none mb-4 font-serif">
                Merchant Isles
              </h1>
              <div className="w-16 h-0.5 bg-[#8c6b3e] mx-auto mb-4" />
              <p className="text-xs text-amber-950 font-extrabold uppercase tracking-wide leading-normal">
                📍 Destination reached. Auditing guilds and market logs await.
              </p>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Sailing Ship Layer (Auto-sailing left-to-right parallax) */}
      <div className="absolute inset-x-0 bottom-1/4 h-32 flex items-center justify-center z-10 pointer-events-none">
        
        {/* Parallax Wave back layer */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-[#0c2a45]/20 animate-waveParallaxBack pointer-events-none" />

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
          {/* Animated Water Spray Foam */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute bottom-1 -left-2 text-xl"
          >
            🌊
          </motion.div>

          <span className="text-8xl select-none">⛵</span>
          
          <span className="absolute -bottom-6 text-[10px] font-mono uppercase bg-slate-900/90 text-amber-500 border border-amber-500/40 px-2 py-0.5 rounded shadow-sm tracking-wider whitespace-nowrap">
            {activeShipName}
          </span>
        </motion.div>

        {/* Parallax Wave front layer */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-[#0b2137]/45 animate-waveParallaxFront pointer-events-none" />

      </div>

      {/* Footer bar */}
      <footer className="relative z-20 bg-[#07131f] border-t border-[#8c6b3e]/30 px-4 py-2 flex items-center justify-between text-[10px] text-[#ebd9b4]/50 font-mono">
        <span>SQL Quest Voyage Simulator</span>
        <span>Speed: 10 Knots | Heading: North-East</span>
      </footer>

    </div>
  );
}
