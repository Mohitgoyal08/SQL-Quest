import React from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';

export default function TypewriterText({ text }) {
  const { displayedText, isFinished } = useTypewriter(text);

  return (
    <p className="text-lg md:text-xl text-amber-950 font-medium leading-relaxed select-none">
      {displayedText}
    </p>
  );
}