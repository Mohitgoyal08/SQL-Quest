import React, { useState } from 'react';
import DialogueBox from './DialogueBox';

export default function DialogueScene({ dialogue = [], onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!dialogue || dialogue.length === 0) {
    return null;
  }

  const currentDialogue = dialogue[currentIndex];

  const handleAdvance = () => {
    if (currentIndex < dialogue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <DialogueBox
        dialogue={currentDialogue}
        onContinue={handleAdvance}
        canContinue={true}
      />
    </div>
  );
}