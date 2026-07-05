import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DockingPrompt({ isVisible, islandName = 'Tutorial Island', onConfirm }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 24 }}
          className="absolute z-50 flex flex-col items-center pointer-events-auto select-none"
        >
          {/* Subtle Golden Dock Glow Aura */}
          <motion.div
            className="absolute -inset-4 rounded-full bg-gold-shimmer/30 blur-md pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Chunky Parchment Prompt Badge */}
          <motion.button
            type="button"
            onClick={onConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="relative px-5 py-2.5 bg-parchment border-3 border-pirate-leather rounded-2xl shadow-[0_8px_20px_rgba(11,43,64,0.6)] flex items-center gap-3 cursor-pointer"
          >
            {/* Animated Key Indicator */}
            <span className="px-2 py-0.5 bg-pirate-charcoal text-gold font-mono font-extrabold text-xs rounded-md shadow-inner uppercase tracking-wider">
              ENTER
            </span>
            <span className="font-display font-extrabold text-sm text-pirate-charcoal tracking-wide">
              Begin Adventure
            </span>
          </motion.button>
          
          {/* Anchor Pointer Triangle */}
          <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-pirate-leather -mt-0.5" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}