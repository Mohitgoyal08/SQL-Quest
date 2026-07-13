import React, { useState, useEffect } from 'react';
import MainGameLayout from './components/layout/MainGameLayout';
import GameStateManager from './systems/GameStateManager';
import { useChallengeProgress } from './hooks/useChallengeProgress';
import { WorldManager } from './systems/WorldManager';
import { PlayerProfileService } from './services/PlayerProfileService';
import { InventoryProvider } from './inventory/context/InventoryContext';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { apiClient } from './services/api';
import { ContentService } from './services/ContentService';

export default function App() {
  const { user, loading, logout } = useAuth();
  const { progress, completeChallenge, selectChallenge, updateUnlock, renameShip, adjustCoins, devApplyState, setServerProgress } = useChallengeProgress();
  const [playerProfile, setPlayerProfile] = useState(() => PlayerProfileService.loadProfile());
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  // Sync profile and handle Cloud Save Migration when user auth state changes
  useEffect(() => {
    if (!user) {
      setHasSynced(false);
      setContentLoaded(false);
      return;
    }

    const handleAuthSync = async () => {
      if (user && !hasSynced) {
        setIsMigrating(true);
        const profile = { name: user.display_name, avatar: user.avatar_id || 'default' };
        setPlayerProfile(profile);
        PlayerProfileService.saveProfile(profile);
        
        try {
          await ContentService.fetchContent();
          setContentLoaded(true);

          const hasMigrated = localStorage.getItem('sql_quest_v2_migrated');
          
          if (!hasMigrated && progress.level > 1) {
            console.log("Migrating local save to cloud...");
            const res = await apiClient.post('/progress/sync', {
              state: progress,
              local_timestamp: new Date().toISOString()
            });
            setServerProgress(res.data.state);
            localStorage.setItem('sql_quest_v2_migrated', 'true');
          } else {
            console.log("Loading cloud save...");
            const res = await apiClient.get('/progress/');
            setServerProgress(res.data);
            localStorage.setItem('sql_quest_v2_migrated', 'true');
          }
        } catch (e) {
          console.error("Failed to sync progress with cloud or load content:", e);
        } finally {
          setIsMigrating(false);
          setHasSynced(true);
        }
      }
    };
    
    handleAuthSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, hasSynced]);

  // Derive world context purely from current progress state
  const worldState = WorldManager.getWorldState(progress);

  if (loading || isMigrating || (user && (!hasSynced || !contentLoaded))) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-parchment-light font-display text-pirate-charcoal">
        {loading ? 'Loading Ship Manifest...' : (contentLoaded ? 'Synchronizing Cloud Save...' : 'Loading Game Content...')}
      </div>
    );
  }

  if (!user) {
    return (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    );
  }

  const isAdminRoute = window.location.pathname === '/admin';
  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  return (
    <InventoryProvider> 
      <Toaster position="top-center" reverseOrder={false} />
      <MainGameLayout 
        playerProfile={playerProfile} 
        progress={progress} 
        worldState={worldState}
        hasSeaChart={progress.unlocks?.seaChart || false}
        onMapOpen={() => setIsMapOpen(true)}
        onLogout={logout}
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