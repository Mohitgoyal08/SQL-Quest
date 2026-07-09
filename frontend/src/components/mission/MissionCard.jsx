import React from 'react';
import { motion } from 'framer-motion';
import MissionHeader from './MissionHeader';
import MissionObjectiveList from './MissionObjectiveList';
import MissionRewardPreview from './MissionRewardPreview';
import MissionActions from './MissionActions';

export default function MissionCard({ mission, onAccept, onDecline }) {
  if (!mission) return null;

  const { title, npc, difficultyKey, description, objectives, rewards } = mission;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="relative max-w-2xl w-full bg-[#fdf6e2] border-8 border-double border-[#8c6b3e] rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-6 md:p-8 flex flex-col justify-between overflow-hidden"
      style={{ backgroundImage: 'radial-gradient(circle at top right, #fffdf8, #fdf6e2)' }}
    >
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#8c6b3e] rounded-tl-xl opacity-30 m-2"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#8c6b3e] rounded-tr-xl opacity-30 m-2"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#8c6b3e] rounded-bl-xl opacity-30 m-2"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#8c6b3e] rounded-br-xl opacity-30 m-2"></div>

      <div className="relative z-10">
        <MissionHeader
          title={title}
          npc={npc}
          difficultyKey={difficultyKey}
        />

        <p className="text-base md:text-lg text-amber-950 font-medium leading-relaxed my-4">
          {description}
        </p>

        <MissionObjectiveList objectives={objectives} />

        <MissionRewardPreview rewards={rewards} />
      </div>

        <MissionActions
          onAccept={onAccept}
          onDecline={onDecline}
        />
    </motion.div>
  );
}