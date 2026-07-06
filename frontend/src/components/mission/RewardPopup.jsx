import React from 'react';
import RewardBadge from './RewardBadge';

export default function MissionRewardPanel({ rewards = {}, onClaim }) {
  const { xp = 0, coins = 0, items = [], stars = 0, badges = [], gems = 0 } = rewards;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 select-none overflow-y-auto">
      <div className="max-w-lg w-full bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-2xl p-8 text-center shadow-2xl animate-fade-in">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8c6b3e] block mb-2">
          Bounty Collected
        </span>
        <h2 className="text-3xl font-black text-[#5c4424] mb-6 uppercase tracking-wide">
          Mission Accomplished!
        </h2>

        <div className="my-6 p-6 bg-[#ebd9b4]/50 border-2 border-dashed border-[#8c6b3e]/60 rounded-xl">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8c6b3e] mb-4">
            Spoils & Rewards
          </h3>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {xp > 0 && <RewardBadge icon="★" label={`+${xp} XP`} variant="xp" />}
            {coins > 0 && <RewardBadge icon="🪙" label={`${coins} Gold`} variant="coins" />}
            {gems > 0 && <RewardBadge icon="💎" label={`+${gems} Gems`} variant="gems" />}
            {stars > 0 && <RewardBadge icon="⭐" label={`${stars} Star${stars > 1 ? 's' : ''}`} variant="stars" />}
            {items.map((item, idx) => (
              <RewardBadge key={idx} icon="📦" label={item} variant="items" />
            ))}
            {badges.map((badge, idx) => (
              <RewardBadge key={idx} icon="🎖️" label={badge} variant="badges" />
            ))}
          </div>
        </div>

        {typeof onClaim === 'function' && (
          <button
            type="button"
            onClick={onClaim}
            className="mt-4 w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold uppercase tracking-wider rounded-lg border-2 border-emerald-900 shadow-md transition-all cursor-pointer"
          >
            Continue Journey ⚓
          </button>
        )}
      </div>
    </div>
  );
}