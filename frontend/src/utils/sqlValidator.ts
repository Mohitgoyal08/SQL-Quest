import { ChallengeValidation } from '../data/challenges';

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

/**
 * Central delegation entry point for challenge validation.
 */
export class ChallengeValidator {
  public static validate(userQuery: string, validation: ChallengeValidation): boolean {
    const cleanUser = normalizeSQL(userQuery);
    if (!cleanUser) return false;

    switch (validation.type) {
      case 'EXACT':
        return this.validateExact(cleanUser, validation.expected);
      case 'CONTAINS':
        return this.validateContains(cleanUser, validation.expected);
      case 'KEYWORD_MATCH':
        return this.validateKeywords(cleanUser, validation.requiredKeywords || []);
      case 'REGEX':
        return this.validateRegex(cleanUser, validation.expected);
      default:
        return this.validateExact(cleanUser, validation.expected);
    }
  }

  private static validateExact(cleanUser: string, expected: string): boolean {
    return cleanUser === normalizeSQL(expected);
  }

  private static validateContains(cleanUser: string, expectedSnippet: string): boolean {
    return cleanUser.includes(normalizeSQL(expectedSnippet));
  }

  private static validateKeywords(cleanUser: string, keywords: string[]): boolean {
    return keywords.every(kw => cleanUser.includes(kw.toLowerCase()));
  }

  private static validateRegex(cleanUser: string, regexPattern: string): boolean {
    try {
      const regex = new RegExp(regexPattern, 'i');
      return regex.test(cleanUser);
    } catch {
      return false;
    }
  }
}