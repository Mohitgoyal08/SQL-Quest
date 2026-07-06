import React from 'react';
import MissionHeader from './MissionHeader';
import MissionObjectiveList from './MissionObjectiveList';
import MissionRewardPanel from './MissionRewardPanel';
import MissionActions from './MissionActions';

export default function MissionCard({ mission, onAccept, onDecline }) {
  if (!mission) return null;

  const { title, npc, difficultyKey, description, objectives, rewards } = mission;

  return (
    <div className="max-w-2xl w-full bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col justify-between">
      <div>
        <MissionHeader title={title} npc={npc} difficultyKey={difficultyKey} />
        
        {/* Mission Lore / Description */}
        <p className="text-base md:text-lg text-amber-950 font-medium leading-relaxed my-4">
          {description}
        </p>

        <MissionObjectiveList objectives={objectives} />
        <MissionRewardPanel rewards={rewards} />
      </div>

      <MissionActions onAccept={onAccept} onDecline={onDecline} />
    </div>
  );
}