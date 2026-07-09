import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OpeningStory({ onComplete }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Show the continue button after 4 seconds of story reading time
    const t = setTimeout(() => setShowButton(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="max-w-4xl px-8 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
          className="text-2xl sm:text-3xl md:text-4xl text-[#fef08a] font-serif italic leading-relaxed drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-8"
        >
          "The legendary SQL Codex has been shattered... its fragments scattered across the eight islands of the great sea."
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 3 }}
          className="text-xl sm:text-2xl text-white font-serif italic leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          "Only a true captain can restore it and bring balance to the data realm."
        </motion.p>
      </motion.div>

      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 1 }}
            className="absolute bottom-16"
          >
            <button
              onClick={onComplete}
              className="px-8 py-4 bg-gradient-to-b from-[#22c55e] to-[#16a34a] text-white font-black text-xl uppercase rounded-[20px] border-4 border-[#14532d] shadow-[0_8px_0_#166534,0_15px_20px_rgba(0,0,0,0.4)] transition-transform flex items-center justify-center hover:scale-105 hover:-translate-y-1 active:translate-y-2 active:shadow-[0_0px_0_#166534,0_5px_10px_rgba(0,0,0,0.4)]"
            >
              <span style={{ WebkitTextStroke: '1px #14532d' }} className="drop-shadow-sm">
                Begin the Journey
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
