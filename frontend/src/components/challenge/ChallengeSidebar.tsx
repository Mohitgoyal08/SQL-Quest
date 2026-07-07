import React from 'react';
import { SQLChallenge } from '../../data/challenges';
import { useChallengeProgression } from '../../hooks/useChallengeProgression';

import { PlayerProgressState } from '../../hooks/useChallengeProgress';

interface ChallengeSidebarProps {
  challenges: SQLChallenge[];
  progress: PlayerProgressState;
  onSelect: (id: string) => void;
}

export const ChallengeSidebar: React.FC<ChallengeSidebarProps> = ({
  challenges,
  progress,
  onSelect,
}) => {
  const {
    isUnlocked: checkUnlocked,
    isCompleted: checkCompleted,
    isCurrent: checkCurrent,
  } = useChallengeProgression(progress);

  return (
    <aside className="w-full md:w-72 bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-xl p-4 flex flex-col justify-between shadow-xl select-none">
      <div>
        {/* Player Ledger / Stats Header */}
        <div className="border-b-2 border-[#8c6b3e]/40 pb-3 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#8c6b3e]">
            Captain&apos;s Log
          </h2>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5 bg-[#ebd9b4] px-2.5 py-1 rounded border border-[#8c6b3e]/40 shadow-inner">
              <span className="text-amber-600 font-black text-xs">★</span>
              <span className="font-extrabold text-[#5c4424] text-xs">
                {progress.xp} XP
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#ebd9b4] px-2.5 py-1 rounded border border-[#8c6b3e]/40 shadow-inner">
              <span className="text-yellow-600 font-black text-xs">🪙</span>
              <span className="font-extrabold text-[#5c4424] text-xs">
                {progress.coins} Gold
              </span>
            </div>
          </div>
        </div>

        {/* Mission Manifest List */}
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#8c6b3e] mb-2">
          Challenge Manifest
        </h3>

        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
          {challenges.map((chal, idx) => {
            const isUnlocked = checkUnlocked(chal);
            const isCompleted = checkCompleted(chal);
            const isCurrent = checkCurrent(chal);

            return (
              <button
                key={chal.id}
                onClick={() => isUnlocked && onSelect(chal.id)}
                disabled={!isUnlocked}
                className={`w-full text-left p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                  !isUnlocked
                    ? 'bg-amber-100/40 border-amber-300/40 text-amber-900/40 cursor-not-allowed'
                    : isCurrent
                    ? 'bg-[#8c6b3e] border-[#5c4424] text-white shadow-md'
                    : 'bg-[#ebd9b4]/50 border-[#8c6b3e]/40 text-[#5c4424] hover:bg-[#ebd9b4]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-xs font-bold opacity-75">
                    #{idx + 1}
                  </span>

                  <span className="font-bold text-xs truncate">
                    {chal.title}
                  </span>
                </div>

                <div>
                  {isCompleted && (
                    <span className="text-xs" title="Completed">
                      ✔
                    </span>
                  )}

                  {!isUnlocked && (
                    <span className="text-xs" title="Locked">
                      🔒
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};