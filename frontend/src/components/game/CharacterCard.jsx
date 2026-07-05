import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CharacterCard({ character, isSelected, onSelect }) {
  const sparkles = [
    { id: 1, top: '10%', left: '15%', delay: 0 },
    { id: 2, top: '15%', right: '12%', delay: 0.2 },
    { id: 3, bottom: '20%', left: '10%', delay: 0.4 },
    { id: 4, bottom: '15%', right: '15%', delay: 0.1 },
  ];

  // Keyboard accessibility handler for Enter and Space keys
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(character.id);
    }
  };

  return (
    <motion.div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect(character.id)}
      onKeyDown={handleKeyDown}
      whileHover={{ y: -6 }}
      animate={isSelected ? { y: [0, -8, 0] } : { y: 0 }}
      transition={{
        y: isSelected 
          ? { duration: 0.4, type: 'spring', stiffness: 300, damping: 10 } 
          : { duration: 0.2 }
      }}
      className={`relative h-full cursor-pointer select-none rounded-3xl p-5 border-4 transition-colors duration-300 flex flex-col items-center justify-between text-center overflow-hidden focus:outline-none focus:ring-4 focus:ring-ocean/60 ${
        isSelected
          ? 'bg-parchment border-gold shadow-[0_0_25px_rgba(255,200,55,0.6)]'
          : 'bg-parchment-light border-pirate-leather/20 shadow-md hover:border-pirate-leather/40 hover:shadow-xl'
      }`}
    >
      {/* Framer Motion Sparkles (Visible only when selected) */}
      <AnimatePresence>
        {isSelected && sparkles.map((s) => (
          <motion.div
            key={s.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity, delay: s.delay }}
            style={{ top: s.top, left: s.left, right: s.right, bottom: s.bottom }}
            className="absolute w-3 h-3 bg-gold-shimmer rounded-full pointer-events-none shadow-[0_0_6px_rgba(255,240,153,1)]"
          />
        ))}
      </AnimatePresence>

      {/* Top Section: Badge & Portrait */}
      <div className="w-full flex flex-col items-center">
        {/* Collectible Badge Slot */}
        <div className="h-7 mb-2 flex items-center justify-center">
          <AnimatePresence>
            {isSelected && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="bg-gold text-pirate-charcoal font-display font-extrabold text-xs tracking-wider uppercase px-3 py-1 rounded-full border-2 border-pirate-charcoal shadow-sm flex items-center gap-1"
              >
                <span>⚓</span> Your Captain
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Clean Circular Portrait Placeholder */}
        <div
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full mb-4 flex flex-col items-center justify-center border-4 shadow-inner transition-colors ${
            isSelected
              ? 'bg-gold/20 border-gold'
              : 'bg-pirate-leather/10 border-pirate-leather/20'
          }`}
        >
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-pirate-leather/40 flex items-center justify-center mb-1">
            <span className="w-4 h-4 rounded-full bg-pirate-leather/30" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-pirate-leather/60">
            Portrait Slot
          </span>
        </div>

        {/* Hero Name */}
        <h3 className="text-lg sm:text-xl font-display font-extrabold text-pirate-charcoal tracking-wide mb-2">
          {character.name}
        </h3>
      </div>

      {/* Bottom Section: Narrative Description */}
      <p className="text-xs sm:text-sm font-sans font-medium text-pirate-leather leading-relaxed line-clamp-3">
        {character.description}
      </p>
    </motion.div>
  );
}