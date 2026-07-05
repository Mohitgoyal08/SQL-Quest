import React from 'react';
import { motion } from 'framer-motion';

export default function WorldCamera({ target = { x: 480, y: 980 }, duration = 4, children }) {
  // Translate world canvas in reverse to center the target coordinate on viewport
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[2400px] h-[1400px] pointer-events-auto"
        initial={false}
        animate={{
          x: `calc(50vw - ${target.x}px)`,
          y: `calc(50vh - ${target.y}px)`,
        }}
        transition={{
          duration: duration,
          ease: [0.4, 0.0, 0.2, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}