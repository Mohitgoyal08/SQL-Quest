
export function normalizeSQL(sql: string): string {
  if (!sql) return "";
  return sql
    .replace(/--.*$/gm, '')           // Strip single-line comments
    .replace(/[\r\n\t]/g, ' ')        // Convert newlines/tabs to spaces
    .replace(/;/g, '')                // Remove trailing semicolons
    .replace(/\s+/g, ' ')             // Collapse consecutive spaces
    .trim()
    .toLowerCase();
}
