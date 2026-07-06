import React from 'react';

export default function MissionObjectiveList({ objectives = [] }) {
  return (
    <div className="my-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-[#8c6b3e] mb-3 select-none">
        Mission Objectives
      </h3>
      <div className="flex flex-col gap-3">
        {objectives.map((obj) => (
          <div 
            key={obj.id || obj.title} 
            className="flex items-start gap-3 p-3 bg-[#f3e8ce]/60 border border-[#8c6b3e]/30 rounded-lg shadow-sm"
          >
            {/* Static Unchecked Box Icon */}
            <div className="mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 border-[#8c6b3e] bg-[#fdf6e2] flex items-center justify-center shadow-inner select-none">
              <span className="text-[#8c6b3e] opacity-0 text-xs font-bold">✓</span>
            </div>
            <div>
              <h4 className="font-bold text-[#5c4424] text-sm md:text-base leading-snug">
                {obj.title}
              </h4>
              {obj.description && (
                <p className="text-xs md:text-sm text-amber-950/80 mt-0.5 leading-relaxed">
                  {obj.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}