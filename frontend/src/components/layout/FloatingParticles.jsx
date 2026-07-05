import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_DURATIONS, ATMOSPHERE_COUNTS } from '../../config/constants';

export default function FloatingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: ATMOSPHERE_COUNTS.PARTICLES }, (_, i) => ({
      id: i,
      left: `${(i * 17) % 94 + 3}%`,
      top: `${(i * 21) % 65 + 5}%`,
      size: (i % 3) + 2,
      duration: ANIMATION_DURATIONS.PARTICLE_BASE + (i % 4),
      delay: (i % 4) * 0.7,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gold-shimmer shadow-[0_0_6px_rgba(255,240,153,0.8)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.15, 0.7, 0.15],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}