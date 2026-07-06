export default function MissionRewardPreview({ rewards }) {
    return (
        <div className="mt-6 rounded-xl border border-[#8c6b3e] bg-[#ebd9b4]/40 p-4">
            <h3 className="font-bold mb-2">
                Rewards
            </h3>

            <div className="flex gap-4">
                <span>★ {rewards.xp} XP</span>
                <span>🪙 {rewards.coins} Gold</span>

                {rewards.gems && (
                    <span>💎 {rewards.gems}</span>
                )}
            </div>
        </div>
    );
}