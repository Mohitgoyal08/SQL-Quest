import React from 'react';

export default function MissionButton({ 
  children, 
  variant = 'secondary', 
  onClick, 
  type = 'button' 
}) {
  const getStyles = (styleVariant) => {
    if (styleVariant === 'primary') {
      return 'border-emerald-900 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-md hover:shadow-lg';
    }
    return 'border-[#8c6b3e]/60 bg-[#ebd9b4] hover:bg-[#dfcb9f] text-[#5c4424] font-bold';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full sm:w-auto px-6 py-2.5 rounded-lg border-2 uppercase tracking-wider text-sm transition-all select-none cursor-pointer flex items-center justify-center gap-2 ${getStyles(variant)}`}
    >
      {children}
    </button>
  );
}