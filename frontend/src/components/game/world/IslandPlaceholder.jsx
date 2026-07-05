import React from 'react';
import { motion } from 'framer-motion';

export default function IslandPlaceholder({
  id,
  name,
  icon,
  type = 'village',
  isLocked = true,
  onSelect,
}) {
  const renderSilhouette = () => {
    switch (type) {
      case 'village':
        return (
          <div className="relative w-48 h-36 flex items-end justify-center">
            <div className="w-16 h-20 bg-pirate-charcoal/80 rounded-t-xl mx-1" />
            <div className="w-20 h-24 bg-pirate-charcoal rounded-t-2xl z-10" />
            <div className="w-14 h-16 bg-pirate-charcoal/70 rounded-t-lg mx-1" />
          </div>
        );
      case 'jungle':
        return (
          <div className="relative w-52 h-40 flex items-end justify-center">
            <div className="absolute bottom-0 w-44 h-24 bg-emerald-900/80 rounded-[50%_50%_20%_20%]" />
            <div className="absolute bottom-10 -left-2 w-28 h-28 bg-emerald-950 rounded-full" />
            <div className="absolute bottom-12 right-0 w-32 h-32 bg-emerald-900 rounded-full" />
            <div className="absolute bottom-16 w-36 h-36 bg-pirate-charcoal rounded-full z-10" />
          </div>
        );
      case 'port':
        return (
          <div className="relative w-56 h-36 flex items-end justify-center">
            <div className="absolute bottom-0 w-48 h-12 bg-pirate-leather/80 rounded-t-md" />
            <div className="absolute bottom-12 left-10 w-2 h-24 bg-pirate-charcoal rotate-6" />
            <div className="absolute bottom-12 right-14 w-3 h-20 bg-pirate-charcoal -rotate-3" />
            <div className="absolute bottom-20 left-6 w-16 h-1 bg-pirate-charcoal rotate-12" />
          </div>
        );
      case 'fortress':
        return (
          <div className="relative w-52 h-44 flex items-end justify-center">
            <div className="w-14 h-32 bg-pirate-charcoal/90 rounded-t-xs border-t-8 border-dashed border-parchment/20" />
            <div className="w-22 h-40 bg-pirate-charcoal rounded-t-sm z-10 flex flex-col justify-between items-center py-2">
              <div className="w-16 h-4 border-t-6 border-dashed border-parchment/30" />
            </div>
            <div className="w-14 h-28 bg-pirate-charcoal/80 rounded-t-xs border-t-8 border-dashed border-parchment/20" />
          </div>
        );
      case 'volcano':
        return (
          <div className="relative w-56 h-44 flex items-end justify-center">
            <div className="w-48 h-40 bg-pirate-charcoal rounded-[40%_40%_10%_10%/80%_80%_10%_10%] relative overflow-hidden flex justify-center">
              <motion.div
                className="w-16 h-8 bg-pirate-crimson/80 rounded-full blur-md mt-2"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        );
      case 'whirlpool':
        return (
          <motion.div
            className="relative w-48 h-48 rounded-full border-8 border-dashed border-ocean-shallow/40 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-32 h-32 rounded-full border-6 border-dashed border-parchment/30" />
            <div className="absolute w-16 h-16 rounded-full bg-ocean-deep/80 border-4 border-ocean-shallow" />
          </motion.div>
        );
      case 'galleon':
        // Noticeably larger, massive silhouette for the final boss destination
        return (
          <div className="relative w-80 h-60 flex items-end justify-center scale-110 origin-bottom">
            <div className="absolute bottom-0 w-72 h-20 bg-pirate-charcoal rounded-b-3xl rounded-t-xs border-b-6 border-pirate-crimson/70 shadow-2xl" />
            <div className="absolute bottom-20 left-16 w-3.5 h-36 bg-pirate-charcoal" />
            <div className="absolute bottom-20 left-36 w-4 h-44 bg-pirate-charcoal" />
            <div className="absolute bottom-20 right-20 w-3 h-32 bg-pirate-charcoal" />
            {/* Towering Billowing Sails */}
            <div className="absolute bottom-32 left-32 w-24 h-24 bg-pirate-charcoal/95 rounded-r-3xl -rotate-6 border-r-2 border-pirate-crimson/40" />
            <div className="absolute bottom-24 left-12 w-18 h-18 bg-pirate-charcoal/90 rounded-r-2xl -rotate-3" />
          </div>
        );
      default:
        return <div className="w-40 h-32 bg-pirate-charcoal rounded-3xl" />;
    }
  };

  return (
    <motion.div
      onClick={() => onSelect?.(id)}
      whileHover={!isLocked ? { scale: 1.04, y: -4 } : {}}
      className={`relative flex flex-col items-center justify-center select-none ${
        isLocked ? 'cursor-not-allowed grayscale-[60%] opacity-85' : 'cursor-pointer'
      }`}
    >
      {/* 1. Mysterious Mysterious Fog & Soft Blue Ambient Glow (Locked Only) */}
      {isLocked && (
        <>
          {/* Soft Blue/Cyan Ambient Aura */}
          <motion.div
            className="absolute -inset-8 bg-sky-500/15 rounded-full blur-2xl pointer-events-none z-0"
            animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Drifting Mist Layer 1 */}
          <motion.div
            className="absolute -bottom-6 -left-12 w-64 h-16 bg-gradient-to-r from-transparent via-sky-200/20 to-transparent rounded-full blur-md pointer-events-none z-20"
            animate={{ x: [-15, 15, -15], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Drifting Mist Layer 2 */}
          <motion.div
            className="absolute -bottom-2 -right-10 w-56 h-12 bg-gradient-to-r from-transparent via-parchment/15 to-transparent rounded-full blur-md pointer-events-none z-20"
            animate={{ x: [12, -12, 12], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* 2. Floating Title Badge */}
      <motion.div
        animate={isLocked ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-10 z-30 px-3.5 py-1 bg-parchment border-2 border-pirate-leather rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap pointer-events-none"
      >
        <span className="text-xs">{icon}</span>
        <span className="font-display font-extrabold text-xs text-pirate-charcoal tracking-wider uppercase">
          {name}
        </span>
      </motion.div>

      {/* 3. Lock Rune Overlay */}
      {isLocked && (
        <motion.div
          className="absolute z-40 -top-16 w-9 h-9 rounded-full bg-pirate-charcoal border-2 border-gold shadow-[0_0_12px_rgba(255,200,55,0.5)] flex items-center justify-center text-gold font-bold text-sm pointer-events-none"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🔒
        </motion.div>
      )}

      {/* 4. Island Base Shoal Shadow */}
      <div className="absolute -bottom-4 w-64 h-24 bg-ocean-deep/60 rounded-[50%] blur-sm pointer-events-none z-0" />
      <div className="absolute -bottom-2 w-56 h-20 bg-parchment-dark/30 rounded-[50%] pointer-events-none z-0" />

      {/* 5. Core Silhouette Rendering */}
      <div className="relative z-10 pointer-events-none">
        {renderSilhouette()}
      </div>

      {/* 6. Future Anchor Scaffolding Slots */}
      <div data-slot="dock" data-island={id} className="absolute -bottom-6 right-6 w-8 h-8 pointer-events-none opacity-0" />
      <div data-slot="npc-anchor" data-island={id} className="absolute bottom-10 left-10 w-8 h-8 pointer-events-none opacity-0" />
      <div data-slot="mission-anchor" data-island={id} className="absolute -top-6 w-8 h-8 pointer-events-none opacity-0" />
    </motion.div>
  );
}