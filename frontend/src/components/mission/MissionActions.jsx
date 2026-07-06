import React from 'react';
import MissionButton from './MissionButton';

export default function MissionActions({ onAccept, onDecline }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-6 pt-4 border-t-2 border-[#8c6b3e]/40">
      <MissionButton variant="secondary" onClick={onDecline}>
        Decline
      </MissionButton>

      <MissionButton variant="primary" onClick={onAccept}>
        <span>Accept Mission</span>
        <span>⚔️</span>
      </MissionButton>
    </div>
  );
}