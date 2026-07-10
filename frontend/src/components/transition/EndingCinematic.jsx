import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioService } from '../../services/AudioService';

export default function EndingCinematic({ onComplete, playerName = "Captain" }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    AudioService.startOceanAmbience();
    const s1 = setTimeout(() => setStage(1), 3000); // Intro text
    const s2 = setTimeout(() => setStage(2), 9000); // Credits scroll
    const s3 = setTimeout(() => setStage(3), 20000); // Thanks for playing
    return () => { 
      AudioService.stopOceanAmbience();
      clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); 
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-serif select-none">
      
      {/* Golden Sunset Ocean Background */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#2a0e1b] via-[#8c2b18] to-[#d4af37]">
        {/* Sun */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 5, ease: "easeOut" }}
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-t from-[#ffd700] to-[#ff8c00] rounded-full blur-[2px] shadow-[0_0_100px_rgba(255,215,0,0.8)]"
        />
        
        {/* Sea Waves */}
        <motion.div 
          animate={{ x: [-50, 0, -50] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute bottom-0 left-[-10%] right-[-10%] h-1/3 bg-gradient-to-b from-[#0a1a2f] to-[#05101a] opacity-90 border-t-2 border-[#d4af37]/30"
          style={{ clipPath: 'polygon(0 10%, 10% 5%, 20% 10%, 30% 5%, 40% 10%, 50% 5%, 60% 10%, 70% 5%, 80% 10%, 90% 5%, 100% 10%, 100% 100%, 0% 100%)' }}
        />

        {/* Sailing Ship Silhouette */}
        <motion.div
          animate={{ x: ['-10vw', '110vw'] }}
          transition={{ duration: 45, ease: "linear" }}
          className="absolute bottom-[25%] left-0 text-7xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] opacity-80"
        >
          ⛵
        </motion.div>
        {/* Subtle stars / particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div 
            key={`star-${i}`}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ repeat: Infinity, duration: 2 + Math.random() * 3, delay: Math.random() * 2 }}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * window.innerHeight + 'px',
              left: Math.random() * window.innerWidth + 'px'
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Stage 1: Emotional Close */}
        {stage === 1 && (
          <motion.div
            key="stage1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 2 }}
            className="z-10 text-center max-w-2xl px-6"
          >
            <h2 className="text-3xl md:text-4xl text-[#fff0d4] mb-8 leading-relaxed italic drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] font-medium">
              "And so, {playerName} charted the uncharted..."
            </h2>
            <p className="text-xl text-[#fdf6e2]/80 drop-shadow-md">
              The queries were optimized, the joins were mastered, and the legacy of the Sloop would be remembered for a lifetime.
            </p>
          </motion.div>
        )}

        {/* Stage 2: Credits Scroll */}
        {stage === 2 && (
          <motion.div
            key="stage2"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: -200 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 15, ease: "linear" }}
            className="z-10 text-center flex flex-col gap-12"
          >
            <div>
              <h3 className="text-[#8c6b3e] uppercase tracking-[0.3em] text-sm mb-2 font-mono">Directed By</h3>
              <h2 className="text-[#ebd9b4] text-2xl font-black tracking-widest uppercase">The Captain</h2>
            </div>
            <div>
              <h3 className="text-[#8c6b3e] uppercase tracking-[0.3em] text-sm mb-2 font-mono">Lead Engineer</h3>
              <h2 className="text-[#ebd9b4] text-2xl font-black tracking-widest uppercase">SQL Master</h2>
            </div>
            <div>
              <h3 className="text-[#8c6b3e] uppercase tracking-[0.3em] text-sm mb-2 font-mono">Art & Design</h3>
              <h2 className="text-[#ebd9b4] text-2xl font-black tracking-widest uppercase">Framer Motion & Tailwind</h2>
            </div>
          </motion.div>
        )}

        {/* Stage 3: Thanks for playing */}
        {stage === 3 && (
          <motion.div
            key="stage3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
            className="z-10 text-center flex flex-col items-center"
          >
            <span className="text-6xl mb-6 filter drop-shadow-xl">🏴‍☠️</span>
            <h1 className="text-5xl md:text-7xl font-black text-[#d4af37] uppercase tracking-widest mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              SQL Quest
            </h1>
            <p className="text-xl text-[#ebd9b4] tracking-widest uppercase mb-12">
              Fin.
            </p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={onComplete}
              className="px-10 py-4 bg-gradient-to-b from-[#f59e0b] to-[#d97706] text-white border-4 border-[#92400e] font-black text-lg uppercase tracking-widest rounded-2xl transition-all shadow-[0_8px_0_#92400e,0_15px_20px_rgba(0,0,0,0.4)] hover:scale-105 active:translate-y-2 active:shadow-[0_0px_0_#92400e,0_5px_10px_rgba(0,0,0,0.4)] cursor-pointer"
              style={{ WebkitTextStroke: '1px #78350f' }}
            >
              <span className="drop-shadow-sm">Return to Title</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
