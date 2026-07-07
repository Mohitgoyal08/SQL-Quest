// ===== Sprint 9.7 World Interaction Foundation =====

export interface WorldRequirement {
  requiredItem?: string;
  requiredChallengeId?: string;
}

export interface WorldLocation {
  id: string;
  name: string;
  requirements?: WorldRequirement;
}

export interface NPCDefinition {
  id: string;
  name: string;
  requirements?: WorldRequirement;
}