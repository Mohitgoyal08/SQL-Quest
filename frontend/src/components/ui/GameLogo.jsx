import React from 'react';
import { motion } from 'framer-motion';

export default function GameLogo({ title = "SQL QUEST", subtitle }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
      className="mb-6 sm:mb-8 text-center select-none pointer-events-none"
    >
      <h1 
        id="game-logo-title"
        className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-wider text-gold drop-shadow-[0_6px_12px_rgba(11,43,64,0.7)]"
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs sm:text-sm font-sans font-bold uppercase tracking-widest text-parchment-light opacity-90 mt-1 drop-shadow-md">
          {subtitle}
        </p>
      )}
    </motion.header>
  );
}