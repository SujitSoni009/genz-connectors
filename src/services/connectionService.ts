import { fetchApi, USE_MOCK_API } from './apiClient';

export interface Connection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

const CONNECTIONS_KEY = 'genz_user_connections';

export const connectionService = {
  async getConnections(): Promise<Connection[]> {
    if (!USE_MOCK_API) {
      return fetchApi<Connection[]>('/connections');
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(CONNECTIONS_KEY);
        resolve(stored ? JSON.parse(stored) : []);
      }, 300);
    });
  },

  async requestConnection(userId: string): Promise<Connection> {
    if (!USE_MOCK_API) {
      return fetchApi<Connection>(`/connections/${userId}`, { method: 'POST' });
    }
    return new Promise(async (resolve) => {
      const connections = await this.getConnections();
      
      // Prevent duplicates
      const existing = connections.find(c => c.receiverId === userId);
      if (existing) {
        resolve(existing);
        return;
      }

      const newConnection: Connection = {
        id: 'conn_' + Date.now(),
        requesterId: 'user-123',
        receiverId: userId,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      connections.push(newConnection);
      localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
      
      setTimeout(() => {
        resolve(newConnection);
      }, 500);
    });
  },

  async acceptConnection(id: string): Promise<Connection | null> {
    if (!USE_MOCK_API) {
      return fetchApi<Connection>(`/connections/${id}/accept`, { method: 'PUT' });
    }
    return this.updateConnectionStatus(id, 'ACCEPTED');
  },

  async rejectConnection(id: string): Promise<Connection | null> {
    if (!USE_MOCK_API) {
      return fetchApi<Connection>(`/connections/${id}/reject`, { method: 'PUT' });
    }
    return this.updateConnectionStatus(id, 'REJECTED');
  },

  async updateConnectionStatus(id: string, status: 'ACCEPTED' | 'REJECTED'): Promise<Connection | null> {
    return new Promise(async (resolve) => {
      const connections = await this.getConnections();
      const index = connections.findIndex(c => c.id === id);
      if (index === -1) {
        resolve(null);
        return;
      }
      connections[index].status = status;
      connections[index].updatedAt = new Date().toISOString();
      localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
      
      setTimeout(() => resolve(connections[index]), 300);
    });
  }
};
