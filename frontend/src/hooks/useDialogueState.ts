// ===== Sprint 10.1 Dialogue State Engine =====
import { useState, useCallback } from 'react';

export const useDialogueState = <T,>(
  lines: T[],
  initialIndex: number = 0
) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFinished, setIsFinished] = useState(false);

  const hasNext = currentIndex < lines.length - 1;
  const hasPrevious = currentIndex > 0;

  const next = useCallback(() => {
    if (hasNext) {
      setCurrentIndex(prev => prev + 1);
    } else if (!isFinished) {
      setIsFinished(true);
    }
  }, [hasNext, isFinished]);

  const previous = useCallback(() => {
    if (hasPrevious) {
      setCurrentIndex(prev => prev - 1);
      setIsFinished(false);
    }
  }, [hasPrevious]);

  const reset = useCallback((newInitialIndex = 0) => {
    setCurrentIndex(newInitialIndex);
    setIsFinished(false);
  }, []);

  // ✅ Renamed from currentLine
  const currentDialogue = lines[currentIndex] ?? null;

  return {
    currentDialogue,
    currentIndex,
    next,
    previous,
    reset,
    hasNext,
    hasPrevious,
    isFinished,
  };
};