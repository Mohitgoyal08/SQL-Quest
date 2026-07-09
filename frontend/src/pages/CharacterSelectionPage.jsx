import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterCard from '../components/game/CharacterCard';
import { AudioService } from '../services/AudioService';

const CHARACTERS = [
  {
    id: 'pirate-boy',
    name: 'Pirate Boy',
    description: 'A bold young explorer recruited by the Guild to sail uncharted waters and recover the shattered fragments of the legendary SQL Codex.',
  },
  {
    id: 'pirate-girl',
    name: 'Pirate Girl',
    description: 'A fearless navigator determined to chart the forgotten islands and restore the lost records of the SQL Kingdom to their former glory.',
  },
  {
    id: 'wizard',
    name: 'Wizard',
    description: 'An arcane scholar seeking the ancient wisdom bound within the lost Codex, driven to unveil the mysteries hidden across the distant seas.',
  },
  {
    id: 'archer',
    name: 'Archer',
    description: 'A sharp-eyed wanderer from the dense island forests, venturing across the ocean to track down the scattered pieces of the grand archive.',
  },
  {
    id: 'knight',
    name: 'Knight',
    description: 'A stalwart defender sworn to safeguard the expedition as it journeys through perilous waters to rebuild the great data realm.',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'An intrepid seeker of ancient ruins, dedicating their life to unearthing the forgotten lore inscribed within the lost SQL Codex.',
  },
];

export default function CharacterSelectionPage({ onComplete }) {
  const [selectedHero, setSelectedHero] = useState(null);
  const [characterName, setCharacterName] = useState("");

  const handleBeginAdventure = () => {
    if (!selectedHero) return;
    AudioService.playSuccess();

    const selected = CHARACTERS.find(
        (c) => c.id === selectedHero
    );

    if (!selected) return;

    const finalName = characterName.trim() || selected.name;

    const profile = {
        name: finalName,
        avatar: selected.id,
    };

    console.log("Starting adventure:", profile);

    if (typeof onComplete === "function") {
        onComplete(profile);
    }
};

  const selectedHeroData = CHARACTERS.find((c) => c.id === selectedHero);

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-[#38bdf8] select-none py-8 px-4" role="radiogroup" aria-label="Choose Your Hero">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7dd3fc] to-[#38bdf8]" />
        {/* Cartoon Clouds */}
        <div className="absolute top-10 left-[-20%] w-[150%] h-40 opacity-70 animate-[slide_120s_linear_infinite]" style={{ backgroundImage: 'radial-gradient(circle, #fff 20%, transparent 60%)', backgroundSize: '150px 100px', backgroundRepeat: 'repeat-x' }} />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#0284c7] to-[#0369a1]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col h-full">
        {/* Page Heading & Subtitle */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#fef08a] font-display tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]" style={{ WebkitTextStroke: '2px #713f12' }}>
            Choose Your Hero
          </h2>
          <p className="text-lg sm:text-xl font-bold text-white mt-2 drop-shadow-md">
            Every legend begins with a captain.
          </p>
        </div>

        {/* Responsive Grid: Equal Height Cards via items-stretch */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 items-stretch flex-1">
          {CHARACTERS.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              isSelected={selectedHero === char.id}
              onSelect={(id) => {
                AudioService.playClick();
                setSelectedHero(id);
              }}
            />
          ))}
        </div>

        {/* Bottom Footer Section: Confirmation & Action Button */}
        <div className="w-full max-w-sm mx-auto flex flex-col items-center mt-auto sticky bottom-4 z-20 pb-4">
          {/* Animated Confirmation Message */}
          <div className="h-10 mb-4 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {selectedHeroData && (
                <motion.p
                  key={selectedHeroData.id}
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm sm:text-base font-bold text-white bg-[#1e40af] px-6 py-2 rounded-full border-2 border-[#60a5fa] shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
                >
                  You have chosen <span className="text-[#fef08a]">{selectedHeroData.name}</span>.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full mb-6 relative">
            <input 
              type="text" 
              placeholder={selectedHeroData ? `${selectedHeroData.name}'s Name...` : "Enter Captain's Name..."} 
              value={characterName} 
              onChange={(e) => setCharacterName(e.target.value)}
              className="w-full bg-[#1e293b]/80 border-2 border-[#475569] rounded-xl px-4 py-3 text-white text-lg font-bold placeholder-slate-400 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/50 transition-all text-center"
              maxLength={20}
              disabled={!selectedHero}
            />
          </div>

          {/* Primary Action Button */}
          <motion.button
            type="button"
            disabled={!selectedHero}
            onClick={handleBeginAdventure}
            whileHover={selectedHero ? { scale: 1.05, y: -2 } : {}}
            whileTap={selectedHero ? { scale: 0.95, y: 2 } : {}}
            className={`w-full py-5 rounded-[20px] font-black text-xl sm:text-2xl uppercase transition-all duration-200 flex items-center justify-center ${
              selectedHero
                ? 'bg-gradient-to-b from-[#22c55e] to-[#16a34a] text-white border-4 border-[#14532d] shadow-[0_8px_0_#166534,0_15px_20px_rgba(0,0,0,0.4)] cursor-pointer active:translate-y-2 active:shadow-[0_0px_0_#166534,0_5px_10px_rgba(0,0,0,0.4)]'
                : 'bg-slate-300 text-slate-500 border-4 border-slate-400 cursor-not-allowed opacity-70'
            }`}
          >
            <span style={selectedHero ? { WebkitTextStroke: '1px #14532d' } : {}} className="drop-shadow-sm flex items-center gap-2">
              <span>⚔️</span> Begin Adventure
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}