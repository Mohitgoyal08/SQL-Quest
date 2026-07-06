import React, { useEffect } from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';

export default function TypewriterText({ 
  text, 
  onTypingComplete, 
  registerFinishHandler 
}) {
  const { displayedText, isFinished, finishImmediately } = useTypewriter(text);

  useEffect(() => {
    if (typeof registerFinishHandler === 'function') {
      registerFinishHandler(finishImmediately);
    }
  }, [registerFinishHandler, finishImmediately]);

  useEffect(() => {
    if (isFinished && typeof onTypingComplete === 'function') {
      onTypingComplete();
    }
  }, [isFinished, onTypingComplete]);

  return (
    <p className="text-lg md:text-xl text-amber-950 font-medium leading-relaxed select-none">
      {displayedText}
    </p>
  );
}