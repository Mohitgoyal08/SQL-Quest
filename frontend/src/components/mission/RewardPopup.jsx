import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import RewardBadge from './RewardBadge';
import { FEATURES } from '../../config/features';
import { AudioService } from '../../services/AudioService';

export default function MissionRewardPanel({ rewards = {}, onClaim }) {
  const { xp = 0, coins = 0, items = [], stars = 0, badges = [], gems = 0 } = rewards;

  useEffect(() => {
    AudioService.playSuccess();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 select-none overflow-y-auto overflow-x-hidden">
      
      {/* Background Burst Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={`reward-particle-${i}`}
            initial={{ opacity: 1, scale: 0, x: window.innerWidth / 2, y: window.innerHeight / 2 }}
            animate={{ 
              opacity: 0, 
              scale: Math.random() * 2 + 1, 
              x: window.innerWidth / 2 + (Math.random() * 800 - 400),
              y: window.innerHeight / 2 + (Math.random() * 800 - 400),
              rotate: Math.random() * 360
            }}
            transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
            className={`absolute w-4 h-4 rounded shadow-lg ${['bg-amber-400', 'bg-emerald-400', 'bg-white', 'bg-cyan-400'][i % 4]}`}
          />
        ))}
      </div>

      {/* Main Reward Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 max-w-lg w-full bg-[#fdf6e2] border-8 border-double border-[#8c6b3e] rounded-3xl p-8 text-center shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(circle, #fdf6e2 50%, #ebd9b4 100%)' }}
      >
        {/* Shimmer Sweep over card */}
        <motion.div 
          animate={{ x: ['-200%', '200%'] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 1 }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg] pointer-events-none"
        />

        <motion.span 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs font-bold uppercase tracking-[0.3em] text-[#8c6b3e] block mb-2"
        >
          Bounty Collected
        </motion.span>
        
        <motion.h2 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-3xl md:text-4xl font-black text-[#5c4424] mb-6 uppercase tracking-wider font-serif filter drop-shadow"
        >
          Mission Accomplished!
        </motion.h2>

        <div className="my-6 p-6 bg-[#ebd9b4]/50 border-2 border-dashed border-[#8c6b3e]/60 rounded-xl">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8c6b3e] mb-4">
            Spoils & Rewards
          </h3>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {xp > 0 && <RewardBadge icon="★" label={`+${xp} XP`} variant="xp" />}
            {FEATURES.ENABLE_ECONOMY && coins > 0 && <RewardBadge icon="🪙" label={`${coins} Gold`} variant="coins" />}
            {FEATURES.ENABLE_ECONOMY && gems > 0 && <RewardBadge icon="💎" label={`+${gems} Gems`} variant="gems" />}
            {stars > 0 && <RewardBadge icon="⭐" label={`${stars} Star${stars > 1 ? 's' : ''}`} variant="stars" />}
            {items.map((item, idx) => (
              <RewardBadge key={idx} icon="📦" label={item} variant="items" />
            ))}
            {badges.map((badge, idx) => (
              <RewardBadge key={idx} icon="🎖️" label={badge} variant="badges" />
            ))}
          </div>
        </div>

        {typeof onClaim === 'function' && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            type="button"
            onClick={() => {
              AudioService.playClick();
              onClaim();
            }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(4,120,87,0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full py-4 bg-gradient-to-b from-emerald-600 to-emerald-800 text-white font-black text-sm md:text-base uppercase tracking-[0.2em] rounded-xl border-2 border-emerald-400 shadow-xl transition-all cursor-pointer"
          >
            Continue Journey ⚓
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}