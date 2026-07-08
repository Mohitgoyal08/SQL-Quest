/**
 * DevStorage - Sandboxed localStorage keys for isolated dev sessions
 */
export const getStorageKey = (key, defaultKey) => {
  return import.meta.env.DEV ? `sql_quest_dev_${key}` : defaultKey;
};
