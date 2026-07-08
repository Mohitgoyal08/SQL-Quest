import React, { useState } from 'react';
import MainGameLayout from './components/layout/MainGameLayout';
import GameStateManager from './systems/GameStateManager';
import { useChallengeProgress } from './hooks/useChallengeProgress';
import { WorldManager } from './systems/WorldManager';
import { PlayerProfileService } from './services/PlayerProfileService';
import { InventoryProvider } from './inventory/context/InventoryContext';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { progress, completeChallenge, selectChallenge, updateUnlock, renameShip, adjustCoins, devApplyState } = useChallengeProgress();
  const [playerProfile, setPlayerProfile] = useState(() => PlayerProfileService.loadProfile());
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Derive world context purely from current progress state
  const worldState = WorldManager.getWorldState(progress);

  return (
    <InventoryProvider> 
      <Toaster position="top-center" reverseOrder={false} />
      <MainGameLayout 
        playerProfile={playerProfile} 
        progress={progress} 
        worldState={worldState}
        hasSeaChart={progress.unlocks?.seaChart || false}
        onMapOpen={() => setIsMapOpen(true)}
      >
        <GameStateManager 
          progress={progress}
          completeChallenge={completeChallenge}
          selectChallenge={selectChallenge}
          worldState={worldState}
          onProfileChange={setPlayerProfile}
          isMapOpen={isMapOpen}
          onCloseMap={() => setIsMapOpen(false)}
          onOpenMap={() => setIsMapOpen(true)}
          updateUnlock={updateUnlock}
          renameShip={renameShip}
          adjustCoins={adjustCoins}
          devApplyState={devApplyState}
        />
      </MainGameLayout>
    </InventoryProvider>
  );
}