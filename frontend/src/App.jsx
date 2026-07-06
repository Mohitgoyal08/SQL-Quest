import React from 'react';
import { useChallengeProgress } from './hooks/useChallengeProgress';
import { SQL_CHALLENGES } from './data/challenges';
import { ChallengeSidebar } from './components/challenge/ChallengeSidebar';
import { ChallengePanel } from './components/challenge/ChallengePanel';

export default function App() {
  const { progress, completeChallenge, selectChallenge } = useChallengeProgress();

  // Find active challenge metadata or fallback to the first novice challenge
  const currentChallenge = 
    SQL_CHALLENGES.find((c) => c.id === progress.currentChallengeId) || SQL_CHALLENGES[0];
  
  const isCompleted = progress.completedIds.includes(currentChallenge.id);

  // Helper to clear localStorage during sandbox testing
  const handleResetSaveData = () => {
    localStorage.removeItem('sql_quest_player_save_v2');
    localStorage.removeItem('sql_quest_player_save_v1');
    window.location.reload();
  };

  return (
    <main className="w-screen h-screen bg-slate-950 flex flex-col justify-between font-sans overflow-hidden relative select-none">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1d28] to-[#040c12] opacity-95 z-0 pointer-events-none" />

      {/* Top Navigation / App Bar */}
      <header className="relative z-10 bg-[#fdf6e2] border-b-4 border-[#8c6b3e] px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏴‍☠️</span>
          <div>
            <h1 className="font-black text-lg md:text-xl text-[#5c4424] tracking-wider uppercase leading-none">
              SQL Quest: Challenge Arena
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8c6b3e]">
              Island: {progress.currentIsland || 'Tutorial Harbor'} | Chapter {currentChallenge.chapter || 1}
            </span>
          </div>
        </div>

        {/* Global Player Ledger Bar */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-[#ebd9b4] px-3 py-1 rounded-lg border border-[#8c6b3e]/60 shadow-inner text-xs font-extrabold text-[#5c4424]">
            <span>⚡ Level {progress.level || 1}</span>
            <span className="opacity-40">|</span>
            <span className="text-amber-600">★ {progress.xp} XP</span>
            <span className="opacity-40">|</span>
            <span className="text-yellow-600">🪙 {progress.coins} Gold</span>
            {progress.gems > 0 && (
              <>
                <span className="opacity-40">|</span>
                <span className="text-purple-700">💎 {progress.gems} Gems</span>
              </>
            )}
          </div>

          <button
            onClick={handleResetSaveData}
            className="text-xs font-bold uppercase tracking-wider text-red-900 bg-red-200/80 border border-red-500/60 px-3 py-1.5 rounded hover:bg-red-300 transition-colors cursor-pointer shadow-sm"
          >
            Reset Save
          </button>
        </div>
      </header>

      {/* Workspace Split Layout */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-6 overflow-hidden max-w-7xl w-full mx-auto">
        <ChallengeSidebar
          challenges={SQL_CHALLENGES}
          completedIds={progress.completedIds}
          unlockedIds={progress.unlockedIds}
          currentId={progress.currentChallengeId}
          onSelect={selectChallenge}
          xp={progress.xp}
          coins={progress.coins}
        />

        <ChallengePanel
          challenge={currentChallenge}
          onSuccess={completeChallenge}
          isAlreadyCompleted={isCompleted}
        />
      </div>
    </main>
  );
}