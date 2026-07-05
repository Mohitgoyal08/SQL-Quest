import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingTransition({ 
  isActive = false, 
  duration = 1.35 
}) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-auto select-none"
          initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
          animate={{
            backgroundColor: [
              'rgba(0, 0, 0, 0)',
              'rgba(0, 0, 0, 0.25)',
              'rgba(0, 0, 0, 0.55)',
              'rgba(0, 0, 0, 0.8)',
              'rgba(0, 0, 0, 1)'
            ]
          }}
          exit={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
          transition={{
            duration: duration,
            ease: 'easeInOut',
            times: [0, 0.25, 0.55, 0.8, 1]
          }}
        />
      )}
    </AnimatePresence>
  );
}