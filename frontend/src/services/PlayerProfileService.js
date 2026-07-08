import { getStorageKey } from '../dev/DevStorage';

const PROFILE_STORAGE_KEY = getStorageKey('profile', 'sql_quest_player_profile');

export class PlayerProfileService {
  static loadProfile() {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("PlayerProfileService: Failed to load profile", error);
    }
    return { name: 'Privateer', avatar: 'default' };
  }

  static saveProfile(profile) {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error("PlayerProfileService: Failed to save profile", error);
      return false;
    }
  }

  static clearProfile() {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("PlayerProfileService: Failed to clear profile", error);
      return false;
    }
  }
}