import React from 'react';
import { motion } from 'framer-motion';
import { BG_SUN_ROTATION_DURATION, BG_PARTICLE_COUNT } from '../../config/constants';

// Static configurations declared outside the component to prevent re-creation on render
const CLOUDS = [
  { id: 1, top: '8%', scale: 1.2, opacity: 0.85, duration: 45, delay: 0 },
  { id: 2, top: '22%', scale: 0.85, opacity: 0.6, duration: 60, delay: -15 },
  { id: 3, top: '14%', scale: 1.5, opacity: 0.9, duration: 50, delay: -30 },
];

const PARTICLES = Array.from({ length: BG_PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: `${(i * 18) % 92 + 4}%`,
  top: `${(i * 23) % 75 + 10}%`,
  size: (i % 3) + 3,
  duration: 3 + (i % 4),
  delay: (i % 3) * 0.8,
}));

export default function AnimatedBackground({ children }) {
  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-ocean-deep font-sans">
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep via-ocean to-ocean-shallow z-0" />
      
      {/* Sun Rays */}
      <motion.div
        className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] rounded-full opacity-15 pointer-events-none z-0"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, rgba(255, 255, 255, 0.8) 0deg, transparent 30deg, rgba(255, 255, 255, 0.8) 60deg, transparent 90deg, rgba(255, 255, 255, 0.8) 120deg, transparent 150deg, rgba(255, 255, 255, 0.8) 180deg, transparent 210deg, rgba(255, 255, 255, 0.8) 240deg, transparent 270deg, rgba(255, 255, 255, 0.8) 300deg, transparent 330deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: BG_SUN_ROTATION_DURATION, repeat: Infinity, ease: 'linear' }}
      />

      {/* Clouds */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {CLOUDS.map((cloud) => (
          <motion.div
            key={cloud.id}
            className="absolute -left-64 flex items-center"
            style={{ top: cloud.top, transform: `scale(${cloud.scale})` }}
            initial={{ x: '-10vw' }}
            animate={{ x: '110vw' }}
            transition={{
              duration: cloud.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: cloud.delay,
            }}
          >
            <div
              className="relative bg-white/90 backdrop-blur-xs rounded-full h-16 w-44 shadow-lg shadow-ocean-deep/10"
              style={{ opacity: cloud.opacity }}
            >
              <div className="absolute -top-8 left-6 w-16 h-16 bg-white/90 rounded-full" />
              <div className="absolute -top-12 left-16 w-20 h-20 bg-white/90 rounded-full" />
              <div className="absolute -top-6 right-6 w-14 h-14 bg-white/90 rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gold-shimmer shadow-[0_0_8px_rgba(255,240,153,0.8)]"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Ocean */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 pointer-events-none z-20 flex flex-col justify-end overflow-hidden">
        <motion.div
          className="absolute -bottom-10 -left-[10%] w-[120%] h-32 bg-ocean opacity-70 rounded-[100%_100%_0_0]"
          animate={{
            x: ['-2%', '2%', '-2%'],
            scaleY: [1, 1.08, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-12 -left-[10%] w-[120%] h-36 bg-ocean-shallow shadow-[0_-4px_20px_rgba(11,43,64,0.3)] rounded-[100%_100%_0_0]"
          animate={{
            x: ['2%', '-2%', '2%'],
            scaleY: [1, 1.05, 1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content Slot */}
      <main className="relative z-30 w-full h-full flex flex-col justify-between overflow-y-auto">
        {children}
      </main>
    </div>
  );
}