import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioService } from '../../services/AudioService';

export default function ShipRevealCinematic({ onComplete }) {
  const [step, setStep] = useState(1); // Steps: 1: Promotion, 2: Dialogue, 3: Naming, 4: Reveal
  const [shipName, setShipName] = useState('');

  useEffect(() => {
    AudioService.playSuccess();
  }, []);

  const handleConfirmName = (e) => {
    e.preventDefault();
    AudioService.playClick();
    if (!shipName.trim()) {
      setShipName('The Query Sloop');
    }
    setStep(4);
  };

  const handleSetSail = () => {
    AudioService.playClick();
    const finalName = shipName.trim() || 'The Query Sloop';
    onComplete(finalName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 select-none">
      <AnimatePresence mode="wait">
        
        {/* Step 1: Promotion Badge */}
        {step === 1 && (
          <motion.div
            key="promotion"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Cinematic light rays behind promotion badge */}
            <motion.div 
              animate={{ rotate: 360, opacity: [0.3, 0.6, 0.3] }}
              transition={{ rotate: { repeat: Infinity, duration: 20, ease: "linear" }, opacity: { repeat: Infinity, duration: 4 } }}
              className="absolute inset-0 z-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(245,158,11,0.2)_45deg,transparent_90deg,rgba(245,158,11,0.2)_135deg,transparent_180deg,rgba(245,158,11,0.2)_225deg,transparent_270deg,rgba(245,158,11,0.2)_315deg,transparent_360deg)] opacity-40 blur-xl pointer-events-none"
            />

            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-8xl mb-6 block filter drop-shadow-lg"
            >
              ⚓
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-black text-amber-500 uppercase tracking-widest leading-none mb-6 font-serif filter drop-shadow-md">
              YOU ARE NOW A CAPTAIN
            </h1>
            <p className="text-sm text-[#ebd9b4] opacity-80 uppercase tracking-widest max-w-sm mx-auto mb-8 font-mono leading-relaxed">
              Your deeds at Tutorial Harbor have cleared the docks and earned you a command.
            </p>
            <button
              onClick={() => {
                AudioService.playClick();
                setStep(2);
              }}
              className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-900 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Step Forward ➔
            </button>
          </motion.div>
        )}

        {/* Step 2: Barnaby's Lore Dialogue */}
        {step === 2 && (
          <motion.div
            key="dialogue"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-2xl p-6 md:p-8 shadow-2xl relative text-center"
            style={{
              backgroundImage: 'radial-gradient(circle, #fdf6e2 60%, #ebd9b4 100%)',
              boxShadow: 'inset 0 0 35px rgba(92,68,36,0.2), 0 25px 50px rgba(0,0,0,0.5)'
            }}
          >
            <div className="w-16 h-16 bg-[#ebd9b4] border-2 border-[#8c6b3e] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
              🛠️
            </div>
            <h3 className="text-base font-black text-[#5c4424] uppercase tracking-wider mb-3">
              Old Barnaby
            </h3>
            <div className="w-12 h-0.5 bg-[#8c6b3e] mx-auto mb-4" />
            <p className="text-sm md:text-base text-amber-950 font-bold leading-relaxed mb-6 italic max-w-sm mx-auto">
              "Take good care of her... she carried legends before you."
            </p>
            <button
              onClick={() => {
                AudioService.playClick();
                setStep(3);
              }}
              className="px-6 py-3 bg-[#8c6b3e] hover:bg-[#5c4424] text-[#fdf6e2] font-black text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
            >
              Claim the Deed
            </button>
          </motion.div>
        )}

        {/* Step 3: Naming the Ship */}
        {step === 3 && (
          <motion.div
            key="naming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-2xl p-6 md:p-8 shadow-2xl text-center"
            style={{
              backgroundImage: 'radial-gradient(circle, #fdf6e2 60%, #ebd9b4 100%)',
              boxShadow: 'inset 0 0 35px rgba(92,68,36,0.2), 0 25px 50px rgba(0,0,0,0.5)'
            }}
          >
            <span className="text-4xl mb-3 block">📜</span>
            <h2 className="text-2xl font-black text-[#5c4424] uppercase tracking-wider mb-2 font-serif">
              Deed of Registry
            </h2>
            <p className="text-xs text-amber-900/80 font-semibold mb-6">
              Write the name that will be whispered across the SQL Seas.
            </p>
            
            <form onSubmit={handleConfirmName} className="space-y-4">
              <input
                type="text"
                maxLength={20}
                placeholder="The SELECT Sloop"
                value={shipName}
                onChange={(e) => setShipName(e.target.value)}
                className="w-full px-4 py-3 bg-[#ebd9b4]/50 border-2 border-[#8c6b3e] rounded-xl text-center text-sm font-bold text-[#5c4424] placeholder-amber-900/40 focus:outline-none focus:ring-4 focus:ring-amber-500/30"
              />
              
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-900 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                Inscribe the Name
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 4: Sloop Reveal Cinematic */}
        {step === 4 && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col items-center max-w-lg w-full text-center"
          >
            {/* Confetti Celebration Layer (Phase 4) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  initial={{ y: -100, x: Math.random() * window.innerWidth, rotate: 0 }}
                  animate={{ y: window.innerHeight + 100, x: `+=${Math.random() * 200 - 100}`, rotate: 360 }}
                  transition={{ duration: 3 + Math.random() * 4, delay: Math.random() * 2, repeat: Infinity }}
                  className={`absolute w-3 h-3 ${['bg-amber-400', 'bg-red-500', 'bg-white', 'bg-blue-400'][i % 4]} shadow-sm`}
                />
              ))}
            </div>

            {/* The Ship Paper Unfurl with Camera Shake */}
            <motion.div
              initial={{ scaleX: 0.1, scaleY: 0.1, rotate: -5 }}
              animate={{ 
                scaleX: 1, 
                scaleY: 1, 
                rotate: [ -5, 2, -1, 1, 0 ],
                x: [0, -10, 10, -10, 10, 0], // Camera shake effect
                y: [0, 5, -5, 5, -5, 0]
              }}
              transition={{ duration: 1.5, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/3] bg-[#ebd9b4] border-8 border-double border-[#5c4424] rounded shadow-2xl p-6 flex flex-col items-center justify-center overflow-hidden z-10"
              style={{
                backgroundImage: 'radial-gradient(circle, #fdf6e2 40%, #ebd9b4 100%)',
                boxShadow: 'inset 0 0 45px rgba(92,68,36,0.35), 0 25px 50px rgba(0,0,0,0.6)'
              }}
            >
              {/* Cloud drifts and water visual decorations */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,246,226,0.3)_0%,transparent_80%)] pointer-events-none" />
              
              {/* Ship Animation Container */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="flex flex-col items-center"
              >
                {/* Ship icon floating */}
                <motion.span
                  animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="text-8xl filter drop-shadow-xl mb-4 block"
                >
                  ⛵
                </motion.span>
                
                <h2 className="text-xl font-bold text-[#8c6b3e] uppercase tracking-widest leading-none mb-1 font-mono">
                  Sloop Commissioned
                </h2>
                
                {/* User ship name displayed */}
                <h1 className="text-3xl md:text-4xl font-black text-[#5c4424] uppercase tracking-wider leading-tight mb-4 font-serif filter drop-shadow-sm border-y-2 border-[#8c6b3e]/40 py-2 w-72">
                  {shipName.trim() || 'The Query Sloop'}
                </h1>
                
                <p className="text-xs text-amber-950 font-bold max-w-xs italic uppercase tracking-wider opacity-85">
                  "Weathered sails and sturdy logs. She will grow alongside your queries."
                </p>
              </motion.div>

              {/* Red Wax Seal */}
              <motion.div
                initial={{ scale: 3, opacity: 0, rotate: 45 }}
                animate={{ scale: 1, opacity: 0.9, rotate: 10 }}
                transition={{ delay: 1.6, type: "spring", stiffness: 100 }}
                className="absolute bottom-4 right-4 w-12 h-12 bg-red-700 rounded-full flex items-center justify-center border border-red-950 shadow-md rotate-12 pointer-events-none text-white text-xs font-black font-serif"
                title="Deed Seal Approved"
              >
                ⚓
              </motion.div>
            </motion.div>

            {/* Set Sail action button */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.5 }}
              onClick={handleSetSail}
              className="mt-6 px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-900 font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-95 cursor-pointer hover:shadow-amber-900/30"
            >
              ⚓ Set Sail
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
