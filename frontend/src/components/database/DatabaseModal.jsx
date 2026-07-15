import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SQLEngineService } from '../../engine/SQLEngineService';
import { DatabaseBootstrap } from '../../database/DatabaseBootstrap';

const TABLES_MANIFEST = [
  { id: 'ships', name: 'Ships', icon: '⛵', desc: 'Commercial and naval vessels docked or active in port.' },
  { id: 'employees', name: 'Employees', icon: '👥', desc: 'All crew members, officers, and sailors on the ships.' },
  { id: 'departments', name: 'Departments', icon: '🏢', desc: 'Ship board departments, their budgets and locations.' },
  { id: 'artifacts', name: 'Artifacts', icon: '🏺', desc: 'Relics, weapons, and historical treasures collected.' },
  { id: 'gems', name: 'Gems', icon: '💎', desc: 'Precious rubies, emeralds, and sapphires mined.' },
  { id: 'bounties', name: 'Bounties', icon: '📜', desc: 'Wanted outlaws, target names, and bounty sums.' },
  { id: 'weather_logs', name: 'Weather Logs', icon: '☁️', desc: 'Atmospheric conditions, fog density, and sea monsters.' }
];

export default function DatabaseModal({ onClose }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [], success: true, error: null });
  const [isLoading, setIsLoading] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Load preview data when selected table changes
  useEffect(() => {
    if (!selectedTable) return;

    let isMounted = true;
    const fetchPreview = async () => {
      setIsLoading(true);
      try {
        // Ensure db is bootstrapped
        await DatabaseBootstrap.initialize();
        const res = await SQLEngineService.executeQuery(`SELECT * FROM ${selectedTable.id} LIMIT 10;`);
        
        if (isMounted) {
          if (res.success) {
            setTableData({
              columns: res.columns,
              rows: res.rows,
              success: true,
              error: null
            });
          } else {
            setTableData({
              columns: [],
              rows: [],
              success: false,
              error: res.error
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setTableData({
            columns: [],
            rows: [],
            success: false,
            error: err.message || 'Failed to connect to SQLite engine.'
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPreview();
    return () => {
      isMounted = false;
    };
  }, [selectedTable]);

  return (
    <div role="dialog" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 select-none animate-fadeIn">
      {/* Backdrop close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Main parchment modal wrapper */}
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className="relative w-full max-w-5xl h-[85vh] min-h-[600px] bg-[#fdf6e2] border-8 border-double border-[#8c6b3e] rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col overflow-hidden filter sepia-[0.2]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fdf6e2 60%, #ebd9b4 100%)',
          boxShadow: 'inset 0 0 50px rgba(92,68,36,0.35), 0 25px 50px rgba(0,0,0,0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Title */}
        <div className="flex items-center justify-between border-b-2 border-[#8c6b3e]/40 pb-3 mb-4 z-10">
          <div>
            <h2 className="text-2xl font-black text-[#5c4424] uppercase tracking-wider leading-none">
              🗃️ Captain&apos;s Database
            </h2>
            <span className="text-[10px] font-bold text-[#8c6b3e] uppercase tracking-widest mt-1.5 block">
              Inspect the available tables before writing your SQL
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Database Browser"
            className="w-10 h-10 bg-[#ebd9b4] hover:bg-[#dfcb9f] text-[#5c4424] font-black text-lg rounded-xl border-2 border-[#8c6b3e] flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#5c4424]"
          >
            ✕
          </button>
        </div>

        {/* Content Area split left/right */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden min-h-0">
          
          {/* Left panel: List of tables */}
          <div className="w-full md:w-72 flex flex-col overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#8c6b3e] mb-3">
              Database Ledger
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-hide">
              {TABLES_MANIFEST.map((table) => {
                const isSelected = selectedTable?.id === table.id;
                return (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    className={`w-full text-left p-3.5 rounded-xl border-2 flex items-center gap-3.5 transition-all cursor-pointer shadow-sm select-none ${
                      isSelected
                        ? 'bg-[#8c6b3e] border-[#5c4424] text-white'
                        : 'bg-[#ebd9b4]/50 border-[#8c6b3e]/30 text-[#5c4424] hover:bg-[#ebd9b4]'
                    }`}
                  >
                    <span className="text-2xl">{table.icon}</span>
                    <div className="truncate">
                      <span className="font-extrabold text-sm uppercase tracking-wider block">{table.name}</span>
                      <span className={`text-[10px] font-medium leading-tight block mt-0.5 ${isSelected ? 'text-amber-100/80' : 'text-[#8c6b3e]'}`}>{table.id}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Table details and grid display */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#ebd9b4]/20 border-2 border-dashed border-[#8c6b3e]/40 rounded-2xl p-4 md:p-6 shadow-inner min-h-0">
            {selectedTable ? (
              <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                {/* Selected table headers */}
                <div className="border-b border-[#8c6b3e]/30 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedTable.icon}</span>
                    <div>
                      <h4 className="text-lg font-black text-[#5c4424] uppercase tracking-wider leading-none">
                        {selectedTable.name}
                      </h4>
                      <span className="text-xs font-bold font-mono text-[#8c6b3e] mt-1 block">
                        schema_table: {selectedTable.id}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-amber-950/70 font-medium italic mt-2.5">
                    &ldquo;{selectedTable.desc}&rdquo;
                  </p>
                </div>

                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-amber-800 font-extrabold text-xs uppercase tracking-widest animate-pulse">
                      ⚓ Loading table schema & rows...
                    </span>
                  </div>
                ) : !tableData.success ? (
                  <div className="flex-1 flex items-center justify-center p-4 bg-red-100/50 border border-red-400 rounded-xl">
                    <span className="text-red-800 font-bold text-xs uppercase tracking-wider">
                      ⚠️ SQLite error: {tableData.error}
                    </span>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                    
                    {/* Columns manifest block */}
                    <div className="mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#8c6b3e] block mb-2">
                        Relational Attributes (Columns)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tableData.columns.map((col, idx) => (
                          <span
                            key={idx}
                            className="bg-[#ebd9b4]/70 border border-[#8c6b3e]/40 text-[#5c4424] px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase tracking-wider shadow-sm select-none"
                          >
                            🔑 {col}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Data grid preview */}
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#8c6b3e] block mb-2">
                      Tabular Preview (First 10 Rows)
                    </span>
                    <div className="flex-1 overflow-auto bg-white/60 border border-[#8c6b3e]/30 rounded-xl shadow-inner min-h-0">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="bg-[#ebd9b4]/60 border-b border-[#8c6b3e]/40 sticky top-0 z-10">
                            {tableData.columns.map((col, idx) => (
                              <th
                                key={idx}
                                className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-[#5c4424] border-r border-[#8c6b3e]/30 last:border-0"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.rows.length === 0 ? (
                            <tr>
                              <td
                                colSpan={tableData.columns.length || 1}
                                className="px-4 py-8 text-center text-xs font-bold text-amber-900/60 uppercase tracking-widest italic"
                              >
                                Table is empty. No crew records found.
                              </td>
                            </tr>
                          ) : (
                            tableData.rows.map((row, rowIdx) => (
                              <tr
                                key={rowIdx}
                                className="border-b border-[#8c6b3e]/15 last:border-0 hover:bg-[#ebd9b4]/20 transition-colors"
                              >
                                {row.map((cell, cellIdx) => (
                                  <td
                                    key={cellIdx}
                                    className="px-4 py-2.5 text-xs font-semibold font-mono text-pirate-charcoal border-r border-[#8c6b3e]/15 last:border-0 truncate max-w-[200px]"
                                    title={cell?.toString() || 'NULL'}
                                  >
                                    {cell === null ? (
                                      <span className="text-red-800 font-extrabold italic opacity-60">NULL</span>
                                    ) : (
                                      cell.toString()
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none">
                <span className="text-6xl mb-4 animate-bounce">🗃️</span>
                <h4 className="text-sm font-black text-[#5c4424] uppercase tracking-widest mb-1.5 font-serif">
                  No Table Selected
                </h4>
                <p className="text-xs text-amber-950/60 font-bold uppercase tracking-wider max-w-xs leading-relaxed">
                  Select a table from the ledger ledger on the left to inspect its schema and tabular rows.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
