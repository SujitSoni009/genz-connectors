import { User } from '../types';

const AUTH_KEY = 'genz_auth_user';

export const authService = {
  async register(data: any): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: 'u_' + Date.now(),
          name: data.name,
          email: data.email,
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        resolve(user);
      }, 800);
    });
  },

  async login(data: any): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {
          const user = JSON.parse(stored);
          if (user.email === data.email) {
            resolve(user);
            return;
          }
        }
        
        // Mock successful login even if not registered yet for demo purposes
        const mockUser: User = {
          id: 'u_123',
          name: 'Demo User',
          email: data.email,
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
        resolve(mockUser);
      }, 800);
    });
  },

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(AUTH_KEY);
        resolve();
      }, 300);
    });
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
};
