import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function IslandTitleCard({ title, onComplete }) {
  useEffect(() => {
    const t = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, letterSpacing: '0.1em' }}
        animate={{ opacity: 1, scale: 1, letterSpacing: '0.3em' }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 3, ease: 'easeOut' }}
        className="text-center"
      >
        <span className="text-amber-500 font-bold uppercase tracking-[0.5em] text-sm md:text-base block mb-4 drop-shadow-md">
          Arriving At
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-[#fdf6e2] uppercase font-serif drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          {title}
        </h1>
        {/* Subtle gold line sweep */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          className="h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-6 w-3/4 mx-auto origin-center"
        />
      </motion.div>
    </div>
  );
}
