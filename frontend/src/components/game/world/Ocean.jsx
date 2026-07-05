import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_DURATIONS } from '../../../config/constants';

export default function Ocean() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean/60 to-transparent opacity-85" />

      <motion.div
        className="absolute -bottom-16 -left-[15%] w-[130%] h-48 bg-gradient-to-t from-ocean-deep to-ocean opacity-75 rounded-[100%_100%_0_0]"
        animate={{ x: ['-3%', '3%', '-3%'], scaleY: [1, 1.06, 1] }}
        transition={{ duration: ANIMATION_DURATIONS.WAVE_BACK, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute -bottom-20 -left-[15%] w-[130%] h-56 bg-gradient-to-t from-ocean-deep via-ocean to-ocean-shallow/80 shadow-[0_-8px_30px_rgba(11,43,64,0.4)] rounded-[100%_100%_0_0]"
        animate={{ x: ['3%', '-3%', '3%'], scaleY: [1, 1.04, 1] }}
        transition={{ duration: ANIMATION_DURATIONS.WAVE_FRONT, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}