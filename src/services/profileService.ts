import { Profile } from '../types';
import { fetchApi, USE_MOCK_API } from './apiClient';

const PROFILE_KEY = 'genz_user_profile';

export const profileService = {
  async saveProfile(profile: Partial<Profile>): Promise<Profile> {
    if (!USE_MOCK_API) {
      return fetchApi<Profile>('/profile/me', {
        method: 'PUT',
        body: JSON.stringify(profile)
      });
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const existing = this.getCurrentProfileSync() || {};
        const updated = { ...existing, ...profile } as Profile;
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
        resolve(updated);
      }, 600);
    });
  },

  async getCurrentProfile(): Promise<Profile | null> {
    if (!USE_MOCK_API) {
      return fetchApi<Profile>('/profile/me').catch(() => null);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getCurrentProfileSync());
      }, 300);
    });
  },

  getCurrentProfileSync(): Profile | null {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
};
