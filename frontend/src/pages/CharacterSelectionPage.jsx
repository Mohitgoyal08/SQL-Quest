import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterCard from '../components/game/CharacterCard';

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

  const handleBeginAdventure = () => {
    if (!selectedHero) return;

    const selected = CHARACTERS.find(
        (c) => c.id === selectedHero
    );

    if (!selected) return;

    const profile = {
        name: selected.name,
        avatar: selected.id,
    };

    console.log("Starting adventure:", profile);

    if (typeof onComplete === "function") {
        onComplete(profile);
    }
};

  const selectedHeroData = CHARACTERS.find((c) => c.id === selectedHero);

  return (
    <div className="flex flex-col w-full select-none py-2" role="radiogroup" aria-label="Choose Your Hero">
      {/* Page Heading & Subtitle */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-pirate-charcoal tracking-wide">
          Choose Your Hero
        </h2>
        <p className="text-xs sm:text-sm font-sans font-bold text-pirate-leather mt-1">
          Every legend begins with a captain.
        </p>
      </div>

      {/* Responsive Grid: Equal Height Cards via items-stretch */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 items-stretch">
        {CHARACTERS.map((char) => (
          <CharacterCard
            key={char.id}
            character={char}
            isSelected={selectedHero === char.id}
            onSelect={setSelectedHero}
          />
        ))}
      </div>

      {/* Bottom Footer Section: Confirmation & Action Button */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        {/* Animated Confirmation Message */}
        <div className="h-6 mb-3 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {selectedHeroData && (
              <motion.p
                key={selectedHeroData.id}
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="text-xs sm:text-sm font-sans font-extrabold text-pirate-charcoal tracking-wide bg-parchment/80 px-4 py-1 rounded-full border border-pirate-leather/20 shadow-xs"
              >
                You have chosen <span className="text-ocean-deep underline decoration-gold decoration-2">{selectedHeroData.name}</span>.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Primary Action Button */}
        <motion.button
          type="button"
          disabled={!selectedHero}
          onClick={handleBeginAdventure}
          whileHover={selectedHero ? { y: -2 } : {}}
          whileTap={selectedHero ? { scale: 0.97, y: 2 } : {}}
          className={`w-full py-4 px-8 rounded-2xl font-display font-extrabold text-lg sm:text-xl uppercase tracking-wider transition-all duration-200 flex items-center justify-center shadow-md ${
            selectedHero
              ? 'bg-gold hover:bg-gold-shimmer text-pirate-charcoal border-b-[5px] border-gold-dark cursor-pointer active:border-b-0 shadow-[0_6px_16px_rgba(255,200,55,0.4)]'
              : 'bg-pirate-leather/20 text-pirate-charcoal/40 border-b-[5px] border-pirate-leather/30 cursor-not-allowed'
          }`}
        >
          Begin Adventure
        </motion.button>
      </div>
    </div>
  );
}