import React from 'react';

export default function HUD({ 
  playerName = 'Privateer', 
  level = 1, 
  xp = 0, 
  coins = 0, 
  gems = 0, 
  currentIsland = 'Tutorial Harbor', 
  currentNPC = 'Captain Blackbeard' 
}) {
  return (
    <header className="relative z-20 bg-[#fdf6e2] border-b-4 border-[#8c6b3e] px-4 md:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between shadow-md select-none font-sans gap-2">
      {/* Left Context: Island & Active NPC */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏴‍☠️</span>
          <div>
            <h1 className="font-black text-base md:text-lg text-[#5c4424] tracking-wider uppercase leading-none">
              {playerName}
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8c6b3e] block mt-0.5">
              📍 {currentIsland} | 💬 {currentNPC}
            </span>
          </div>
        </div>

        {/* Future Navigation Placeholders */}
        <div className="flex items-center gap-1.5 ml-2">
          <button 
            type="button" 
            title="Map (Coming Soon)" 
            className="px-2 py-1 bg-[#ebd9b4] hover:bg-[#dfcb9f] border border-[#8c6b3e]/60 rounded text-xs font-bold text-[#5c4424] cursor-not-allowed opacity-60"
          >
            🗺️ Map
          </button>
          <button 
            type="button" 
            title="SQL Journal (Coming Soon)" 
            className="px-2 py-1 bg-[#ebd9b4] hover:bg-[#dfcb9f] border border-[#8c6b3e]/60 rounded text-xs font-bold text-[#5c4424] cursor-not-allowed opacity-60"
          >
            📖 Journal
          </button>
          <button 
            type="button" 
            title="Inventory (Coming Soon)" 
            className="px-2 py-1 bg-[#ebd9b4] hover:bg-[#dfcb9f] border border-[#8c6b3e]/60 rounded text-xs font-bold text-[#5c4424] cursor-not-allowed opacity-60"
          >
            🎒 Bag
          </button>
        </div>
      </div>

      {/* Right Stats: Level, XP, Coins, Gems */}
      <div className="flex items-center gap-2 md:gap-3 bg-[#ebd9b4] px-3 py-1.5 rounded-lg border border-[#8c6b3e]/60 shadow-inner text-xs font-extrabold text-[#5c4424] w-full sm:w-auto justify-around sm:justify-end">
        <span className="bg-[#fdf6e2] px-2 py-0.5 rounded border border-[#8c6b3e]/30">
          ⚡ Lvl {level}
        </span>
        <span className="text-amber-700 flex items-center gap-1">
          ★ {xp} <span className="hidden md:inline">XP</span>
        </span>
        <span className="text-yellow-700 flex items-center gap-1">
          🪙 {coins} <span className="hidden md:inline">Gold</span>
        </span>
        {gems > 0 && (
          <span className="text-purple-800 flex items-center gap-1">
            💎 {gems}
          </span>
        )}
      </div>
    </header>
  );
}