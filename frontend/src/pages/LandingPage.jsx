import React from 'react';
import LandingTransition from '../components/transition/LandingTransition';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AudioService } from '../services/AudioService';

export default function LandingPage({ onStart }) {
  const handleStart = () => {
    AudioService.init();
    AudioService.playClick();
    onStart();
  };

  const handlePracticeClick = () => {
    AudioService.init();
    AudioService.playClick();
    toast('Practice Mode Coming Soon (Version 1.1) ⚓', {
      icon: '🌊',
      style: {
        borderRadius: '10px',
        background: '#0ea5e9', // Ocean blue
        color: '#fff',
        fontWeight: 'bold',
      },
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center relative z-10 select-none overflow-hidden bg-[#38bdf8]">
      
      {/* Cinematic Background Layer for Landing - Bright Cartoon Sea */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#7dd3fc] to-[#38bdf8]" />
        
        {/* Cartoon Clouds */}
        <motion.div 
          animate={{ x: [0, 1000, 0] }}
          transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
          className="absolute top-10 left-[-20%] w-[150%] h-40 opacity-70"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 20%, transparent 60%)', backgroundSize: '150px 100px', backgroundRepeat: 'repeat-x' }}
        />
        
        {/* Ocean Gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#0284c7] to-[#0369a1]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center z-10 px-4 flex flex-col items-center max-w-4xl w-full"
      >
        {/* Chunky Wooden Title Box */}
        <div className="relative mb-16 inline-block">
           <motion.div 
             animate={{ y: [-3, 3, -3], rotate: [-1, 1, -1] }}
             transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
             className="bg-[#854d0e] border-4 border-[#422006] rounded-2xl py-6 px-12 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative overflow-hidden"
           >
             {/* Wood grain effect lines */}
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)' }} />
             
             <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-[#fef08a] tracking-widest uppercase font-display relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]" style={{ WebkitTextStroke: '2px #713f12' }}>
               SQL Quest
             </h1>
             <p className="text-xl sm:text-2xl font-bold text-white mt-2 drop-shadow-md">
               Find the Lost Codex
             </p>
           </motion.div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          {/* Story Mode Button */}
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-64 py-5 bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-white font-black text-xl md:text-2xl uppercase rounded-[20px] border-4 border-[#1e40af] shadow-[0_8px_0_#1e3a8a,0_15px_20px_rgba(0,0,0,0.4)] transition-transform flex items-center justify-center gap-3 active:translate-y-2 active:shadow-[0_0px_0_#1e3a8a,0_5px_10px_rgba(0,0,0,0.4)]"
          >
            <span className="text-3xl">📖</span>
            <span style={{ WebkitTextStroke: '1px #1e3a8a' }} className="drop-shadow-sm">Story Mode</span>
          </motion.button>

          {/* Practice Mode Button */}
          <motion.button
            onClick={handlePracticeClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-64 py-5 bg-gradient-to-b from-[#22c55e] to-[#16a34a] text-white font-black text-xl md:text-2xl uppercase rounded-[20px] border-4 border-[#14532d] shadow-[0_8px_0_#166534,0_15px_20px_rgba(0,0,0,0.4)] transition-transform flex items-center justify-center gap-3 active:translate-y-2 active:shadow-[0_0px_0_#166534,0_5px_10px_rgba(0,0,0,0.4)]"
          >
            <span className="text-3xl">⚔️</span>
            <span style={{ WebkitTextStroke: '1px #14532d' }} className="drop-shadow-sm">Practice Mode</span>
          </motion.button>
        </div>
      </motion.div>
      
      <LandingTransition isActive={false} duration={1.2} />
    </div>
  );
}