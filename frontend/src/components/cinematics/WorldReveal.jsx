import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AudioService } from '../../services/AudioService';

export default function WorldReveal({ onComplete }) {
  // We'll simulate a 3.5s camera pan and a 2.5s ship travel.
  // We can just use a timeout of 6 seconds before calling onComplete.
  
  useEffect(() => {
    AudioService.startOceanAmbience();
    
    // Play a "success" or "reveal" chime halfway through when the path animates
    const audioTimer = setTimeout(() => {
      AudioService.playSuccess();
    }, 2000);

    const t = setTimeout(() => {
      onComplete();
    }, 6000);
    return () => {
      AudioService.stopOceanAmbience();
      clearTimeout(audioTimer);
      clearTimeout(t);
    };
  }, [onComplete]);

  // Map nodes representing the 8 islands
  const islands = [
    { id: 1, name: 'Tutorial Island', top: '70%', left: '15%', glowing: true },
    { id: 2, name: 'Forgotten Village', top: '45%', left: '25%', glowing: false },
    { id: 3, name: 'Jungle Island', top: '35%', left: '40%', glowing: false },
    { id: 4, name: 'Pirate Port', top: '55%', left: '50%', glowing: false },
    { id: 5, name: 'Royal Fortress', top: '40%', left: '65%', glowing: false },
    { id: 6, name: 'Volcano Island', top: '25%', left: '75%', glowing: false },
    { id: 7, name: 'Lost Sea', top: '65%', left: '80%', glowing: false },
    { id: 8, name: "Pirate King's Ship", top: '30%', left: '90%', glowing: false },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#0ea5e9] overflow-hidden select-none">
      {/* Container that we "pan" across */}
      <motion.div 
        initial={{ x: '-25%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 4, ease: 'easeInOut' }}
        className="relative w-[150%] h-full flex items-center justify-center bg-gradient-to-br from-[#38bdf8] to-[#0284c7]"
      >
        {/* Cartoon Water Texture */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 60%)', backgroundSize: '200px 150px' }} />
        
        {/* Dotted Route (Mocked via SVG) */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 2 }}
            d="M 15 70 Q 20 50 25 45 Q 30 40 40 35 Q 45 40 50 55 Q 60 55 65 40 Q 70 30 75 25 Q 80 40 80 65 Q 85 65 90 30" 
            fill="none" 
            stroke="white" 
            strokeWidth="4" 
            strokeDasharray="10 10" 
            strokeLinecap="round"
          />
        </svg>

        {/* Islands */}
        {islands.map((island) => (
          <div key={island.id} className="absolute flex flex-col items-center" style={{ top: island.top, left: island.left, transform: 'translate(-50%, -50%)' }}>
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: island.id * 0.1 }}
              className={`w-16 h-16 rounded-full border-4 shadow-xl flex items-center justify-center ${island.glowing ? 'bg-[#fef08a] border-[#eab308] shadow-[0_0_30px_rgba(234,179,8,1)]' : 'bg-slate-700 border-slate-900'}`}
            >
              {island.glowing ? (
                <span className="text-3xl">🌴</span>
              ) : (
                <span className="text-2xl opacity-50">🔒</span>
              )}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + island.id * 0.1 }}
              className="mt-2 bg-[#854d0e] border-2 border-[#422006] rounded-lg px-3 py-1 shadow-lg"
            >
              <span className="text-white font-black text-xs uppercase tracking-wider drop-shadow-md" style={{ WebkitTextStroke: '1px #422006' }}>
                {island.name}
              </span>
            </motion.div>
          </div>
        ))}

        {/* The Player's Ship animating along the first segment */}
        <motion.div
          initial={{ top: '100%', left: '-5%', opacity: 0 }}
          animate={{ top: '70%', left: '15%', opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 3.5, ease: 'easeOut' }}
          className="absolute text-5xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] z-20"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          ⛵
        </motion.div>
      </motion.div>
      
      {/* Cinematic Black Bars */}
      <div className="absolute top-0 left-0 w-full h-24 bg-black z-30" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-black z-30" />
    </div>
  );
}
