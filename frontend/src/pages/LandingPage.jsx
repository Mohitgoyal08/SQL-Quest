import React from 'react';
import LandingTransition from '../components/transition/LandingTransition';

export default function LandingPage({ onStart }) {
  return (
    <div className="flex-1 flex items-center justify-center relative z-10 select-none">
      <div className="text-center z-10 px-4">
        <span className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#ebd9b4] block mb-2 animate-pulse">
          Interactive SQL Learning RPG
        </span>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#fdf6e2] tracking-widest uppercase drop-shadow-[0_6px_16px_rgba(0,0,0,0.8)] mb-8">
          SQL Quest
        </h1>
        <button
          type="button"
          onClick={onStart}
          className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base md:text-lg uppercase tracking-widest rounded-xl border-4 border-emerald-900 shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.8)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-3 mx-auto"
        >
          <span>Start Adventure</span>
          <span>▶</span>
        </button>
      </div>
      
      {/* Animation layer rendered underneath */}
      <LandingTransition isActive={false} duration={1.2} />
    </div>
  );
}