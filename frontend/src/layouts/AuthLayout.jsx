import React from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import GameLogo from '../components/ui/GameLogo';

export default function AuthLayout({ children }) {
  return (
    <AnimatedBackground>
      {/* Primary Semantic Wrapper - Text selection enabled for downstream forms */}
      <main className="relative z-30 flex flex-col items-center justify-center min-h-screen w-full px-4 py-8 sm:px-6">
        
        {/* Reusable Game Branding */}
        <GameLogo
          title="SQL QUEST"
          subtitle="Recover the Lost Codex"
        />

        {/* Semantic Section with Accessible Labeling */}
        <motion.section
          aria-labelledby="game-logo-title"
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 22,
            duration: 0.55,
          }}
          className="relative w-full max-w-[480px] sm:max-w-[520px] bg-parchment-light rounded-3xl p-6 sm:p-8 md:p-10 border-4 border-pirate-leather shadow-[0_16px_36px_rgba(11,43,64,0.55)] overflow-hidden"
        >
          {/* Decorative Inner Border (Hidden from Screen Readers & Selection) */}
          <div 
            className="absolute inset-1.5 rounded-2xl border-2 border-pirate-leather/15 pointer-events-none select-none" 
            aria-hidden="true" 
          />

          {/* Decorative Pirate/Chest Rivet Details */}
          <div className="absolute top-3.5 left-3.5 w-2.5 h-2.5 rounded-full bg-pirate-leather/40 pointer-events-none select-none shadow-inner" aria-hidden="true" />
          <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-pirate-leather/40 pointer-events-none select-none shadow-inner" aria-hidden="true" />
          <div className="absolute bottom-3.5 left-3.5 w-2.5 h-2.5 rounded-full bg-pirate-leather/40 pointer-events-none select-none shadow-inner" aria-hidden="true" />
          <div className="absolute bottom-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-pirate-leather/40 pointer-events-none select-none shadow-inner" aria-hidden="true" />

          {/* Dynamic Route Content Slot */}
          <div className="relative z-10 font-sans text-pirate-charcoal">
            {children}
          </div>
        </motion.section>

      </main>
    </AnimatedBackground>
  );
}