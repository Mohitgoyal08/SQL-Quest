import React from 'react';
import MissionCard from './MissionCard';

export default function MissionScene({ mission, onAccept, onDecline }) {
  if (!mission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 select-none overflow-y-auto">
      <MissionCard 
        mission={mission} 
        onAccept={onAccept} 
        onDecline={onDecline} 
      />
    </div>
  );
}