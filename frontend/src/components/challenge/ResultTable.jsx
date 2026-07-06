import React from 'react';

export default function ResultTable({ result, isLoading }) {
  if (isLoading) {
    return (
      <div className="p-6 bg-[#ebd9b4]/60 border-2 border-[#8c6b3e] rounded-xl text-center font-mono text-sm text-[#5c4424] animate-pulse select-none">
        ⚙️ Executing Query against WebAssembly SQLite Engine...
      </div>
    );
  }

  if (!result) return null;

  // Handle SQL Syntax/Execution Errors
  if (!result.success) {
    return (
      <div className="p-4 bg-red-950/90 border-2 border-red-600 rounded-xl font-mono text-xs text-red-200 shadow-md">
        <div className="font-extrabold uppercase tracking-wider text-red-400 flex items-center gap-2 mb-1">
          <span>⚠ SQLite Execution Fault</span>
        </div>
        <p className="leading-relaxed">{result.error}</p>
      </div>
    );
  }

  // Handle DML Queries (INSERT/UPDATE/DELETE)
  if (result.rowsAffected !== undefined && (!result.columns || result.columns.length === 0 || result.columns[0] === 'Affected Rows')) {
    return (
      <div className="p-4 bg-emerald-900/80 border-2 border-emerald-600 rounded-xl font-mono text-xs text-emerald-100 flex items-center justify-between shadow-md">
        <span className="font-bold">Command Executed Successfully</span>
        <span className="px-2.5 py-1 bg-emerald-950 rounded border border-emerald-500 font-extrabold">
          {result.rowsAffected} Row(s) Modified
        </span>
      </div>
    );
  }

  // Handle Empty Record Sets
  if (!result.rows || result.rows.length === 0) {
    return (
      <div className="border-2 border-[#8c6b3e] bg-[#ebd9b4] rounded-xl overflow-hidden shadow-inner font-mono text-xs">
        <div className="bg-[#8c6b3e] text-amber-100 px-4 py-2 font-bold uppercase tracking-wider flex justify-between">
          <span>Query Output Matrix</span>
          <span>0 Records Retrieved</span>
        </div>
        <div className="p-6 text-center text-amber-950/70 italic font-sans">
          The query executed cleanly, but no records matched your filter criteria.
        </div>
      </div>
    );
  }

  // Render Tabular Output Matrix
  return (
    <div className="border-2 border-[#8c6b3e] bg-[#ebd9b4] rounded-xl overflow-hidden shadow-inner font-mono text-xs">
      <div className="bg-[#8c6b3e] text-amber-100 px-4 py-2 font-bold uppercase tracking-wider flex justify-between items-center select-none">
        <span>Query Output Matrix</span>
        <span className="bg-[#5c4424] px-2 py-0.5 rounded text-[10px]">
          {result.rows.length} Row{result.rows.length !== 1 ? 's' : ''} • {result.executionTimeMs || 0}ms
        </span>
      </div>
      
      <div className="max-h-56 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#dfcb9f] text-[#5c4424] border-b-2 border-[#8c6b3e] sticky top-0">
              {result.columns.map((col, idx) => (
                <th key={idx} className="p-2.5 border-r border-[#8c6b3e]/40 font-extrabold tracking-wide uppercase text-[11px]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, rIdx) => (
              <tr 
                key={rIdx} 
                className={`border-b border-[#8c6b3e]/20 hover:bg-[#dfcb9f]/40 transition-colors ${
                  rIdx % 2 === 0 ? 'bg-[#fdf6e2]' : 'bg-[#f5ebd2]'
                }`}
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2.5 border-r border-[#8c6b3e]/20 text-amber-950 truncate max-w-[200px]">
                    {cell !== null && cell !== undefined ? (
                      String(cell)
                    ) : (
                      <span className="italic opacity-40">NULL</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
