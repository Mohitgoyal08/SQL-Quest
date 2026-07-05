import React from 'react';
import { motion } from 'framer-motion';
import SunRays from './SunRays';
import DriftingClouds from './DriftingClouds';
import FloatingParticles from './FloatingParticles';
import { ANIMATION_DURATIONS } from '../../config/constants';

export default function AnimatedBackground({ children }) {
  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-ocean-deep font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep via-ocean to-ocean-shallow z-0" />
      
      <SunRays opacity="opacity-15" />
      <DriftingClouds />
      <FloatingParticles />

      {/* Legacy Auth Ocean (Constrained to bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 pointer-events-none z-20 flex flex-col justify-end overflow-hidden">
        <motion.div
          className="absolute -bottom-10 -left-[10%] w-[120%] h-32 bg-ocean opacity-70 rounded-[100%_100%_0_0]"
          animate={{ x: ['-2%', '2%', '-2%'], scaleY: [1, 1.08, 1] }}
          transition={{ duration: ANIMATION_DURATIONS.WAVE_BACK, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-12 -left-[10%] w-[120%] h-36 bg-ocean-shallow shadow-[0_-4px_20px_rgba(11,43,64,0.3)] rounded-[100%_100%_0_0]"
          animate={{ x: ['2%', '-2%', '2%'], scaleY: [1, 1.05, 1] }}
          transition={{ duration: ANIMATION_DURATIONS.WAVE_FRONT, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <main className="relative z-30 w-full h-full flex flex-col justify-between overflow-y-auto">
        {children}
      </main>
    </div>
  );
}