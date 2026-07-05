import React from 'react';
import DialogueScene from './components/dialogue/DialogueScene';
import { tutorialDialogue } from './data/dialogue/tutorial';

export default function App() {
  const handleDialogueComplete = () => {
    console.log("Dialogue Complete");
  };

  return (
    <main className="w-screen h-screen bg-slate-900 flex items-center justify-center">
      <DialogueScene
        dialogue={tutorialDialogue}
        onComplete={handleDialogueComplete}
      />
    </main>
  );
}