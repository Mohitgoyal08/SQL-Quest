import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_DURATIONS } from '../../../config/constants';

export default function PlayerShip() {
  return (
    <motion.div
      className="relative z-30 w-24 h-24 flex items-center justify-center pointer-events-none select-none"
      animate={{ y: [-4, 6, -4], rotate: [-2.5, 2, -2.5] }}
      transition={{ duration: ANIMATION_DURATIONS.SHIP_BOB, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        className="absolute -bottom-2 w-16 h-3 bg-white/20 rounded-full blur-[1px]"
        animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: ANIMATION_DURATIONS.SHIP_BOB, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative w-16 h-14 flex flex-col items-center">
        {/* Pirate Flag with Neutral Placeholder instead of explicit Star */}
        <motion.div
          className="absolute -top-1 left-7 w-5 h-3 bg-pirate-crimson rounded-r-xs shadow-xs z-20 flex items-center justify-center"
          animate={{ scaleX: [1, 0.85, 1] }}
          transition={{ duration: ANIMATION_DURATIONS.FLAG_FLAP, repeat: Infinity, ease: 'easeInOut' }}
        >
           <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </motion.div>

        <div className="absolute top-1 w-1 h-9 bg-pirate-charcoal rounded-full z-10" />

        <div className="absolute top-2 w-11 h-7 bg-parchment rounded-t-sm rounded-b-md border border-pirate-leather/40 shadow-md z-10 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full border border-pirate-leather/30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-pirate-crimson rounded-full" />
          </div>
        </div>

        <div className="absolute bottom-1 w-16 h-5 bg-pirate-leather rounded-b-xl rounded-t-xs border-b-2 border-pirate-charcoal shadow-lg z-20 flex justify-around items-center px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gold/80" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold/80" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold/80" />
        </div>
      </div>
    </motion.div>
  );
}