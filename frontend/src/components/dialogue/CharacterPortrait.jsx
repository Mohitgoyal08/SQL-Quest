import React from 'react';

export default function CharacterPortrait({ portrait, emotion }) {
  return (
    <div className="flex flex-col items-center justify-center w-32 h-32 bg-amber-100 border-2 border-amber-800 rounded-lg shadow-inner select-none p-2 text-center">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
        Portrait
      </span>
      <span className="text-sm font-semibold text-amber-950">
        {portrait || 'unknown'}
      </span>
      <span className="text-xs text-amber-700 italic mt-1">
        ({emotion || 'neutral'})
      </span>
    </div>
  );
}