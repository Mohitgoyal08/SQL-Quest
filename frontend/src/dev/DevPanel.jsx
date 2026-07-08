import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_STATES } from '../config/gameStates';
import { SQL_CHALLENGES } from '../data/challenges';
import { ITEM_CATALOG } from '../inventory/data/ItemCatalog';
import { SCENARIO_PRESETS } from './ScenarioLibrary';
import { DevService } from './DevService';
import toast from 'react-hot-toast';

export default function DevPanel({
  progress,
  gameState,
  setGameState,
  worldState,
  adjustCoins,
  addItem,
  clearInventory,
  updateUnlock,
  devApplyState,
  completeChallenge,
  setIsShopOpen,
  onOpenMap,
  onCloseMap,
  setInventoryOpen,
  setIsVoyageCinematicActive,
  setIsShipCinematicActive
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('diagnostics');

  const uniqueIslands = useMemo(() => {
    return Array.from(new Set(SQL_CHALLENGES.map(c => c.islandId).filter(Boolean)));
  }, []);

  const handleResetSave = () => {
    if (window.confirm('Are you sure you want to reset all progress? This will reload the page.')) {
      localStorage.removeItem(import.meta.env.DEV ? 'sql_quest_dev_save' : 'sql_quest_player_save_v2');
      localStorage.removeItem(import.meta.env.DEV ? 'sql_quest_dev_profile' : 'sql_quest_player_profile');
      window.location.reload();
    }
  };

  const totalItemCount = progress.inventory?.length || 0;

  const handleScenarioClick = (key) => {
    DevService.loadScenario(
      key,
      devApplyState,
      setGameState,
      setIsShopOpen,
      onOpenMap,
      onCloseMap,
      setIsVoyageCinematicActive,
      setIsShipCinematicActive,
      setInventoryOpen
    );
  };

  const handleCompleteCurrent = () => {
    DevService.completeCurrentChallenge(progress, completeChallenge, addItem, setGameState);
  };

  const handleSpawnItem = (itemId, itemName) => {
    DevService.giveItem(itemId, addItem, itemName);
  };

  const handleAddGold = (amount) => {
    DevService.addGold(amount, adjustCoins);
  };

  const handleClearGold = () => {
    DevService.clearGold(progress.coins, adjustCoins);
  };

  const handleClearInventory = () => {
    DevService.resetInventory(clearInventory);
  };

  const activeShipName = progress.fleet?.activeShipId && progress.fleet.ships?.[progress.fleet.activeShipId]
    ? progress.fleet.ships[progress.fleet.activeShipId].name
    : 'None';

  return createPortal(
    <>
      {/* Floating Panel Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[9999] px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white font-mono font-black text-[10px] uppercase tracking-widest rounded-full border-2 border-red-500 shadow-2xl cursor-pointer select-none transition-colors"
      >
        🛠️ DevTools
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-96 z-[9998] bg-slate-900 border-l-4 border-red-700 text-slate-100 flex flex-col shadow-2xl font-mono text-[11px] overflow-hidden select-none"
          >
            {/* Title Bar */}
            <div className="bg-slate-950 p-4 border-b border-red-800 flex items-center justify-between">
              <span className="font-bold text-red-500 uppercase tracking-widest text-xs">
                SQL Quest Engine Control
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Tab Selectors */}
            <div className="flex bg-slate-950 border-b border-slate-800 overflow-x-auto text-[9px] shrink-0">
              {['diagnostics', 'presets', 'sandbox', 'ui_previews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-2.5 uppercase font-black cursor-pointer transition-colors ${
                    activeTab === tab
                      ? 'bg-red-950 text-red-400 border-b border-red-500'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Tab Content Panels */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* LIVE DIAGNOSTICS */}
              {activeTab === 'diagnostics' && (
                <div className="space-y-3">
                  <h4 className="text-red-500 font-bold uppercase border-b border-slate-800 pb-1">
                    Diagnostics Monitor
                  </h4>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-slate-300">
                    <span className="text-slate-500">Game State:</span>
                    <span>{gameState || 'NULL'}</span>
                    
                    <span className="text-slate-500">Physical Loc:</span>
                    <span>{progress.unlocks?.merchantIslesVoyaged ? 'Merchant Isles' : 'Tutorial Island'}</span>
                    
                    <span className="text-slate-500">Story Loc:</span>
                    <span className="capitalize">{progress.currentIsland?.replace(/_/g, ' ')}</span>
                    
                    <span className="text-slate-500">Current NPC:</span>
                    <span className="capitalize">{worldState.currentNPC?.replace(/_/g, ' ')}</span>
                    
                    <span className="text-slate-500">Active Challenge:</span>
                    <span>{progress.currentChallengeId}</span>
                    
                    <span className="text-slate-500">Level / XP:</span>
                    <span>Lvl {progress.level} ({progress.xp} XP)</span>
                    
                    <span className="text-slate-500">Gold Balance:</span>
                    <span className="text-amber-400 font-bold">{progress.coins}g</span>
                    
                    <span className="text-slate-500">Items Carried:</span>
                    <span>{totalItemCount} item(s)</span>
                    
                    <span className="text-slate-500">Fleet Active:</span>
                    <span>{progress.fleet?.activeShipId ? `Sloop (${activeShipName})` : 'None'}</span>
                  </div>

                  <h4 className="text-red-500 font-bold uppercase border-b border-slate-800 pb-1 pt-3">
                    Unlock Registry
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <span className="text-slate-500">Sea Chart:</span>
                    <span>{progress.unlocks?.seaChart ? '✅ Unlocked' : '❌ Locked'}</span>
                    
                    <span className="text-slate-500">Sea Chart Seen:</span>
                    <span>{progress.unlocks?.seaChartSeen ? '✅ Yes' : '❌ No'}</span>
                    
                    <span className="text-slate-500">Ship Ownership:</span>
                    <span>{progress.unlocks?.ship ? '✅ Yes' : '❌ No'}</span>
                    
                    <span className="text-slate-500">Voyaged Merchant:</span>
                    <span>{progress.unlocks?.merchantIslesVoyaged ? '✅ Yes' : '❌ No'}</span>
                  </div>

                  <h4 className="text-red-500 font-bold uppercase border-b border-slate-800 pb-1 pt-3">
                    Build Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <span className="text-slate-500">Save Version:</span>
                    <span>V2 (Sandboxed)</span>
                    
                    <span className="text-slate-500">Engine Mode:</span>
                    <span className="text-red-400 font-bold">V1 Development</span>
                  </div>
                </div>
              )}

              {/* SCENARIO PRESETS */}
              {activeTab === 'presets' && (
                <div className="space-y-3">
                  <h4 className="text-red-500 font-bold uppercase border-b border-slate-800 pb-1">
                    Quick-Load Presets (1-Click)
                  </h4>
                  <div className="space-y-2">
                    {Object.keys(SCENARIO_PRESETS).map(key => (
                      <button
                        key={key}
                        onClick={() => handleScenarioClick(key)}
                        className="w-full text-left p-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded transition-all cursor-pointer flex flex-col gap-0.5 group"
                      >
                        <span className="font-bold text-red-400 group-hover:text-red-300">
                          {SCENARIO_PRESETS[key].name}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {SCENARIO_PRESETS[key].description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SANDBOX ACTIONS */}
              {activeTab === 'sandbox' && (
                <div className="space-y-3">
                  <h4 className="text-red-500 font-bold uppercase border-b border-slate-800 pb-1">
                    Progression Presets
                  </h4>
                  <button
                    onClick={handleCompleteCurrent}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                  >
                    Complete Active Challenge (Standard Flow)
                  </button>

                  <h4 className="text-red-500 font-bold uppercase border-b border-slate-800 pb-1 pt-3">
                    Economy Sandbox
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddGold(100)}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      +100 Gold
                    </button>
                    <button
                      onClick={() => handleAddGold(1000)}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      +1000 Gold
                    </button>
                  </div>
                  <button
                    onClick={handleClearGold}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded text-center cursor-pointer font-bold text-slate-400"
                  >
                    Reset Gold to 0
                  </button>

                  <h4 className="text-red-500 font-bold uppercase border-b border-slate-800 pb-1 pt-3">
                    Inventory Sandbox
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {Object.keys(ITEM_CATALOG).map(itemId => (
                      <button
                        key={itemId}
                        onClick={() => handleSpawnItem(itemId, ITEM_CATALOG[itemId].name)}
                        className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-left px-2.5 cursor-pointer flex items-center justify-between text-[10px]"
                      >
                        <span>📦 {ITEM_CATALOG[itemId].name}</span>
                        <span className="text-slate-500 text-[8px] uppercase">
                          {ITEM_CATALOG[itemId].stackable ? 'Stack' : 'Unique'}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleClearInventory}
                    className="w-full py-2 bg-red-950 hover:bg-red-900 border border-red-800 rounded text-center cursor-pointer font-bold text-red-300"
                  >
                    Clear Inventory
                  </button>

                  <div className="pt-4 border-t border-slate-800">
                    <button
                      onClick={handleResetSave}
                      className="w-full py-2 bg-red-950 hover:bg-red-900 border border-red-800 rounded text-center cursor-pointer font-bold text-red-300 animate-pulse"
                    >
                      Reset Save Data
                    </button>
                  </div>
                </div>
              )}

              {/* UI PREVIEWS */}
              {activeTab === 'ui_previews' && (
                <div className="space-y-3">
                  <h4 className="text-red-500 font-bold uppercase border-b border-slate-800 pb-1">
                    Instant Screen Overrides
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setGameState(GAME_STATES.LANDING); toast.success('✓ Render: Landing'); }}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      Landing Page
                    </button>
                    <button
                      onClick={() => { setGameState(GAME_STATES.CHARACTER_SELECTION); toast.success('✓ Render: Char Select'); }}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      Char Select
                    </button>
                    <button
                      onClick={() => { setGameState(GAME_STATES.DIALOGUE); toast.success('✓ Render: Dialogue'); }}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      Dialogue Box
                    </button>
                    <button
                      onClick={() => { setGameState(GAME_STATES.MISSION); toast.success('✓ Render: Mission'); }}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      Mission Card
                    </button>
                    <button
                      onClick={() => { setGameState(GAME_STATES.CHALLENGE); toast.success('✓ Render: Challenge'); }}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      SQL Editor
                    </button>
                    <button
                      onClick={() => { setGameState(GAME_STATES.REWARD); toast.success('✓ Render: Reward'); }}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      Reward Popup
                    </button>
                    <button
                      onClick={() => { setInventoryOpen(true); toast.success('✓ Render: Inventory'); }}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      Inventory
                    </button>
                    <button
                      onClick={() => { onOpenMap(); toast.success('✓ Render: Sea Chart'); }}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      Sea Chart
                    </button>
                    <button
                      onClick={() => { setIsShopOpen(true); toast.success('✓ Render: Shop'); }}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      Open Shop
                    </button>
                    <button
                      onClick={() => { setIsVoyageCinematicActive(true); toast.success('✓ Render: Voyage'); }}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      Voyage Scene
                    </button>
                    <button
                      onClick={() => { setIsShipCinematicActive(true); toast.success('✓ Render: Ship Reveal'); }}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      Ship Reveal
                    </button>
                    <button
                      onClick={() => { setGameState(GAME_STATES.TOWN_HUB); toast.success('✓ Render: Town Hub'); }}
                      className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center cursor-pointer font-bold"
                    >
                      Town Hub
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="bg-slate-950 p-3.5 border-t border-slate-800 text-center text-slate-500 text-[9px] shrink-0">
              Vite Dev Panel | Sandboxed localStorage Active
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
