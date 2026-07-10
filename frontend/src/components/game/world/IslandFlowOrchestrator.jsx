import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { IslandFlowManager } from '../../../systems/IslandFlowManager';
import { QuestManager } from '../../../systems/QuestManager';
import DialogueScene from '../../dialogue/DialogueScene';
import { ChallengePanel } from '../../challenge/ChallengePanel';
import { ChallengeSidebar } from '../../challenge/ChallengeSidebar';
import MissionScene from '../../mission/MissionScene';
import RewardPopup from '../../mission/RewardPopup';
import IslandTitleCard from '../../transition/IslandTitleCard';
import CharacterSelectionPage from '../../../pages/CharacterSelectionPage';
import { PlayerProfileService } from '../../../services/PlayerProfileService';
import toast from 'react-hot-toast';

export default function IslandFlowOrchestrator({ 
  islandId, 
  progress, 
  completeChallenge, 
  selectChallenge,
  onOpenMap,
  updateUnlock,
  addItem,
  onFlowComplete, // When departure happens
  onTriggerCinematic,
  onProfileChange
}) {
  const [stageIndex, setStageIndex] = useState(() => IslandFlowManager.getInitialStageIndex(islandId, progress));
  const [isMissionActive, setIsMissionActive] = useState(false);
  const [earnedRewards, setEarnedRewards] = useState(null);
  
  const currentStage = IslandFlowManager.getStage(islandId, stageIndex);
  
  const advanceStage = useCallback(() => {
    setStageIndex(prev => {
      const flow = IslandFlowManager.getIslandFlow(islandId);
      if (!flow || prev >= flow.stages.length - 1) return prev;
      return prev + 1;
    });
  }, [stageIndex, islandId]);

  useEffect(() => {
    if (currentStage?.type === 'ARRIVAL') {
      const t = setTimeout(advanceStage, 1000);
      return () => clearTimeout(t);
    }
  }, [currentStage?.type, advanceStage]);

  useEffect(() => {
    if (currentStage?.type === 'CHARACTER_SELECTION') {
      const profile = PlayerProfileService.loadProfile();
      if (profile && profile.name !== 'Privateer') {
        advanceStage();
      }
    }
  }, [currentStage?.type, advanceStage]);

  useEffect(() => {
    if (currentStage?.type === 'REWARD' && !earnedRewards && !currentStage.rewards) {
      advanceStage();
    }
  }, [currentStage?.type, currentStage?.rewards, earnedRewards, advanceStage]);

  useEffect(() => {
    if (currentStage?.type === 'DEPARTURE') {
      onFlowComplete();
    }
  }, [currentStage?.type, onFlowComplete]);

  if (!currentStage) return null;

  // Render based on generic stage types
  switch (currentStage.type) {
    case 'ARRIVAL':
      return (
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 bg-slate-950 z-[100] pointer-events-none" 
        />
      );

    case 'TITLE':
      return <IslandTitleCard title={currentStage.title} onComplete={advanceStage} />;

    case 'STORY_EVENT':
      return (
        <div className="flex-1 flex items-center justify-center bg-slate-900 text-[#ebd9b4] p-8 text-center text-xl italic font-serif relative z-20">
          <p className="max-w-2xl">{currentStage.content}</p>
          <button onClick={advanceStage} className="absolute bottom-10 px-6 py-3 bg-[#8c6b3e] text-white rounded">Continue</button>
        </div>
      );

    case 'CHARACTER_SELECTION':
      return (
        <div className="flex-1 absolute inset-0 z-50">
          <CharacterSelectionPage 
            onComplete={(profile) => {
              PlayerProfileService.saveProfile(profile);
              if (typeof onProfileChange === 'function') onProfileChange(profile);
              advanceStage();
            }} 
          />
        </div>
      );

    case 'DIALOGUE':
      return (
        <DialogueScene
          dialogue={QuestManager.getDialogueForNPC(IslandFlowManager.getIslandFlow(islandId).npcId, currentStage.id, progress)}
          onComplete={() => {
            setIsMissionActive(true);
            advanceStage();
          }}
        />
      );

    case 'CHALLENGE':
      // The dialogue before this challenge sets isMissionActive=true to show the MissionScene
      if (isMissionActive) {
        return (
          <MissionScene
            mission={QuestManager.getMissionForChallenge(currentStage.id)}
            onAccept={() => setIsMissionActive(false)}
            onDecline={() => toast.error("You cannot decline your destiny.")}
          />
        );
      }
      return (
        <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-6 overflow-hidden max-w-7xl w-full mx-auto relative z-20">
          <ChallengeSidebar
            challenges={QuestManager.getAllChallenges().filter(c => c.islandId === islandId)}
            progress={progress}
            onSelect={selectChallenge}
          />
          <ChallengePanel
            challenge={QuestManager.getActiveChallenge(currentStage.id)}
            onSuccess={(id, rewards, nextId) => {
              setEarnedRewards(rewards);
              
              if (rewards?.item && typeof addItem === 'function') {
                addItem(rewards.item);
              }

              // Handle completion logic
              completeChallenge(id, rewards, nextId);
              
              if (id === 'chal_01') {
                toast.success("🗺️ Weathered Sea Chart unlocked! Check your map.");
              }
              if (id === 'chal_06' && onTriggerCinematic) {
                onTriggerCinematic('ship');
              }

              // Instead of calling GameStateManager, we show reward popup here if needed, or advance
              advanceStage();
            }}
            isAlreadyCompleted={progress.completedIds.includes(currentStage.id)}
          />
        </div>
      );

    case 'REWARD':
      if (earnedRewards || currentStage.rewards) {
        return (
          <RewardPopup
            rewards={earnedRewards || currentStage.rewards}
            onClaim={() => {
              if (currentStage.rewards?.key && updateUnlock) {
                updateUnlock(currentStage.rewards.key, true);
              }
              advanceStage();
            }}
          />
        );
      }
      return null;

    case 'DEPARTURE':
      return null;

    default:
      return <div>Unknown Stage Type: {currentStage.type}</div>;
  }
}
