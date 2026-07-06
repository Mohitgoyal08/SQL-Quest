export class ResultValidator {
  /**
   * Deeply validates the player's query execution result against the target reference result.
   *
   * @param {Object} playerResult - Output payload from SQLEngineService.executeQuery(playerQuery)
   * @param {Object} expectedResult - Output payload from SQLEngineService.executeQuery(referenceQuery)
   * @param {boolean} requireOrder - If true, enforces strict row-by-row sequence matching (for ORDER BY / LIMIT)
   * @returns {Object} Structured validation diagnostics
   */
  static validate(playerResult, expectedResult, requireOrder = false) {
    // 1. Guard against SQL Execution Errors
    if (!playerResult || !playerResult.success) {
      return {
        isValid: false,
        feedback: `SQL Execution Error: ${playerResult?.error || 'Malformed query submitted.'}`,
        playerResult,
        expectedResult
      };
    }

    if (!expectedResult || !expectedResult.success) {
      return {
        isValid: false,
        feedback: 'System Error: Canonical challenge reference query failed to execute.',
        playerResult,
        expectedResult
      };
    }

    // 2. Validate Column Count
    const pCols = playerResult.columns || [];
    const eCols = expectedResult.columns || [];
    if (pCols.length !== eCols.length) {
      return {
        isValid: false,
        feedback: `Column Count Mismatch: Expected ${eCols.length} columns (${eCols.join(', ')}), but your query returned ${pCols.length}.`,
        playerResult,
        expectedResult
      };
    }

    // 3. Validate Column Names (Case-insensitive normalization)
    for (let i = 0; i < eCols.length; i++) {
      if (pCols[i].toLowerCase() !== eCols[i].toLowerCase()) {
        return {
          isValid: false,
          feedback: `Column Mismatch at position ${i + 1}: Expected column '${eCols[i]}', but got '${pCols[i]}'. Check your SELECT clause.`,
          playerResult,
          expectedResult
        };
      }
    }

    // 4. Validate Row Count
    const pRows = playerResult.rows || [];
    const eRows = expectedResult.rows || [];
    if (pRows.length !== eRows.length) {
      return {
        isValid: false,
        feedback: `Record Count Mismatch: Expected ${eRows.length} rows to be returned, but retrieved ${pRows.length} rows. Check your WHERE or LIMIT filters.`,
        playerResult,
        expectedResult
      };
    }

    // 5. Matrix Comparison (Row Values)
    if (requireOrder) {
      // Strict Index-by-Index sequence validation
      for (let r = 0; r < eRows.length; r++) {
        for (let c = 0; c < eCols.length; c++) {
          if (String(pRows[r][c]) !== String(eRows[r][c])) {
            return {
              isValid: false,
              feedback: `Sorting Discrepancy at Row #${r + 1}, Column '${eCols[c]}': Expected value '${eRows[r][c]}', but found '${pRows[r][c]}'. Check your ORDER BY sorting direction.`,
              playerResult,
              expectedResult
            };
          }
        }
      }
    } else {
      // Unordered set validation (prevents false failures when order doesn't matter)
      const normalizeRow = (row) => row.map(cell => cell !== null ? String(cell) : 'NULL').join('___');
      const expectedSet = new Set(eRows.map(normalizeRow));

      for (let r = 0; r < pRows.length; r++) {
        const rowKey = normalizeRow(pRows[r]);
        if (!expectedSet.has(rowKey)) {
          return {
            isValid: false,
            feedback: `Unexpected Data Retrieved: Row #${r + 1} (${pRows[r].join(', ')}) does not match any valid record in the target dataset. Check your filtering conditions.`,
            playerResult,
            expectedResult
          };
        }
      }
    }

    return {
      isValid: true,
      feedback: 'Query Output Verified! The retrieved dataset matches the harbor ledger records exactly.',
      playerResult,
      expectedResult
    };
  }
}