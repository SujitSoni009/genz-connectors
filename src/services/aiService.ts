import { Project, Profile, ComplementarityResult, ProjectAnalysis } from '../types';
import { projectIntelligenceService } from './projectIntelligenceService';
import { complementarityService } from './complementarityService';
import { fetchApi, USE_MOCK_API } from './apiClient';

/**
 * Service facade for all AI/Intelligence operations.
 * Currently uses mock/deterministic engines.
 * Later, these methods will wrap calls to the Spring Boot backend
 * which in turn calls Amazon Bedrock.
 */
export const aiService = {
  async analyzeProject(project: Project): Promise<ProjectAnalysis> {
    if (!USE_MOCK_API) {
      return fetchApi<ProjectAnalysis>(`/projects/${project.id}/analyze`, { method: 'POST' });
    }
    return projectIntelligenceService.analyzeProject(project);
  },

  async analyzeComplementarity(
    myProfile: Profile,
    myProjects: Project[],
    candidate: Profile,
    sharedContext: string[] = []
  ): Promise<ComplementarityResult> {
    // Wait, the backend recommendation service already does this natively!
    // For now we can keep the mock here if needed or return a pre-calculated one.
    // The instructions say to make standard API calls. Let's just keep the frontend structure.
    await new Promise(resolve => setTimeout(resolve, 600));
    return complementarityService.analyzeComplementarity(myProfile, myProjects, candidate, sharedContext);
  }
};
