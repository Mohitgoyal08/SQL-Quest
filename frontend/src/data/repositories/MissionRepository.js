import { tutorialMission } from '../missions/tutorialMission';

export class MissionRepository {
  /**
   * Fetches the base mission data structure for a given challenge ID.
   */
  static getMission(challengeId) {
    return tutorialMission;
  }
}