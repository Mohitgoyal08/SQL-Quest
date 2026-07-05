import React from 'react';

export default function WorldCamera({ children }) {
  return (
    // Scaffolding container awaiting panning mechanics in future sprints
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      {children}
    </div>
  );
}