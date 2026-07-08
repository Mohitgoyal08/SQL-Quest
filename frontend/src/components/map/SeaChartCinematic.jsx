import React from 'react';
import { motion } from 'framer-motion';

export default function SeaChartCinematic({ onComplete }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 select-none">
      <div className="flex flex-col items-center max-w-lg w-full">
        {/* Parchment Roll Unfolding */}
        <motion.div
          initial={{ scaleX: 0.01, scaleY: 0.1, opacity: 0, rotate: -5 }}
          animate={{ scaleX: 1, scaleY: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="relative w-full aspect-[4/3] bg-[#ebd9b4] border-8 border-double border-[#5c4424] rounded shadow-2xl p-6 flex flex-col items-center justify-center text-center overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(circle, #fdf6e2 40%, #ebd9b4 100%)',
            boxShadow: 'inset 0 0 40px rgba(92,68,36,0.3), 0 25px 50px -12px rgba(0,0,0,0.5)'
          }}
        >
          {/* Decorative scroll edges */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-[#2c1d10] to-[#5c4424] opacity-80 border-r border-[#ebd9b4]/20 shadow-lg" />
          <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-[#2c1d10] to-[#5c4424] opacity-80 border-l border-[#ebd9b4]/20 shadow-lg" />

          {/* Drifting ink visual effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-6xl mb-4 filter drop-shadow-md animate-pulse">🗺️</span>
            <h2 className="text-3xl font-black text-[#5c4424] uppercase tracking-widest leading-none mb-3 font-serif">
              The Sea Chart
            </h2>
            <div className="w-24 h-1 bg-[#8c6b3e] mb-4" />
            <p className="text-sm text-amber-950 font-semibold leading-relaxed max-w-sm italic">
              "An ancient, weathered sea chart mapping the unexplored bays and dangerous currents of the SQL Seas..."
            </p>
          </motion.div>

          {/* Cinematic sparkles */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(253,246,226,0.2)_0%,transparent_70%)]" />
        </motion.div>

        {/* Skip/Continue button below scroll */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          onClick={onComplete}
          className="mt-6 px-8 py-3 bg-[#8c6b3e] hover:bg-[#5c4424] text-[#fdf6e2] border-2 border-[#5c4424] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer hover:shadow-amber-900/30"
        >
          Unfurl Chart ➔
        </motion.button>
      </div>
    </div>
  );
}
