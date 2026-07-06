import React, { useState } from 'react';
import MissionScene from './components/mission/MissionScene';
import { tutorialMission } from './data/missions/tutorialMission';

export default function App() {
  const [missionState, setMissionState] = useState('BRIEFING'); // BRIEFING | ACCEPTED | SQL_CHALLENGE | DECLINED

  const handleAccept = () => {
    setMissionState('ACCEPTED');
    setTimeout(() => {
      setMissionState('SQL_CHALLENGE');
    }, 1200);
  };

  const handleDecline = () => {
    setMissionState('DECLINED');
  };

  return (
    <main className="w-screen h-screen bg-slate-950 flex items-center justify-center font-sans overflow-hidden relative select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1d28] to-[#040c12] opacity-90 z-0" />

      {missionState === 'BRIEFING' && (
        <MissionScene
          mission={tutorialMission}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}

      {missionState === 'ACCEPTED' && (
        <div className="z-10 bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-xl p-8 max-w-md text-center shadow-2xl animate-pulse">
          <h2 className="text-2xl font-extrabold text-[#5c4424] mb-2">Mission Accepted!</h2>
          <p className="text-amber-950 font-medium text-sm">
            Unfurling the query ledger...
          </p>
        </div>
      )}

      {missionState === 'SQL_CHALLENGE' && (
        <div className="z-10 bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-2xl p-8 max-w-xl w-full text-center shadow-2xl mx-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8c6b3e] block mb-1">
            Active Encounter: {tutorialMission.title}
          </span>
          <h2 className="text-3xl font-black text-[#5c4424] mb-4">SQL Challenge Arena</h2>
          
          <div className="p-6 bg-[#ebd9b4]/50 border-2 border-dashed border-[#8c6b3e]/60 rounded-xl mb-6 text-left">
            <p className="text-amber-950 font-medium text-sm md:text-base mb-2">
              <strong>Objective:</strong> Retrieve all records from the <code className="bg-[#fdf6e2] px-1.5 py-0.5 rounded border border-[#8c6b3e]/40">ships</code> table.
            </p>
            <p className="text-xs text-[#8c6b3e] italic">
              Interactive SQL Execution Engine coming in Sprint 8.
            </p>
          </div>

          <button
            onClick={() => setMissionState('BRIEFING')}
            className="px-6 py-2.5 bg-[#8c6b3e] hover:bg-[#725630] text-white font-bold rounded-lg shadow transition-colors uppercase tracking-wider text-xs cursor-pointer"
          >
            Reset Sandbox Loop
          </button>
        </div>
      )}

      {missionState === 'DECLINED' && (
        <div className="z-10 bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-xl p-8 max-w-md text-center shadow-2xl">
          <h2 className="text-xl font-bold text-[#5c4424] mb-2">Mission Declined</h2>
          <p className="text-amber-950 font-medium text-sm mb-6">
            The harbor awaits whenever you find the courage to chart the query.
          </p>
          <button
            onClick={() => setMissionState('BRIEFING')}
            className="px-6 py-2 bg-[#8c6b3e] text-white font-bold rounded shadow hover:bg-[#725630] transition-colors uppercase tracking-wider text-xs cursor-pointer"
          >
            Re-open Briefing
          </button>
        </div>
      )}
    </main>
  );
}