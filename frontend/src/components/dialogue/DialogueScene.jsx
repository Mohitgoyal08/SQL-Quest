import React, { useState, useEffect, useCallback, useRef } from 'react';
import DialogueBox from './DialogueBox';
import { useDialogueState } from '../../hooks/useDialogueState';

export default function DialogueScene({ dialogue = [], onComplete }) {
  const {
    currentDialogue,
    currentIndex,
    next,
    reset,
    isFinished,
  } = useDialogueState(dialogue);

  const [isTypingFinished, setIsTypingFinished] = useState(false);

  const finishTypingRef = useRef(null);
  const isTypingFinishedRef = useRef(isTypingFinished);

  // Keep typing state synchronized
  useEffect(() => {
    isTypingFinishedRef.current = isTypingFinished;
  }, [isTypingFinished]);

  // Reset typing whenever dialogue line changes
  useEffect(() => {
    setIsTypingFinished(false);
  }, [currentIndex]);

  // Reset dialogue when a completely new conversation is loaded
  useEffect(() => {
    reset();
  }, [dialogue, reset]);

  // Observe dialogue completion
  useEffect(() => {
    if (isFinished && typeof onComplete === 'function') {
      onComplete();
    }
  }, [isFinished, onComplete]);

  const handleTypingComplete = useCallback(() => {
    setIsTypingFinished(true);
  }, []);

  const registerFinishHandler = useCallback((fn) => {
    finishTypingRef.current = fn;
  }, []);

  if (!dialogue || dialogue.length === 0 || !currentDialogue) {
    return null;
  }

  const handleInteraction = useCallback(() => {
    if (!isTypingFinishedRef.current) {
      if (typeof finishTypingRef.current === 'function') {
        finishTypingRef.current();
      }
    } else {
      next();
    }
  }, [next]);

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