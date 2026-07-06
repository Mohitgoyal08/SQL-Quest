import { normalizeSQL } from './sqlValidator';

export function analyzeSQLMistakes(userQuery: string, expectedQuery: string, authoredHints: string[] = []): string {
  const cleanUser = normalizeSQL(userQuery);
  const cleanExpected = normalizeSQL(expectedQuery);

  if (!cleanUser) {
    return "Your query editor is empty. Enter an SQL command to inspect the database.";
  }

  // Keyword Structural Diagnostics
  if (!cleanUser.includes("select")) {
    return "Missing keyword: Every retrieval query must begin with the SELECT statement.";
  }
  
  if (!cleanUser.includes("from")) {
    return "Missing keyword: You must specify a target table using the FROM clause.";
  }

  if (cleanExpected.includes("where") && !cleanUser.includes("where")) {
    return "Hint: You need a WHERE clause to filter the records based on specific conditions.";
  }

  if (cleanExpected.includes("order by") && !cleanUser.includes("order by")) {
    return "Hint: Use the ORDER BY clause to sort your results.";
  }

  if (cleanExpected.includes("desc") && cleanUser.includes("order by") && !cleanUser.includes("desc")) {
    return "Hint: Check your sorting direction. Add DESC for descending order.";
  }

  if (cleanExpected.includes("limit") && !cleanUser.includes("limit")) {
    return "Hint: Use the LIMIT keyword to restrict the number of returned records.";
  }

  if (cleanExpected.includes("*") && !cleanUser.includes("*") && !cleanUser.includes(cleanExpected.split("from")[0].replace("select", "").trim())) {
    return "Hint: Check your target columns. Are you selecting specific columns or all columns (*)?";
  }

  if (cleanExpected.includes("employees") && !cleanUser.includes("employees")) {
    return "Hint: Verify your table target. Are you selecting FROM the 'employees' table?";
  }

  // Fallback to authored challenge-specific hints if syntax structure passes
  if (authoredHints.length > 0) {
    return authoredHints[0];
  }

  return "Check your SQL syntax carefully. Verify column identifiers, spelling, and numerical conditions.";
}