import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_DURATIONS } from '../../config/constants';

export default function SunRays({ opacity = "opacity-15" }) {
  return (
    <motion.div
      className={`absolute -top-1/4 left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] rounded-full pointer-events-none z-0 ${opacity}`}
      style={{
        background: 'conic-gradient(from 0deg at 50% 50%, rgba(255, 255, 255, 0.8) 0deg, transparent 30deg, rgba(255, 255, 255, 0.8) 60deg, transparent 90deg, rgba(255, 255, 255, 0.8) 120deg, transparent 150deg, rgba(255, 255, 255, 0.8) 180deg, transparent 210deg, rgba(255, 255, 255, 0.8) 240deg, transparent 270deg, rgba(255, 255, 255, 0.8) 300deg, transparent 330deg)',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: ANIMATION_DURATIONS.SUN_ROTATION, repeat: Infinity, ease: 'linear' }}
    />
  );
}