import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorldManager } from '../../../systems/WorldManager';
import { AudioService } from '../../../services/AudioService';
import { QuestManager } from '../../../systems/QuestManager';

const PirateShipSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg select-none">
    {/* Main Mast */}
    <rect x="47" y="15" width="5" height="52" fill="#451a03" rx="1.5" />
    
    {/* Red/White Striped Sails */}
    {/* Sail 1 (Upper) */}
    <path d="M 28,18 C 36,16 60,16 68,18 C 64,32 58,32 28,32 Z" fill="#dc2626" />
    <path d="M 36,17.5 C 40,22 40,28 36,31.5" fill="#ffffff" />
    <path d="M 52,17.5 C 56,22 56,28 52,31.5" fill="#ffffff" />
    
    {/* Sail 2 (Lower/Larger) */}
    <path d="M 18,34 C 32,31 66,31 80,34 C 75,51 68,51 18,51 Z" fill="#dc2626" />
    <path d="M 28,33.5 C 33,40 33,47 28,50.5" fill="#ffffff" />
    <path d="M 48,33.5 C 53,40 53,47 48,50.5" fill="#ffffff" />
    <path d="M 68,33.5 C 73,40 73,47 68,50.5" fill="#ffffff" />

    {/* Pirate Flag */}
    <path d="M 48,7 L 32,11 L 48,15 Z" fill="#0f172a" />
    <circle cx="41" cy="11" r="2.2" fill="#ffffff" />
    <line x1="38" y1="9.5" x2="44" y2="12.5" stroke="#ffffff" strokeWidth="0.8" />
    <line x1="44" y1="9.5" x2="38" y2="12.5" stroke="#ffffff" strokeWidth="0.8" />

    {/* Bowsprit (Front pole) */}
    <polygon points="76,60 90,56 76,54" fill="#854d0e" />

    {/* Wooden Hull (Body) */}
    <path d="M 14,50 C 24,50 76,50 86,46 C 82,64 72,67 19,67 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
    
    {/* Gold trim along hull */}
    <path d="M 14,50 C 24,50 76,50 86,46" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
    
    {/* Gunports / Cannons */}
    <circle cx="31" cy="58" r="3.2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
    <circle cx="47" cy="58" r="3.2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
    <circle cx="63" cy="58" r="3.2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />

    {/* Cabin (Back deck structure) */}
    <rect x="16" y="40" width="18" height="11" fill="#451a03" rx="1.5" />
    <rect x="19" y="43" width="4.5" height="5.5" fill="#fef08a" rx="1" />
    <rect x="26" y="43" width="4.5" height="5.5" fill="#fef08a" rx="1" />

    {/* Glowing Stern Lantern */}
    <circle cx="12" cy="38" r="2.8" fill="#fbbf24" className="animate-pulse" />
    <path d="M 12,38 L 16,41" stroke="#fbbf24" strokeWidth="0.8" />
  </svg>
);

// Use same percentages as WorldReveal for consistency
const ISLANDS_MANIFEST = [
  { id: 'tutorial_island', name: 'Tutorial Harbor', top: '70%', left: '15%', glowing: true, icon: '⚓' },
  { id: 'merchant_isles', name: 'Merchant Isles', top: '45%', left: '25%', glowing: false, icon: '🪙' },
  { id: 'smugglers_cove', name: "Smuggler's Cove", top: '35%', left: '40%', glowing: false, icon: '☠️' },
  { id: 'jungle_queries', name: 'Jungle of Queries', top: '55%', left: '50%', glowing: false, icon: '🌴' },
  { id: 'crystal_caverns', name: 'Crystal Caverns', top: '40%', left: '65%', glowing: false, icon: '🔮' },
  { id: 'volcano_island', name: 'Volcano Island', top: '25%', left: '75%', glowing: false, icon: '🌋' },
  { id: 'lost_sea', name: 'Lost Sea', top: '65%', left: '80%', glowing: false, icon: '🌊' },
  { id: 'pirate_kings_ship', name: "Pirate King's Ship", top: '30%', left: '90%', glowing: false, icon: '👑' },
];

