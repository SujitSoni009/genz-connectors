import { Intent } from '../types';
import { fetchApi, USE_MOCK_API } from './apiClient';

const INTENT_KEY = 'genz_user_intent';

export const intentService = {
  async saveIntent(intent: Intent): Promise<Intent> {
    if (!USE_MOCK_API) {
      // For now we just POST. Or if we added ID, we'd PUT.
      return fetchApi<Intent>('/intents', {
        method: 'POST',
        body: JSON.stringify(intent)
      });
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(INTENT_KEY, JSON.stringify(intent));
        resolve(intent);
      }, 400);
    });
  },

  async getCurrentIntent(): Promise<Intent | null> {
    if (!USE_MOCK_API) {
      return fetchApi<Intent>('/intents/me').catch(() => null);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(INTENT_KEY);
        if (stored) {
          resolve(JSON.parse(stored));
        } else {
          resolve(null);
        }
      }, 200);
    });
  }
};
