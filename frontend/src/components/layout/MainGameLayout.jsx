import React from 'react';
import HUD from './HUD';

export default function MainGameLayout({ children, playerProfile, progress, worldState }) {
  return (
    <div className="relative w-screen h-screen bg-slate-950 flex flex-col justify-between overflow-hidden select-none font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1d28] via-[#07141d] to-[#040c12] opacity-95 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#8c6b3e_1px,transparent_1px)] [background-size:32px_32px] opacity-10 z-0 pointer-events-none" />

      <HUD 
        playerName={playerProfile?.name || 'Privateer'} 
        level={progress?.level || 1}
        xp={progress?.xp || 0}
        coins={progress?.coins || 0}
        gems={progress?.gems || 0}
        currentIsland={worldState?.currentIsland || 'Tutorial Harbor'}
        currentNPC={worldState?.currentNPC || 'Captain Blackbeard'}
      />

      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {children}
      </main>

      <footer className="relative z-20 bg-[#0b1d28] border-t border-[#8c6b3e]/40 px-4 py-1.5 flex items-center justify-between text-[11px] text-[#ebd9b4]/70 font-mono">
        <span>SQL Quest v1.0 Shell | Sprint 8.6 Finalized Architecture</span>
        <span>Engine Status: Relational SQLite Execution Readying for Sprint 9</span>
      </footer>
    </div>
  );
}