export default function SeaWorld({ progress, onTravelTo }) {
  const currentIslandId = WorldManager.getWorldState(progress).currentIsland;
  const currentIsland = ISLANDS_MANIFEST.find(is => is.id === currentIslandId) || ISLANDS_MANIFEST[0];

  // Camera & Sailing state
  const [camera, setCamera] = useState({ scale: 1, x: 0, y: 0 });
  const [shipState, setShipState] = useState({
    top: currentIsland.top,
    left: currentIsland.left,
    rotation: 0,
    isSailing: false
  });
  const [activeVoyageDest, setActiveVoyageDest] = useState(null);
  const [ambientEvent, setAmbientEvent] = useState(null);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    AudioService.startOceanAmbience();
    
    // Sparkles initialization
    const points = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 70,
      delay: Math.random() * 5
    }));
    setSparkles(points);

    return () => AudioService.stopOceanAmbience();
  }, []);

  // Sync ship position if current location shifts
  useEffect(() => {
    if (!shipState.isSailing) {
      const target = ISLANDS_MANIFEST.find(is => is.id === currentIslandId) || ISLANDS_MANIFEST[0];
      setShipState(prev => ({
        ...prev,
        top: target.top,
        left: target.left,
        rotation: 0
      }));
    }
  }, [currentIslandId, shipState.isSailing]);

  // Ambient Life Spawner
  useEffect(() => {
    const triggerEvent = () => {
      const list = ['whale', 'dolphins', 'birds', 'merchant', 'wave', 'sparkles'];
      const pick = list[Math.floor(Math.random() * list.length)];
      setAmbientEvent({
        type: pick,
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 70,
        id: Date.now()
      });

      // Reset after 8 seconds
      setTimeout(() => setAmbientEvent(null), 8000);

      const delay = 20000 + Math.random() * 20000; // 20-40 seconds
      timer = setTimeout(triggerEvent, delay);
    };

    let timer = setTimeout(triggerEvent, 20000);
    return () => clearTimeout(timer);
  }, []);

  const handleIslandClick = (island) => {
    const isUnlocked = WorldManager.isIslandUnlocked(island.id, progress);
    if (!isUnlocked || shipState.isSailing) return;

    AudioService.playClick();

    if (island.id === currentIslandId) {
      // Direct zoom focus
      setCamera({
        scale: 1.35,
        x: 50 - parseFloat(island.left),
        y: 50 - parseFloat(island.top)
      });
      setTimeout(() => {
        onTravelTo(island.id);
      }, 700);
      return;
    }

    // Zoom focus destination
    setCamera({
      scale: 1.35,
      x: 50 - parseFloat(island.left),
      y: 50 - parseFloat(island.top)
    });

    setActiveVoyageDest(island);
  };

  const executeVoyage = () => {
    if (!activeVoyageDest) return;
    const dest = activeVoyageDest;
    setActiveVoyageDest(null);

    // Zoom out first before sailing
    setCamera({ scale: 1, x: 0, y: 0 });

    const startX = parseFloat(shipState.left);
    const startY = parseFloat(shipState.top);
    const endX = parseFloat(dest.left);
    const endY = parseFloat(dest.top);
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    setTimeout(() => {
      setShipState(prev => ({
        ...prev,
        rotation: angle,
        isSailing: true
      }));

      // Sail coordinates transition
      setTimeout(() => {
        setShipState(prev => ({
          ...prev,
          left: dest.left,
          top: dest.top
        }));

        // Voyage completes
        setTimeout(() => {
          setShipState(prev => ({
            ...prev,
            isSailing: false,
            rotation: 0
          }));
          // Zoom focus on arrival
          setCamera({
            scale: 1.35,
            x: 50 - parseFloat(dest.left),
            y: 50 - parseFloat(dest.top)
          });
          setTimeout(() => {
            onTravelTo(dest.id);
          }, 900);
        }, 3000);
      }, 100);
    }, 500);
  };

  const cancelVoyage = () => {
    setActiveVoyageDest(null);
    setCamera({ scale: 1, x: 0, y: 0 });
  };

  const cartoonTextShadow = {
    textShadow: '2px 2px 0px #1e293b, -1px -1px 0px #1e293b, 1px -1px 0px #1e293b, -1px 1px 0px #1e293b'
  };

  return (
    <div className="flex-1 relative bg-gradient-to-b from-[#38bdf8] via-[#0ea5e9] to-[#059669] overflow-hidden select-none w-full h-full">
      
      {/* 3D Sun Rays Atmosphere */}
      <div 
        className="absolute top-0 right-0 w-[80%] h-[80%] pointer-events-none opacity-25 z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 60%)',
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
        }}
      />

      {/* Floating Ambient Clouds */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20">
        <motion.div
          animate={{ x: [-200, window.innerWidth + 200] }}
          transition={{ repeat: Infinity, duration: 110, ease: "linear" }}
          className="absolute text-7xl opacity-30 filter blur-[1px]"
          style={{ top: '8%' }}
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [window.innerWidth + 200, -200] }}
          transition={{ repeat: Infinity, duration: 140, ease: "linear" }}
          className="absolute text-[90px] opacity-25 filter blur-[2px]"
          style={{ top: '30%' }}
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [-250, window.innerWidth + 250] }}
          transition={{ repeat: Infinity, duration: 125, ease: "linear", delay: 15 }}
          className="absolute text-[110px] opacity-20 filter blur-[3px]"
          style={{ top: '65%' }}
        >
          ☁️
        </motion.div>
      </div>

      {/* Sparkles Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {sparkles.map((sp) => (
          <motion.span
            key={sp.id}
            animate={{ opacity: [0, 0.9, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 4, delay: sp.delay, ease: "easeInOut" }}
            className="absolute text-[11px] text-yellow-100"
            style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
          >
            ✨
          </motion.span>
        ))}
      </div>

      {/* Ambient Life Events Overlay */}
      <AnimatePresence>
        {ambientEvent?.type === 'whale' && (
          <motion.div
            key={ambientEvent.id}
            initial={{ scale: 0, opacity: 0, y: 30 }}
            animate={{ scale: [0, 1.2, 1, 0], opacity: [0, 0.9, 0.8, 0], y: [30, -5, 0, 20] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 7, ease: "easeInOut" }}
            className="absolute text-5xl pointer-events-none z-10 select-none filter drop-shadow-lg"
            style={{ left: `${ambientEvent.x}%`, top: `${ambientEvent.y}%` }}
          >
            🐋
          </motion.div>
        )}
        {ambientEvent?.type === 'dolphins' && (
          <motion.div
            key={ambientEvent.id}
            initial={{ x: -60, y: 40, rotate: -25, opacity: 0 }}
            animate={{
              x: [0, 70, 140],
              y: [40, -30, 40],
              rotate: [-25, 0, 25],
              opacity: [0, 0.9, 0.9, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4.5, ease: "easeOut" }}
            className="absolute text-4xl pointer-events-none z-10 select-none"
            style={{ left: `${ambientEvent.x}%`, top: `${ambientEvent.y}%` }}
          >
            🐬🐬
          </motion.div>
        )}
        {ambientEvent?.type === 'birds' && (
          <motion.div
            key={ambientEvent.id}
            initial={{ x: -100, y: -50, opacity: 0 }}
            animate={{ x: window.innerWidth + 100, y: 60, opacity: [0, 0.8, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 11, ease: "linear" }}
            className="absolute text-sm pointer-events-none z-20 flex gap-5 select-none"
            style={{ top: `${ambientEvent.y}%` }}
          >
            <span>🕊️</span>
            <span className="mt-5">🕊️</span>
            <span className="mt-3">🕊️</span>
          </motion.div>
        )}
        {ambientEvent?.type === 'merchant' && (
          <motion.div
            key={ambientEvent.id}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: window.innerWidth + 100, opacity: [0, 0.45, 0.45, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 26, ease: "linear" }}
            className="absolute text-4xl pointer-events-none opacity-50 z-10 select-none grayscale"
            style={{ top: `${ambientEvent.y}%` }}
          >
            ⛵
          </motion.div>
        )}
        {ambientEvent?.type === 'wave' && (
          <motion.div
            key={ambientEvent.id}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: [0, 0.15, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 9, ease: "linear" }}
            className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-10 select-none"
          />
        )}
        {ambientEvent?.type === 'sparkles' && (
          <motion.div
            key={ambientEvent.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0.6, 1.3, 0.6], opacity: [0, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.5 }}
            className="absolute text-2xl pointer-events-none z-10 flex gap-2 select-none"
            style={{ left: `${ambientEvent.x}%`, top: `${ambientEvent.y}%` }}
          >
            ✨✨✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Map Interactive Camera Container */}
      <motion.div 
        animate={{
          scale: camera.scale,
          x: camera.x * camera.scale + '%',
          y: camera.y * camera.scale + '%'
        }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
        className="absolute inset-0 w-full h-full"
      >
        
        {/* Wave Layers */}
        <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
          <motion.div
            animate={{ x: [-150, 150] }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            className="absolute w-[200%] h-full bg-repeat-x"
            style={{
              backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'20\' viewBox=\'0 0 60 20\'><path d=\'M 0 10 Q 15 5, 30 10 T 60 10\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'2\'/></svg>")',
              top: '12%'
            }}
          />
          <motion.div
            animate={{ x: [150, -150] }}
            transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
            className="absolute w-[200%] h-full bg-repeat-x"
            style={{
              backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'25\' viewBox=\'0 0 80 25\'><path d=\'M 0 12 Q 20 6, 40 12 T 80 12\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'2\'/></svg>")',
              top: '52%'
            }}
          />
        </div>

        {/* Dotted Voyage Route Line */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))' }}>
          <path 
            d="M 15 70 Q 20 50 25 45 Q 30 40 40 35 Q 45 40 50 55 Q 60 55 65 40 Q 70 30 75 25 Q 80 40 80 65 Q 85 65 90 30" 
            fill="none" 
            stroke="rgba(251, 191, 36, 0.5)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
            strokeLinecap="round"
          />
        </svg>

        {/* Standalone Sailing Ship */}
        {progress.unlocks?.ship && (
          <motion.div
            animate={{
              top: shipState.top,
              left: shipState.left,
              rotate: shipState.rotation
            }}
            transition={{
              top: { duration: 3, ease: "easeInOut" },
              left: { duration: 3, ease: "easeInOut" },
              rotate: { duration: 0.4 }
            }}
            className="absolute w-16 h-16 z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
          >
            {/* Water ripples under ship */}
            <span className="absolute w-20 h-20 bg-white/30 rounded-full animate-ping opacity-60 pointer-events-none" />
            <span className="absolute w-16 h-16 bg-white/40 rounded-full animate-pulse opacity-45 pointer-events-none" style={{ animationDuration: '1.5s' }} />
            
            {/* Ship shadow */}
            <div className="absolute w-14 h-8 bg-black/45 rounded-full blur-[4px] translate-y-8 rotate-[15deg] pointer-events-none" />
            
            {/* Custom SVG Pirate Ship */}
            <div className="w-16 h-16 pointer-events-none transform hover:scale-110 transition-transform">
              <PirateShipSVG />
            </div>

            {/* Bubble Wake Trail */}
            {shipState.isSailing && (
              <div className="absolute -left-9 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-white/60 animate-ping opacity-70" style={{ animationDelay: '0.1s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-ping opacity-60" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-white/40 animate-ping opacity-50" style={{ animationDelay: '0.3s' }} />
              </div>
            )}
          </motion.div>
        )}

        {/* Islands Manifest List */}
        {ISLANDS_MANIFEST.map((island, index) => {
          const isUnlocked = WorldManager.isIslandUnlocked(island.id, progress);
          const isCurrentLocation = island.id === currentIslandId;

          // Unique floating animation delays per island
          const floatDelay = index * 0.4;
          const floatDuration = 4 + (index % 3) * 0.8;

          return (
            <motion.div 
              key={island.id} 
              className={`absolute flex flex-col items-center z-20 ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`} 
              style={{ top: island.top, left: island.left, transform: 'translate(-50%, -50%)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: [-3, 3, -3]
              }}
              transition={{ 
                scale: { duration: 0.5 },
                opacity: { duration: 0.5 },
                y: { repeat: Infinity, duration: floatDuration, delay: floatDelay, ease: "easeInOut" }
              }}
              onClick={() => handleIslandClick(island)}
            >
              {/* Island Button Outer */}
              <div 
                className={`
                  relative flex items-center justify-center rounded-3xl
                  w-16 h-16 md:w-20 md:h-20 text-3xl md:text-4xl shadow-xl transition-all duration-200
                  ${isUnlocked ? 'hover:scale-105 active:scale-95 border-4 border-[#78350f] hover:border-yellow-900' : 'opacity-50 grayscale border-4 border-slate-700'}
                  ${isCurrentLocation ? 'bg-gradient-to-b from-[#a7f3d0] to-[#059669] shadow-[0_6px_0_#022c22,0_12px_15px_rgba(0,0,0,0.3)]' : (isUnlocked ? 'bg-gradient-to-b from-[#fef08a] to-[#f59e0b] shadow-[0_6px_0_#451a03,0_12px_15px_rgba(0,0,0,0.3)]' : 'bg-gradient-to-b from-[#94a3b8] to-[#475569] shadow-[0_6px_0_#0f172a,0_12px_15px_rgba(0,0,0,0.3)]')}
                `}
              >
                {/* Island graphic character */}
                {island.icon}
                
                {/* Unlocked Island Foam Wave Border */}
                {isUnlocked && (
                  <span className="absolute -inset-1.5 rounded-3xl border-2 border-white/20 animate-pulse pointer-events-none" style={{ animationDuration: '3.5s' }} />
                )}

                {/* Locked Padlock with chained crossing visual */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/70 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] animate-pulse">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-slate-500 opacity-60">
                      <path d="M 15,15 L 85,85 M 85,15 L 15,85" stroke="currentColor" strokeWidth="4" strokeDasharray="3 3" strokeLinecap="round" />
                    </svg>
                    <span className="text-xl drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] filter grayscale-0">🔒</span>
                  </div>
                )}
              </div>

              {/* Island labels typography */}
              <span 
                className={`mt-4 font-black text-xs md:text-sm text-center tracking-wide select-none ${isUnlocked ? 'text-[#ebd9b4] font-black' : 'text-slate-400 font-medium'}`}
                style={isUnlocked ? cartoonTextShadow : {}}
              >
                {island.name}
              </span>

              {/* Island Quest progress indicators */}
              {(() => {
                const islandChallenges = QuestManager.getAllChallenges().filter(c => c.islandId === island.id);
                const total = islandChallenges.length;
                if (isUnlocked && total > 0) {
                  const completed = islandChallenges.filter(c => progress.completedIds.includes(c.id)).length;
                  const pct = Math.round((completed / total) * 100);
                  return (
                    <span 
                      className="block text-[10px] font-black text-amber-300 drop-shadow select-none font-sans"
                      style={cartoonTextShadow}
                    >
                      {completed}/{total} ({pct}%)
                    </span>
                  );
                }
                return null;
              })()}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Travel Overlay / Confirmation Banner (Wooden board style) */}
      {activeVoyageDest && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#78350f] to-[#451a03] border-4 border-[#f59e0b] rounded-2xl p-5 flex flex-col items-center gap-3 shadow-[0_10px_0_#291305,0_20px_25px_rgba(0,0,0,0.4)] z-40 max-w-sm w-[90%] text-center">
          <div>
            <h4 className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest font-mono" style={{ textShadow: '1.5px 1.5px 0px #000' }}>Set Voyage</h4>
            <p className="text-sm font-black text-white mt-1" style={{ textShadow: '2px 2px 0px #000' }}>Sail to {activeVoyageDest.name}?</p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={cancelVoyage}
              className="flex-1 py-2 bg-[#1e293b] border-2 border-slate-700 text-xs text-slate-300 font-black rounded-xl hover:border-slate-500 transition-all cursor-pointer shadow-[0_4px_0_#0f172a]"
            >
              Stay Here
            </button>
            <button
              onClick={executeVoyage}
              className="flex-1 py-2 bg-gradient-to-b from-[#fbbf24] to-[#d97706] text-xs text-slate-950 font-black rounded-xl hover:from-[#fcd34d] hover:to-[#ea580c] transition-all cursor-pointer shadow-[0_4px_0_#78350f] border-2 border-[#fef08a]"
            >
              Set Sail ⛵
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
