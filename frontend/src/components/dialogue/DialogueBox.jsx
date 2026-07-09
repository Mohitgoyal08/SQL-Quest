import React from 'react';
import CharacterPortrait from './CharacterPortrait';
import TypewriterText from './TypewriterText';
import ContinueIndicator from './ContinueIndicator';

export default function DialogueBox({
  dialogue,
  onContinue,
  canContinue = true,
  onTypingComplete,
  registerFinishHandler
}) {
  const {
    speaker,
    portrait,
    emotion,
    text,
  } = dialogue;

  return (
    <div 
      className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 md:p-8 max-w-3xl w-full bg-[#fdf6e2] border-8 border-double border-[#8c6b3e] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative"
      style={{ backgroundImage: 'radial-gradient(circle, #fdf6e2 40%, #ebd9b4 100%)', boxShadow: 'inset 0 0 40px rgba(140,107,62,0.2), 0 20px 50px rgba(0,0,0,0.8)' }}
    >
      {/* Left: Portrait Placeholder */}
      <div className="flex-shrink-0">
        <CharacterPortrait portrait={portrait} emotion={emotion} />
      </div>

      {/* Right: Text and Controls */}
      <div className="flex flex-col flex-grow justify-between min-h-[8rem] w-full">
        <div>
          <h3 className="text-sm md:text-md font-black uppercase tracking-[0.25em] text-[#5c4424] mb-3 select-none border-b-2 border-[#8c6b3e]/30 pb-2">
            {speaker}
          </h3>
          <TypewriterText 
            text={text} 
            onTypingComplete={onTypingComplete}
            registerFinishHandler={registerFinishHandler}
          />
        </div>

        <div className="flex justify-end mt-4">
          <ContinueIndicator onContinue={onContinue} disabled={!canContinue} />
        </div>
      </div>
    </div>
  );
}