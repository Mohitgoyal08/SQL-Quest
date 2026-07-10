import React from 'react';

export default function MissionButton({ 
  children, 
  variant = 'secondary', 
  onClick, 
  type = 'button',
  disabled = false
}) {
  const getStyles = (styleVariant) => {
    if (disabled) {
      return 'bg-gray-400 text-gray-200 border-gray-500 shadow-[0_6px_0_#4b5563,0_10px_15px_rgba(0,0,0,0.3)] cursor-not-allowed';
    }
    if (styleVariant === 'primary') {
      return 'bg-gradient-to-b from-[#22c55e] to-[#16a34a] text-white border-[#14532d] shadow-[0_6px_0_#166534,0_10px_15px_rgba(0,0,0,0.3)] hover:scale-105 active:translate-y-2 active:shadow-[0_0px_0_#166534,0_4px_8px_rgba(0,0,0,0.3)]';
    }
    return 'bg-gradient-to-b from-[#f59e0b] to-[#d97706] text-white border-[#92400e] shadow-[0_6px_0_#92400e,0_10px_15px_rgba(0,0,0,0.3)] hover:scale-105 active:translate-y-2 active:shadow-[0_0px_0_#92400e,0_4px_8px_rgba(0,0,0,0.3)]';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full sm:w-auto px-8 py-3 rounded-2xl border-4 font-black uppercase tracking-widest text-sm transition-all select-none flex items-center justify-center gap-2 ${getStyles(variant)}`}
      style={{ WebkitTextStroke: variant === 'secondary' && !disabled ? '1px #78350f' : (disabled ? '1px #374151' : '1px #14532d') }}
    >
      <span className="drop-shadow-sm">{children}</span>
    </button>
  );
}