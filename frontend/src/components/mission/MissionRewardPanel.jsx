import React from 'react';
import RewardBadge from './RewardBadge';

export default function MissionRewardPanel({ rewards = {} }) {
  const { xp = 0, coins = 0, items = [], stars = 0, badges = [] } = rewards;

  return (
    <div className="my-6 p-4 bg-[#ebd9b4]/50 border-2 border-dashed border-[#8c6b3e]/60 rounded-xl">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#8c6b3e] mb-3 select-none">
        Spoils & Rewards
      </h3>
      
      <div className="flex flex-wrap items-center gap-4">
        {xp > 0 && (
          <RewardBadge icon="★" label={`+${xp} XP`} variant="xp" />
        )}

        {coins > 0 && (
          <RewardBadge icon="🪙" label={`${coins} Gold`} variant="coins" />
        )}

        {stars > 0 && (
          <RewardBadge icon="⭐" label={`${stars} Star${stars > 1 ? 's' : ''}`} variant="stars" />
        )}

        {items.map((item, idx) => (
          <RewardBadge key={idx} icon="📦" label={item} variant="items" />
        ))}

        {badges.map((badge, idx) => (
          <RewardBadge key={idx} icon="🎖️" label={badge} variant="badges" />
        ))}
      </div>
    </div>
  );
}