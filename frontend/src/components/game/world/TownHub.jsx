import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORLD_LOCATION_CONFIG } from '../../../config/worldLocationConfig';

export default function TownHub({ islandId, progress, onOpenMap, onStartQuest, onOpenShop }) {
  const config = WORLD_LOCATION_CONFIG[islandId];
  const [selectedNode, setSelectedNode] = useState(null);
  const [seagullsCount, setSeagullsCount] = useState(3);
  const [hoveredNode, setHoveredNode] = useState(null);

  if (!config) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 text-[#ebd9b4] text-sm">
        🗺️ Island Hub Config not found.
      </div>
    );
  }

  const handleNodeClick = (node) => {
    if (node.id === 'quincy') {
      setSelectedNode({
        ...node,
        customAction: {
          label: 'Browse Cargo Exchange',
          handler: () => {
            setSelectedNode(null);
            onOpenShop();
          }
        }
      });
      return;
    }
    if (node.id === 'dockyard') {
      onOpenMap();
      return;
    }
    if (node.id === 'marlowe') {
      // Allow speaking or just inspecting
      setSelectedNode({
        ...node,
        customAction: {
          label: 'Speak (Begin Quest)',
          handler: () => {
            setSelectedNode(null);
            onStartQuest();
          }
        }
      });
      return;
    }
    
    // Default detail card popup for buildings/NPCs
    let text = node.description;
    if (node.id === 'crier') {
      text = `"📢 Extra! Extra! The Merchant Guild Cargo Ledger is locked up tight! Old Barnaby demands a new captain to set sail! Marlowe pulls his hair out in the square!"`;
    }
    
    setSelectedNode({
      ...node,
      descriptionText: text
    });
  };

  return (
    <div 
      className="flex-1 flex flex-col relative overflow-hidden select-none p-4 md:p-6"
      style={config.backgroundStyle}
    >
      {/* Decorative Outer Border */}
      <div className="absolute inset-4 border-4 border-double border-[#8c6b3e]/60 rounded-2xl pointer-events-none z-10" />

      {/* Header Town Badge */}
      <div className="mx-auto bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-xl px-6 py-2 shadow-md z-20 mt-2 text-center max-w-sm">
        <h2 className="text-xl font-black text-[#5c4424] uppercase tracking-widest font-serif leading-none">
          {config.islandName}
        </h2>
        <span className="text-[10px] font-bold text-[#8c6b3e] uppercase tracking-widest block mt-1">
          📍 Free Exploration Mode
        </span>
      </div>

      {/* Interactive Map Canvas */}
      <div className="flex-1 relative mt-4 bg-[#ebd9b4]/20 border-2 border-dashed border-[#8c6b3e]/40 rounded-2xl overflow-hidden shadow-inner">
        {/* Parallax Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(140,107,62,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(140,107,62,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

        {/* Ambient Smoke from Tavern Chimney */}
        <div className="absolute top-[20%] right-[18%] z-10 pointer-events-none">
          <motion.div
            animate={{ y: [-10, -30], x: [0, 5, -5, 0], scale: [0.8, 1.5], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="w-4 h-4 rounded-full bg-slate-400/40 blur-xs"
          />
          <motion.div
            animate={{ y: [-5, -25], x: [0, -3, 3, 0], scale: [0.6, 1.2], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 1.5 }}
            className="w-3 h-3 rounded-full bg-slate-300/40 blur-xs"
          />
        </div>

        {/* Ambient Market Stall Shouts (floating above marlowe/crier region) */}
        <div className="absolute top-[40%] left-[30%] pointer-events-none z-10">
          <motion.div
            animate={{ y: [0, -8, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="px-2.5 py-1 bg-[#fdf6e2]/80 border border-[#8c6b3e]/40 rounded-lg text-[9px] font-bold text-amber-900 uppercase tracking-widest shadow-sm"
          >
            📢 "Gold rates steady! Port audits due!"
          </motion.div>
        </div>

        {/* Squawking Seagulls */}
        {Array.from({ length: seagullsCount }).map((_, idx) => (
          <motion.div
            key={idx}
            className="absolute z-20 text-xl cursor-pointer pointer-events-auto"
            style={{ left: `${25 + idx * 20}%`, top: `${15 + idx * 8}%` }}
            whileHover={{ scale: 1.15 }}
            onClick={(e) => {
              e.stopPropagation();
              setSeagullsCount((prev) => prev - 1);
            }}
          >
            🐦
          </motion.div>
        ))}

        {/* Hotspot Location Nodes */}
        {config.nodes.map((node) => {
          const isUnlocked = node.id !== 'warehouse' && node.id !== 'tavern';
          const isHovered = hoveredNode === node.id;
          
          return (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
              style={{ left: node.x, top: node.y }}
            >
              {/* Tooltip hovering bubble */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: -10 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute bottom-16 bg-[#fdf6e2] border-2 border-[#8c6b3e] px-2.5 py-1 rounded shadow-md text-[9px] font-black text-[#5c4424] uppercase tracking-widest whitespace-nowrap pointer-events-none"
                  >
                    {node.name}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Node Icon Container */}
              <button
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`relative group w-14 h-14 rounded-full border-4 flex items-center justify-center text-2xl shadow-lg transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-[#ebd9b4] border-[#8c6b3e] hover:bg-[#dfcb9f] hover:scale-110 cursor-pointer'
                    : 'bg-gray-400/50 border-gray-600/40 cursor-pointer hover:border-red-400'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute -top-1 -right-1 bg-red-800 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#fdf6e2] text-[9px] font-bold shadow-sm">
                    🔒
                  </div>
                )}
                
                {/* Specific glow for Marlowe to invite interaction */}
                {node.id === 'marlowe' && (
                  <div className="absolute inset-0 rounded-full animate-ping border-2 border-amber-500/40 pointer-events-none" />
                )}

                <span>{node.icon}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Parchment Detail Popup Card */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNode(null)}
            className="absolute inset-0 bg-[#000]/70 flex items-center justify-center p-4 z-40"
          >
            <div 
              className="w-full max-w-sm bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-2xl p-6 shadow-2xl relative text-center"
              style={{
                backgroundImage: 'radial-gradient(circle, #fdf6e2 60%, #ebd9b4 100%)',
                boxShadow: 'inset 0 0 30px rgba(92,68,36,0.15)'
              }}
              onClick={(e) => e.stopPropagation()} // Prevent close on body click
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-[#ebd9b4] border border-[#8c6b3e] rounded-full flex items-center justify-center text-xs font-black text-[#5c4424] cursor-pointer hover:bg-[#dfcb9f]"
              >
                ✕
              </button>

              <span className="text-4xl mb-2 block">{selectedNode.icon}</span>
              <h3 className="text-lg font-black text-[#5c4424] uppercase tracking-wider mb-1 font-serif">
                {selectedNode.name}
              </h3>
              <div className="w-16 h-0.5 bg-[#8c6b3e] mx-auto mb-3" />
              
              <p className="text-xs text-amber-950/80 font-bold uppercase tracking-wider leading-relaxed mb-6 italic max-w-xs mx-auto">
                {selectedNode.descriptionText || selectedNode.description}
              </p>

              {selectedNode.customAction ? (
                <button
                  onClick={selectedNode.customAction.handler}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-900 font-black text-[10px] uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                >
                  {selectedNode.customAction.label}
                </button>
              ) : (
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-6 py-2.5 bg-[#8c6b3e] hover:bg-[#5c4424] text-[#fdf6e2] border-2 border-[#5c4424] font-black text-[10px] uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                >
                  Return to Square
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
