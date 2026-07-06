import React from 'react';
import ResultTable from './ResultTable';

interface ExecutionTerminalProps {
  isExecuting: boolean;
  queryResult: any;
  loadingMessage?: string;

};

export default function ExecutionTerminal({ isExecuting,queryResult,
loadingMessage,
}: ExecutionTerminalProps) {
  // 1. Show Spinner during the enforced loading buffer
  if (isExecuting) {
    return (
      <div className="border-2 border-[#8c6b3e] bg-[#0b1d28] rounded-xl p-8 text-center font-mono select-none shadow-inner">
        <div className="flex flex-col items-center justify-center gap-3 animate-pulse">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase">
            Executing Query in WebAssembly SQLite Engine...
          </span>
          <span className="text-xs text-emerald-600">
            {loadingMessage || "Executing SQL Query..."}
          </span>
        </div>
      </div>
    );
  }

  // 2. Idle State
  if (!queryResult) return null;

  // 3. Display Raw SQLite Engine Errors cleanly without breaking pixel-art theme
  if (!queryResult.success) {
    return (
      <div className="border-2 border-red-600 bg-[#1a0808] rounded-xl p-5 font-mono text-xs text-red-300 shadow-md">
        <div className="font-black uppercase tracking-wider text-red-500 flex items-center gap-2 mb-2">
          <span>⚠ SQLite Terminal Exception</span>
        </div>
        <p className="bg-black/40 p-3 rounded border border-red-900/60 font-mono text-red-300 leading-relaxed overflow-x-auto">
          {queryResult.error}
        </p>
      </div>
    );
  }

  // 4. Delegate successful executions directly to existing ResultTable API
  return <ResultTable result={queryResult} isLoading={false} />;
}