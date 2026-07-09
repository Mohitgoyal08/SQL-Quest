import React from 'react';
import { motion } from 'framer-motion';

// Static deterministic animation rules placed outside the component
const PALM_ANIMATIONS = [
  { id: 1, rotate: [-3, 4, -3], duration: 4.2, delay: 0 },
  { id: 2, rotate: [2, -3, 2], duration: 5.0, delay: 0.5 },
  { id: 3, rotate: [-2, 5, -2], duration: 4.6, delay: 1.1 },
];

export default function TutorialIsland({
  isLocked = false,
  isCurrent = true,
  isCompleted = false,
  onSelect,
}) {
  return (
    <motion.div
      onClick={onSelect}
      whileHover={!isLocked ? { scale: 1.03, y: -4 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative w-84 h-84 sm:w-96 sm:h-96 flex flex-col items-center justify-center select-none ${
        !isLocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
      }`}
    >
      {/* 0. AMBIENT WATER BASE */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 w-4/5 h-1/4 bg-sky-400/20 rounded-[100%] blur-xl pointer-events-none" 
      />
      
      {/* 0.5 AMBIENT BIRDS */}
      <motion.div 
        animate={{ x: [-20, 100], y: [0, -10, 0, 10, 0] }}
        transition={{ x: { repeat: Infinity, duration: 15, ease: "linear" }, y: { repeat: Infinity, duration: 5, ease: "easeInOut" } }}
        className="absolute top-10 left-10 pointer-events-none opacity-40 z-10"
      >
        <span className="text-[10px]">🐦</span>
      </motion.div>
      <motion.div 
        animate={{ x: [-50, 120], y: [10, -5, 5, -10, 0] }}
        transition={{ x: { repeat: Infinity, duration: 20, ease: "linear", delay: 2 }, y: { repeat: Infinity, duration: 7, ease: "easeInOut" } }}
        className="absolute top-16 left-0 pointer-events-none opacity-30 z-10"
      >
        <span className="text-[8px]">🐦</span>
      </motion.div>
      {/* 1. FLOATING ISLAND TITLE (Above the island) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute -top-12 z-40 px-4 py-1.5 bg-parchment border-2 border-pirate-leather rounded-full shadow-lg flex items-center gap-2 pointer-events-none"
      >
        <span className="text-sm">🏝️</span>
        <span className="font-display font-extrabold text-xs sm:text-sm text-pirate-charcoal tracking-wider uppercase">
          Tutorial Island
        </span>
      </motion.div>

      {/* 2. ACTIVE ISLAND GLOW (isCurrent State Only) */}
      {isCurrent && !isLocked && (
        <motion.div
          className="absolute inset-4 rounded-full bg-gold-shimmer/30 border-4 border-gold/60 blur-md pointer-events-none"
          animate={{
            scale: [0.96, 1.06, 0.96],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* 3. ISLAND BASE & SHORELINE */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center pointer-events-none">
        
        {/* Deep Shoal & Sandy Beach Layer */}
        <div className="absolute inset-2 bg-parchment-dark rounded-[48%_52%_50%_50%/50%_45%_55%_50%] shadow-[0_16px_32px_rgba(11,43,64,0.6)] border-b-8 border-pirate-leather" />
        <div className="absolute inset-4 bg-parchment rounded-[50%_50%_46%_54%/54%_50%_50%_46%]" />

        {/* Lush Tropical Grass Layer */}
        <div className="absolute inset-8 bg-emerald-600 rounded-[48%_52%_55%_45%/52%_48%_45%_55%] shadow-inner border-b-6 border-emerald-800" />
        <div className="absolute inset-11 bg-emerald-500 rounded-[50%_50%_48%_52%/52%_50%_50%_48%]" />

        {/* 4. ENVIRONMENTAL RICHNESS: ROCKS & BUSHES */}
        <div className="absolute bottom-14 left-10 w-9 h-6 bg-pirate-charcoal/80 rounded-full border-b-2 border-pirate-charcoal shadow-md" />
        <div className="absolute bottom-16 left-17 w-6 h-5 bg-pirate-charcoal/60 rounded-full" />
        <div className="absolute top-18 right-14 w-7 h-5 bg-pirate-charcoal/70 rounded-full" />

        <div className="absolute top-20 left-14 w-12 h-9 bg-emerald-700 rounded-full shadow-sm" />
        <div className="absolute bottom-20 right-14 w-14 h-10 bg-emerald-700 rounded-full shadow-sm" />
        <div className="absolute bottom-24 right-22 w-10 h-8 bg-emerald-600 rounded-full" />

        {/* 5. THREE GENTLY ANIMATED PALM TREES */}
        {PALM_ANIMATIONS.map((palm, index) => {
          const positions = [
            'top-12 left-16',
            'top-14 right-20',
            'bottom-18 left-20',
          ];
          return (
            <motion.div
              key={palm.id}
              className={`absolute ${positions[index]} flex flex-col items-center origin-bottom z-20`}
              animate={{ rotate: palm.rotate }}
              transition={{
                duration: palm.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: palm.delay,
              }}
            >
              <div className="relative z-10 -mb-2">
                <div className="absolute -left-7 -top-2 w-9 h-3.5 bg-emerald-700 rounded-full -rotate-30 shadow-xs" />
                <div className="absolute -right-7 -top-2 w-9 h-3.5 bg-emerald-600 rounded-full rotate-30 shadow-xs" />
                <div className="absolute -top-7 -left-2.5 w-3.5 h-9 bg-emerald-500 rounded-full -rotate-12" />
              </div>
              <div className="w-3 h-14 bg-pirate-leather rounded-sm border-r-2 border-pirate-charcoal/50 rotate-3" />
            </motion.div>
          );
        })}

        {/* 6. VISUAL FOCAL POINT: ENLARGED PIRATE HUT */}
        <div className="absolute top-20 flex flex-col items-center z-20">
          
          {/* ANIMATED FLOATING GOLD STAR MISSION MARKER */}
          {!isLocked && !isCompleted && (
            <motion.div
              className="relative -top-3 z-30 flex flex-col items-center"
              animate={{
                y: [-3, 4, -3],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 2.0,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gold border-2 border-pirate-charcoal shadow-[0_0_15px_rgba(255,200,55,0.8)] flex items-center justify-center text-lg text-pirate-charcoal">
                ★
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-sm mt-0.5" />
            </motion.div>
          )}

          {/* Hut Roof */}
          <div className="w-24 h-12 bg-pirate-crimson rounded-t-2xl border-b-4 border-pirate-charcoal shadow-lg flex justify-center items-center relative">
            <div className="w-5 h-5 rounded-full bg-gold border-2 border-pirate-charcoal flex items-center justify-center">
              <div className="w-2 h-2 bg-pirate-charcoal rounded-full" />
            </div>
          </div>

          {/* Hut Base Structure */}
          <div className="w-18 h-14 bg-parchment border-x-4 border-b-4 border-pirate-leather flex justify-center items-end pb-1 shadow-inner rounded-b-md">
            <div className="w-6 h-9 bg-pirate-leather rounded-t-md border-x border-t border-pirate-charcoal flex items-center justify-end px-1">
              <div className="w-1 h-1 rounded-full bg-gold" />
            </div>
          </div>
        </div>

        {/* 7. WOODEN SIGN POST */}
        <div className="absolute bottom-16 right-24 flex flex-col items-center z-20">
          <div className="px-2.5 py-1 bg-pirate-leather border-2 border-pirate-charcoal rounded-md shadow-md text-[9px] font-display font-extrabold text-parchment tracking-wider uppercase text-center">
            Tutorial
          </div>
          <div className="w-2 h-5 bg-pirate-charcoal" />
        </div>

        {/* 8. VERTICAL WOODEN DOCK (Extending straight down toward the ocean) */}
        <div className="absolute -bottom-4 right-14 w-14 h-20 bg-pirate-leather border-2 border-pirate-charcoal rounded-sm shadow-xl flex flex-col justify-around py-1.5 px-2 origin-top">
          <div className="w-full h-0.5 bg-pirate-charcoal/40" />
          <div className="w-full h-0.5 bg-pirate-charcoal/40" />
          <div className="w-full h-0.5 bg-pirate-charcoal/40" />
          <div className="w-full h-0.5 bg-pirate-charcoal/40" />
        </div>

        {/* 9. NPC ANCHOR POINT SCAFFOLDING */}
        <div 
          data-slot="npc-anchor" 
          data-island="tutorial"
          className="absolute bottom-26 left-28 w-8 h-8 rounded-full pointer-events-none" 
        />

      </div>
    </motion.div>
  );
}