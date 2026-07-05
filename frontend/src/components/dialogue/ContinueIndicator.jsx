import React from 'react';

export default function ContinueIndicator({ onContinue, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onContinue}
      disabled={disabled}
      className={`flex items-center gap-3 px-4 py-2 border-2 rounded-lg transition-colors select-none ${
        disabled
          ? 'bg-amber-100 border-amber-300 text-amber-400 cursor-not-allowed'
          : 'bg-[#fdf6e2] border-[#8c6b3e] text-[#5c4424] hover:bg-[#f3e8ce] cursor-pointer shadow-sm'
      }`}
    >
      <span className="px-2 py-0.5 bg-slate-800 text-amber-400 font-mono font-bold text-xs rounded shadow-inner uppercase tracking-wider">
        ENTER
      </span>
      <span className="font-bold uppercase tracking-wide text-sm">
        Continue
      </span>
    </button>
  );
}
