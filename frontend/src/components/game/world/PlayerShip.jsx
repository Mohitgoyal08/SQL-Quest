import React from 'react';
import { motion } from 'framer-motion';

export default function PlayerShip({ position, duration = 3.5 }) {
  return (
    /* Outer Motion Div: Handles exact world coordinate translation ONLY */
    <motion.div
      className="absolute top-0 left-0 z-50 pointer-events-none select-none"
      initial={false}
      animate={{ x: position.x, y: position.y }}
      transition={{
        duration: duration,
        ease: [0.4, 0.0, 0.2, 1],
      }}
    >
      {/* Inner Centering Wrapper: Applies the -50% center offset cleanly */}
      <div className="-translate-x-1/2 -translate-y-1/2">
        
        {/* Ship Bobbing Physics & Visual Hull */}
        <motion.div
          className="relative w-24 h-24 flex items-center justify-center"
          animate={{ y: [-4, 6, -4], rotate: [-2.5, 2, -2.5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Water Ripple Wake */}
          <motion.div
            className="absolute -bottom-2 w-16 h-3 bg-white/20 rounded-full blur-[1px]"
            animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Pirate Ship Vector Geometry */}
          <div className="relative w-16 h-14 flex flex-col items-center">
            {/* Flag */}
            <motion.div
              className="absolute -top-1 left-7 w-5 h-3 bg-pirate-crimson rounded-r-xs shadow-xs z-20 flex items-center justify-center"
              animate={{ scaleX: [1, 0.85, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </motion.div>

            {/* Mast */}
            <div className="absolute top-1 w-1 h-9 bg-pirate-charcoal rounded-full z-10" />

            {/* Sails */}
            <div className="absolute top-2 w-11 h-7 bg-parchment rounded-t-sm rounded-b-md border border-pirate-leather/40 shadow-md z-10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full border border-pirate-leather/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-pirate-crimson rounded-full" />
              </div>
            </div>

            {/* Hull */}
            <div className="absolute bottom-1 w-16 h-5 bg-pirate-leather rounded-b-xl rounded-t-xs border-b-2 border-pirate-charcoal shadow-lg z-20 flex justify-around items-center px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold/80" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}