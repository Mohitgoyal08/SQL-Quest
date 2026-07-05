import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_DURATIONS } from '../../config/constants';

// Cloud definitions extracted to prevent re-renders, durations are added to base
const CLOUD_LAYERS = [
  { id: 1, top: '10%', scale: 1.3, opacity: 0.85, durationOffset: 0, delay: 0 },
  { id: 2, top: '25%', scale: 0.9, opacity: 0.6, durationOffset: 15, delay: -20 },
  { id: 3, top: '15%', scale: 1.6, opacity: 0.9, durationOffset: 5, delay: -40 },
  { id: 4, top: '35%', scale: 1.1, opacity: 0.7, durationOffset: 25, delay: -10 },
];

export default function DriftingClouds() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {CLOUD_LAYERS.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute -left-72 flex items-center"
          style={{ top: cloud.top, transform: `scale(${cloud.scale})` }}
          initial={{ x: '-15vw' }}
          animate={{ x: '115vw' }}
          transition={{
            duration: ANIMATION_DURATIONS.CLOUD_BASE + cloud.durationOffset,
            repeat: Infinity,
            ease: 'linear',
            delay: cloud.delay,
          }}
        >
          <div
            className="relative bg-white/90 backdrop-blur-xs rounded-full h-16 w-48 shadow-lg shadow-ocean-deep/15"
            style={{ opacity: cloud.opacity }}
          >
            <div className="absolute -top-8 left-6 w-16 h-16 bg-white/90 rounded-full" />
            <div className="absolute -top-12 left-16 w-20 h-20 bg-white/90 rounded-full" />
            <div className="absolute -top-6 right-6 w-14 h-14 bg-white/90 rounded-full" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}