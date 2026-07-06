import React, { useState } from 'react';
import MainGameLayout from './components/layout/MainGameLayout';
import GameStateManager from './systems/GameStateManager';
import { useChallengeProgress } from './hooks/useChallengeProgress';
import { WorldManager } from './systems/WorldManager';
import { PlayerProfileService } from './services/PlayerProfileService';

export default function App() {
  const { progress, completeChallenge, selectChallenge } = useChallengeProgress();
  const [playerProfile, setPlayerProfile] = useState(() => PlayerProfileService.loadProfile());

  // Derive world context purely from current progress state
  const worldState = WorldManager.getWorldState(progress);

  return (
    <MainGameLayout 
      playerProfile={playerProfile} 
      progress={progress} 
      worldState={worldState}
    >
      <GameStateManager 
        progress={progress}
        completeChallenge={completeChallenge}
        selectChallenge={selectChallenge}
        worldState={worldState}
        onProfileChange={setPlayerProfile}
      />
    </MainGameLayout>
  );
}