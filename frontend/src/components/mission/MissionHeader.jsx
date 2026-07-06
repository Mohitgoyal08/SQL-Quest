import React from 'react';
import { MISSION_DIFFICULTY } from '../../config/missionDifficulty';

export default function MissionHeader({ title, npc, difficultyKey }) {
  const difficultyConfig = MISSION_DIFFICULTY[difficultyKey] || MISSION_DIFFICULTY.UNKNOWN;

  return (
    <div className="border-b-2 border-[#8c6b3e]/40 pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#8c6b3e] block select-none">
          Mission Issued By: {npc}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5c4424] tracking-wide">
          {title}
        </h1>
      </div>
      <div className="self-start sm:self-center">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-inner select-none ${difficultyConfig.badgeClasses}`}>
          {difficultyConfig.label}
        </span>
      </div>
    </div>
  );
}