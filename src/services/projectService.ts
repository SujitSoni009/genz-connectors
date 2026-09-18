import { Project, ProjectAnalysis } from '../types';
import { fetchApi, USE_MOCK_API } from './apiClient';

const PROJECTS_KEY = 'genz_user_projects';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    if (!USE_MOCK_API) {
      return fetchApi<Project[]>('/projects');
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(PROJECTS_KEY);
        if (stored) {
          resolve(JSON.parse(stored));
        } else {
          resolve([]);
        }
      }, 400);
    });
  },

  async getProject(id: string): Promise<Project | null> {
    if (!USE_MOCK_API) {
      return fetchApi<Project>(`/projects/${id}`);
    }
    const projects = await this.getProjects();
    return projects.find(p => p.id === id) || null;
  },

  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'ownerId'>, ownerId: string): Promise<Project> {
    if (!USE_MOCK_API) {
      return fetchApi<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
      });
    }
    return new Promise(async (resolve) => {
      const projects = await this.getProjects();
      const newProject: Project = {
        ...projectData,
        id: 'proj_' + Date.now(),
        ownerId,
        createdAt: new Date().toISOString(),
      };
      projects.push(newProject);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      
      setTimeout(() => {
        resolve(newProject);
      }, 600);
    });
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    if (!USE_MOCK_API) {
      return fetchApi<Project>(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    }
    return new Promise(async (resolve) => {
      const projects = await this.getProjects();
      const index = projects.findIndex(p => p.id === id);
      if (index === -1) {
        resolve(null);
        return;
      }
      projects[index] = { ...projects[index], ...updates };
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      
      setTimeout(() => {
        resolve(projects[index]);
      }, 400);
    });
  },

  async saveAnalysis(projectId: string, analysis: ProjectAnalysis): Promise<Project | null> {
    // Backend automatically saves it inside analyzeProject, but frontend calls this explicitly in mock flow
    return this.updateProject(projectId, { analysis });
  }
};
