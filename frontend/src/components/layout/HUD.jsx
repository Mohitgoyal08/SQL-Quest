import React from 'react';
import { FEATURES } from '../../config/features';

export default function HUD({ 
  playerName = 'Privateer', 
  level = 1, 
  xp = 0, 
  coins = 0, 
  gems = 0, 
  currentIsland = 'Tutorial Harbor', 
  currentNPC = 'Captain Blackbeard',
  hasSeaChart = false,
  onMapOpen,
  activeShipName = null
}) {
  return (
    <header className="relative z-50 bg-[#07131f]/60 backdrop-blur-xl border-b border-[#8c6b3e]/40 px-4 md:px-8 py-3 flex flex-col sm:flex-row items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)] select-none font-sans gap-4">
      {/* Top Gold Gradient Line for Premium feel */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-60" />

      {/* Left Context: Island & Active NPC */}
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-b from-[#8c6b3e] to-[#5c4424] rounded-full flex items-center justify-center border-2 border-[#fdf6e2] shadow-lg">
            <span className="text-2xl filter drop-shadow">🏴‍☠️</span>
          </div>
          <div>
            <h1 className="font-black text-lg md:text-xl text-[#fdf6e2] tracking-wider uppercase leading-none drop-shadow-md">
              {playerName}
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block mt-1 drop-shadow-sm">
              {activeShipName ? '⛵' : '📍'} <span className="text-gray-300">{currentIsland}</span> {activeShipName ? <span className="text-[#8c6b3e] opacity-70">| {activeShipName}</span> : ''} {currentNPC !== 'None' ? <span className="text-emerald-400/80">| 💬 {currentNPC}</span> : ''}
            </span>
          </div>
        </div>

        {/* Future Navigation Placeholders */}
        <div className="flex items-center gap-2 ml-4">
          <button 
            type="button" 
            title={hasSeaChart ? "Open Sea Chart" : "Map (Unlocks via story progression)"} 
            onClick={hasSeaChart ? onMapOpen : undefined}
            className={`px-3 py-1.5 bg-slate-800/80 border border-[#8c6b3e]/40 hover:border-amber-500 rounded-lg text-xs font-bold text-[#ebd9b4] transition-all shadow-md ${
              hasSeaChart 
                ? 'hover:bg-slate-700/80 hover:-translate-y-0.5 cursor-pointer opacity-100' 
                : 'cursor-not-allowed opacity-40'
            }`}
          >
            🗺️ Map
          </button>
          <button 
            type="button" 
            title="SQL Journal (Coming Soon)" 
            className="px-3 py-1.5 bg-slate-800/50 border border-[#8c6b3e]/20 rounded-lg text-xs font-bold text-[#ebd9b4] cursor-not-allowed opacity-40 transition-colors"
          >
            📖 Journal
          </button>
          <button 
            type="button" 
            title="Inventory (Coming Soon)" 
            className="px-3 py-1.5 bg-slate-800/50 border border-[#8c6b3e]/20 rounded-lg text-xs font-bold text-[#ebd9b4] cursor-not-allowed opacity-40 transition-colors"
          >
            🎒 Bag
          </button>
        </div>
      </div>

      {/* Right Stats: Level, XP, Currencies */}
      <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
        
        {/* Level / XP block */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8c6b3e]">Lvl</span>
            <span className="text-xl font-black font-serif ml-1 text-amber-500 drop-shadow-md">{level}</span>
          </div>
          <div className="w-24 sm:w-32 bg-slate-900/80 rounded-full h-3 relative overflow-hidden border border-[#8c6b3e]/30 shadow-inner">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 ease-out relative overflow-hidden" 
              style={{ width: `${Math.min(100, Math.max(0, (xp % 100)))}%` }}
            >
               {/* Pulsing light sweep over XP bar */}
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>

        {FEATURES.ENABLE_ECONOMY && (
          <div className="flex items-center gap-4 bg-slate-900/40 px-4 py-1.5 rounded-full border border-[#8c6b3e]/20 text-[#ebd9b4]">
            <span className="text-sm font-bold flex items-center gap-1.5">
              <span className="text-amber-400">🪙</span> {coins}
            </span>
            {gems > 0 && (
              <span className="text-purple-400 flex items-center gap-1.5">
                💎 {gems}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}