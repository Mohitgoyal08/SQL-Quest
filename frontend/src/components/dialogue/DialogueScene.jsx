import React, { useState, useEffect, useCallback, useRef } from 'react';
import DialogueBox from './DialogueBox';

export default function DialogueScene({ dialogue = [], onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  
  const finishTypingRef = useRef(null);
  const isTypingFinishedRef = useRef(isTypingFinished);

  // Synchronize ref with state to prevent stale closures in event listeners
  useEffect(() => {
    isTypingFinishedRef.current = isTypingFinished;
  }, [isTypingFinished]);

  useEffect(() => {
    setIsTypingFinished(false);
  }, [currentIndex]);

  const handleTypingComplete = useCallback(() => {
    setIsTypingFinished(true);
  }, []);

  const registerFinishHandler = useCallback((fn) => {
    finishTypingRef.current = fn;
  }, []);

  if (!dialogue || dialogue.length === 0) {
    return null;
  }

  const currentDialogue = dialogue[currentIndex];

  const handleNextLine = useCallback(() => {
    if (currentIndex < dialogue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  }, [currentIndex, dialogue.length, onComplete]);

  // Unified controller reading dynamically from fresh refs
  const handleInteraction = useCallback(() => {
    if (!isTypingFinishedRef.current) {
      if (typeof finishTypingRef.current === 'function') {
        finishTypingRef.current();
      }
    } else {
      handleNextLine();
    }
  }, [handleNextLine]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Enter' || event.code === 'Space') {
        event.preventDefault();
        handleInteraction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleInteraction]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <DialogueBox
        dialogue={currentDialogue}
        onContinue={handleInteraction}
        canContinue={isTypingFinished}
        onTypingComplete={handleTypingComplete}
        registerFinishHandler={registerFinishHandler}
      />
    </div>
  );
}