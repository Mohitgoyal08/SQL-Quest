import { useState, useEffect, useRef, useCallback } from 'react';

export function useTypewriter(text = '', speed = 30) {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  
  const intervalRef = useRef(null);

  const finishImmediately = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayedText(text);
    setIsFinished(true);
  }, [text]);

  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!text) {
      setDisplayedText('');
      setIsFinished(true);
      return;
    }

    if (text.length <= 1) {
      setDisplayedText(text);
      setIsFinished(true);
      return;
    }

    let currentIndex = 1;
    setDisplayedText(text.slice(0, 1));
    setIsFinished(false);

    intervalRef.current = setInterval(() => {
      currentIndex++;
      setDisplayedText(text.slice(0, currentIndex));

      if (currentIndex >= text.length) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsFinished(true);
      }
    }, speed);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, speed]);

  return { displayedText, isFinished, finishImmediately };
}