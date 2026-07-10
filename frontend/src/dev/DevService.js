/**
 * DevService - Unified service manager orchestrating Developer tools and scenario presets
 */
import { SCENARIO_PRESETS } from './ScenarioLibrary';
import { PlayerProfileService } from '../services/PlayerProfileService';
import toast from 'react-hot-toast';
import { SQL_CHALLENGES } from '../data/challenges';
import { FEATURES } from '../config/features';

export class DevService {
  /**
   * Instantly loads a predefined scenario preset
   */
  static loadScenario(
    presetKey,
    devApplyState,
    setGameState,
    onOpenMap,
    onCloseMap,
    setIsVoyageCinematicActive,
    setIsShipCinematicActive,
    setInventoryOpen
  ) {
    const preset = SCENARIO_PRESETS[presetKey];
    if (!preset) {
      toast.error(`⚠️ Preset [${presetKey}] not found!`);
      return;
    }

    if (presetKey === 'fresh_game') {
      localStorage.removeItem(import.meta.env.DEV ? 'sql_quest_dev_save' : 'sql_quest_player_save_v2');
      localStorage.removeItem(import.meta.env.DEV ? 'sql_quest_dev_profile' : 'sql_quest_player_profile');
      toast.success('✓ Save cleared. Reloading game...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
      return;
    }

    // Set isolated save profile name if fresh
    const profile = PlayerProfileService.loadProfile();
    if (!profile || profile.name === 'Privateer') {
      PlayerProfileService.saveProfile({ name: 'Dev Captain', avatar: 'default' });
    }

    // Dispatch progress state override
    devApplyState(preset.state);

    // Apply core state
    devApplyState(preset.state);
    
    // Check feature flags for UI routing overrides
    let targetGameState = preset.gameState;
    if (targetGameState === 'TOWN_HUB' && !FEATURES.ENABLE_TOWN_HUB) {
      targetGameState = 'ISLAND_FLOW';
    }

    // Reset all overlay states
    setGameState(targetGameState);
    setIsVoyageCinematicActive(preset.isVoyageActive || false);
    setIsShipCinematicActive(preset.isShipRevealActive || false);
    setInventoryOpen(false);

    if (preset.gameState === 'MAP') {
      onOpenMap();
    } else {
      onCloseMap();
    }

    toast.success(`✓ Loaded Preset: ${preset.name}`);
  }

  /**
   * Performs standard challenge success pipeline for developers
   */
  static completeCurrentChallenge(progress, completeChallenge, addItem, setGameState) {
    const currentChallenge = SQL_CHALLENGES.find(c => c.id === progress.currentChallengeId);
    if (!currentChallenge) {
      toast.error('⚠️ Active challenge not found!');
      return;
    }

    // Add item rewards if any
    if (currentChallenge.rewards?.item) {
      addItem(currentChallenge.rewards.item);
    }

    // Run standard challenge success callback
    completeChallenge(
      currentChallenge.id,
      currentChallenge.rewards,
      currentChallenge.nextChallengeId
    );

    // Push into Reward page state
    setGameState('REWARD');
    toast.success(`✓ Challenge [${currentChallenge.id}] solved!`);
  }

  /**
   * Spawns an item with visual confirmation
   */
  static giveItem(itemId, addItem, itemName) {
    addItem(itemId);
    toast.success(`✓ Spawned: ${itemName}`);
  }

  /**
   * Clears inventory context with confirmation
   */
  static resetInventory(clearInventory) {
    clearInventory();
    toast.success('✓ Inventory Cleared');
  }

  /**
   * Adjusts coins with visual confirmation
   */
  static addGold(amount, adjustCoins) {
    adjustCoins(amount);
    toast.success(`✓ Added ${amount} Gold`);
  }

  /**
   * Resets coins back to zero
   */
  static clearGold(currentCoins, adjustCoins) {
    adjustCoins(-currentCoins);
    toast.success('✓ Gold Reset to 0');
  }
}
