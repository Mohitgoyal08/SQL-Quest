import React, { useState, useEffect } from 'react';
import { SQLChallenge, ChallengeRewards } from '../../data/challenges';
import { DatabaseBootstrap } from '../../database/DatabaseBootstrap';
import { SQLEngineService } from '../../engine/SQLEngineService';
import { ResultValidator } from '../../engine/ResultValidator';
import { analyzeSQLMistakes } from '../../utils/hintEngine';
import ResultTable from './ResultTable';

interface ChallengePanelProps {
  challenge: SQLChallenge;
  onSuccess: (challengeId: string, rewards: ChallengeRewards, nextId: string | null) => void;
  isAlreadyCompleted: boolean;
}

export const ChallengePanel: React.FC<ChallengePanelProps> = ({
  challenge,
  onSuccess,
  isAlreadyCompleted,
}) => {
  const [query, setQuery] = useState<string>(challenge.starterCode);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [showHints, setShowHints] = useState<boolean>(false);
  
  // SQLite Execution Engine States
  const [queryResult, setQueryResult] = useState<any | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Synchronize state and boot WASM database when switching challenges
  useEffect(() => {
    setQuery(challenge.starterCode);
    setStatus('IDLE');
    setFeedbackMessage('');
    setShowHints(false);
    setQueryResult(null);

    // Pre-warm the WebAssembly SQLite database engine in the background
    DatabaseBootstrap.initialize().catch((err) => {
      console.error('ChallengePanel: SQLite Boot Failed:', err);
    });
  }, [challenge]);

  const handleRunQuery = async () => {
    setIsExecuting(true);
    setStatus('IDLE');
    setFeedbackMessage('');

    try {
      // 1. Ensure schema is bootstrapped and seeded exactly once
      await DatabaseBootstrap.initialize();

      // 2. Execute Player Query against in-memory SQLite
      const playerRes = await SQLEngineService.executeQuery(query);
      setQueryResult(playerRes);

      // 3. Resolve Target Canonical Reference Query
      const referenceSql = challenge.referenceQuery;
      const expectedRes = await SQLEngineService.executeQuery(referenceSql);

      // 4. Determine ordered comparison requirement (ORDER BY / LIMIT / EXACT validation)
      const requiresOrder = 
        challenge.validation?.type === 'EXACT' || 
        /\b(order\s+by|limit)\b/i.test(referenceSql || '');

      // 5. Deep Matrix Result Set Comparison
      const validation = ResultValidator.validate(playerRes, expectedRes, requiresOrder);

      if (validation.isValid) {
        setStatus('SUCCESS');
        setFeedbackMessage(validation.feedback);
        // Trigger orchestrator success pipeline to launch RewardPopup
        onSuccess(challenge.id, challenge.rewards, challenge.nextChallengeId);
      } else {
        setStatus('ERROR');
        // Provide semantic dataset feedback if execution succeeded, or fallback to hint analysis on syntax errors
        const diagnosticText = playerRes.success
          ? validation.feedback
          : analyzeSQLMistakes(query, referenceSql, challenge.hints);
        
        setFeedbackMessage(diagnosticText);
      }
    } catch (err: any) {
      setStatus('ERROR');
      setFeedbackMessage(err.message || 'System fault encountered during query execution.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setQuery(challenge.starterCode);
    setStatus('IDLE');
    setFeedbackMessage('');
    setQueryResult(null);
  };

  return (
    <div className="flex-1 bg-[#fdf6e2] border-4 border-[#8c6b3e] rounded-xl p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto">
      <div>
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#8c6b3e]/40 pb-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8c6b3e]">
              Active Challenge
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#5c4424]">
              {challenge.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isAlreadyCompleted && (
              <span className="px-2.5 py-0.5 bg-emerald-800 text-emerald-100 rounded text-xs font-bold uppercase tracking-wider border border-emerald-600 shadow-inner select-none">
                ✔ Completed
              </span>
            )}
            <span className="px-3 py-1 bg-[#ebd9b4] text-[#5c4424] rounded-full text-xs font-bold uppercase tracking-wider border border-[#8c6b3e]/60 select-none">
              {challenge.difficulty}
            </span>
          </div>
        </div>

        {/* Narrative & Description Block */}
        <div className="bg-[#ebd9b4]/40 border border-[#8c6b3e]/40 p-4 rounded-lg mb-6">
          <p className="text-sm font-semibold text-amber-950/90 italic mb-2">
            "{challenge.story}"
          </p>
          <p className="text-sm md:text-base font-bold text-[#5c4424]">
            Objective: {challenge.description}
          </p>
        </div>

        {/* SQL Editor Area */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#8c6b3e] mb-1">
            SQL Query Editor
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            disabled={isExecuting}
            placeholder="Enter your SQL query here..."
            className="w-full p-3 bg-[#0b1d28] text-emerald-400 font-mono text-sm md:text-base rounded-lg border-2 border-[#8c6b3e] shadow-inner focus:outline-none focus:border-amber-500 resize-y disabled:opacity-60"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunQuery}
              disabled={isExecuting}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-950 text-white font-extrabold text-sm uppercase tracking-wider rounded-lg border-2 border-emerald-900 shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{isExecuting ? '⏳ Executing...' : '▶ Run Query'}</span>
            </button>
            <button
              onClick={handleReset}
              disabled={isExecuting}
              className="px-4 py-2.5 bg-[#ebd9b4] hover:bg-[#dfcb9f] text-[#5c4424] font-bold text-xs uppercase tracking-wider rounded-lg border border-[#8c6b3e]/60 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          <button
            onClick={() => setShowHints(!showHints)}
            className="text-xs font-bold text-[#8c6b3e] underline hover:text-[#5c4424] cursor-pointer"
          >
            {showHints ? "Hide Intel (Hints)" : "Request Intel (Hints)"}
          </button>
        </div>

        {/* Real Relational Result Table Viewport */}
        <div className="mb-6">
          <ResultTable result={queryResult} isLoading={isExecuting} />
        </div>

        {/* Dynamic Result & Hint Feedback Console */}
        {status !== 'IDLE' && (
          <div
            className={`p-4 rounded-lg border-2 mb-6 ${
              status === 'SUCCESS'
                ? 'bg-emerald-100 border-emerald-600 text-emerald-900 animate-pulse'
                : 'bg-red-100 border-red-500 text-red-900'
            }`}
          >
            <div className="font-extrabold text-sm uppercase tracking-wider mb-1">
              {status === 'SUCCESS' ? '✔ Mission Accomplished!' : '⚠ Validation Discrepancy'}
            </div>
            <p className="text-sm font-medium">{feedbackMessage}</p>
          </div>
        )}

        {/* Authored Hints Drawer */}
        {showHints && (
          <div className="p-4 bg-[#ebd9b4]/60 border border-[#8c6b3e]/50 rounded-lg mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8c6b3e] block mb-2">
              Quartermaster's Hints
            </span>
            <ul className="list-disc list-inside text-xs md:text-sm text-amber-950 space-y-1">
              {challenge.hints.map((hint, idx) => (
                <li key={idx}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Reward Preview Footer */}
      <div className="border-t-2 border-[#8c6b3e]/40 pt-4 flex items-center justify-between select-none">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8c6b3e]">
          Bounty Reward Preview
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-[#5c4424]">
            +{challenge.rewards.xp} XP
          </span>
          <span className="text-xs font-extrabold text-[#5c4424]">
            +{challenge.rewards.coins} Gold
          </span>
          {challenge.rewards.gems && (
            <span className="text-xs font-extrabold text-purple-900">
              +{challenge.rewards.gems} Gems
            </span>
          )}
        </div>
      </div>
    </div>
  );
};