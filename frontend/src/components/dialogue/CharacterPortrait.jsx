import React from 'react';
import { motion } from 'framer-motion';

export default function CharacterPortrait({ portrait, emotion }) {
  // Simple emoji mapper for placeholders to make them look more polished
  const portraitEmoji = {
    'Captain Blackbeard': '🧔🏻‍♂️',
    'Old Barnaby': '👴🏼',
    'Quincy': '🧮',
    'Marlowe': '💼',
    'Harbor Master': '⚓',
    'unknown': '👤'
  }[portrait] || '👤';

  return (
    <motion.div 
      animate={{ y: [0, -3, 0], scale: [1, 1.02, 1] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-gradient-to-b from-[#ebd9b4] to-[#dfcb9f] border-4 border-double border-[#5c4424] rounded-xl shadow-[inset_0_0_20px_rgba(92,68,36,0.3),_0_10px_20px_rgba(0,0,0,0.4)] select-none p-2 text-center relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent)] pointer-events-none rounded-lg" />
      <span className="text-4xl md:text-5xl mb-2 filter drop-shadow-md">
        {portraitEmoji}
      </span>
      <span className="text-[10px] font-black text-[#5c4424] leading-tight truncate w-full px-1 border-t border-[#8c6b3e]/30 pt-1">
        {portrait || 'unknown'}
      </span>
      <span className="text-[9px] text-[#8c6b3e] uppercase tracking-widest mt-0.5">
        ({emotion || 'neutral'})
      </span>
    </motion.div>
  );
}