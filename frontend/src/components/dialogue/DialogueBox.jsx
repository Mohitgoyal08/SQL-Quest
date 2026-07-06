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
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 max-w-2xl w-full bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-xl shadow-2xl">
      {/* Left: Portrait Placeholder */}
      <div className="flex-shrink-0">
        <CharacterPortrait portrait={portrait} emotion={emotion} />
      </div>

      {/* Right: Text and Controls */}
      <div className="flex flex-col flex-grow justify-between min-h-[8rem] w-full">
        <div>
          <h3 className="text-md font-bold uppercase tracking-widest text-[#8c6b3e] mb-2 select-none">
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