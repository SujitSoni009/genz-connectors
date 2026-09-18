import { Recommendation, User, Profile } from '../types';
import { profileService } from './profileService';
import { intentService } from './intentService';
import { projectService } from './projectService';
import { aiService } from './aiService';
import { fetchApi, USE_MOCK_API } from './apiClient';

// Mock DB of potential candidates
const mockCandidates: (User & Profile)[] = [
  {
    id: 'c1',
    userId: 'c1',
    name: 'Ananya Sharma',
    email: 'ananya@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=ananya',
    headline: 'Frontend Engineer & Designer',
    role: 'Frontend Engineer',
    bio: 'Passionate about creating intuitive user experiences. Previously at a health-tech startup.',
    skills: ['React', 'TypeScript', 'UI/UX', 'Figma', 'Tailwind CSS'],
    interests: ['Accessibility', 'Healthcare', 'Design Systems', 'AI'],
    canOffer: ['React', 'Product design', 'Frontend development', 'User research', 'UI/UX'],
    lookingFor: ['Backend collaborator', 'Technical co-founder', 'Backend support', 'Java', 'Spring Boot'],
    privacy: { showProfile: true, allowRequests: true, showIntent: true },
  },
  {
    id: 'c2',
    userId: 'c2',
    name: 'David Chen',
    email: 'david@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=david',
    headline: 'Machine Learning Researcher',
    role: 'Researcher',
    bio: 'PhD student researching generative models. Looking to apply models to real-world problems.',
    skills: ['Python', 'PyTorch', 'Machine Learning', 'Data Science'],
    interests: ['Generative AI', 'Computer Vision', 'Hackathons'],
    canOffer: ['AI model development', 'Data analysis', 'Python', 'Machine Learning'],
    lookingFor: ['Software engineers to build apps around my models', 'Frontend developer', 'React', 'Node.js'],
    privacy: { showProfile: true, allowRequests: true, showIntent: true },
  },
  {
    id: 'c3',
    userId: 'c3',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
    headline: 'Product Manager & Strategist',
    role: 'Product Manager',
    bio: 'Expert in GTM strategy and finding product-market fit.',
    skills: ['Product Strategy', 'User Interviews', 'Agile', 'Business Development'],
    interests: ['Startups', 'FinTech', 'SaaS'],
    canOffer: ['Business strategy', 'Marketing', 'Customer discovery', 'Product Management'],
    lookingFor: ['Technical cofounder', 'AI engineer', 'Full-stack developer'],
    privacy: { showProfile: true, allowRequests: true, showIntent: true },
  }
];

export const recommendationService = {
  async getRecommendations(): Promise<Recommendation[]> {
    if (!USE_MOCK_API) {
      return fetchApi<Recommendation[]>('/recommendations');
    }

    const myProfile = await profileService.getCurrentProfile();
    const myProjects = await projectService.getProjects();
    const myIntent = await intentService.getCurrentIntent();

    if (!myProfile) {
      return [];
    }

    const recs: Recommendation[] = [];

    // Evaluate each candidate using AI Service
    for (const candidate of mockCandidates) {
      const sharedContext: string[] = [];
      if (myIntent && myIntent.types.length > 0) {
        sharedContext.push(`Intent: ${myIntent.types[0]}`);
      }

      const complementarity = await aiService.analyzeComplementarity(
        myProfile,
        myProjects,
        candidate,
        sharedContext
      );

      // Only recommend if score is above a threshold
      if (complementarity.score >= 10) {
        recs.push({
          id: 'rec_' + candidate.userId,
          candidateId: candidate.userId,
          user: candidate,
          complementarity
        });
      }
    }

    // Sort by score descending
    recs.sort((a, b) => b.complementarity.score - a.complementarity.score);

    return recs;
  },
  
  async getCandidateById(id: string): Promise<(User & Profile) | null> {
    if (!USE_MOCK_API) {
      // In a real app we'd fetch this from backend. Let's just mock it here or get from recs.
      // Since we don't have a specific user by id endpoint yet, we'll try to find it in recs.
      const recs = await this.getRecommendations();
      const rec = recs.find(r => r.user.id === id);
      if (rec) return rec.user as any;
      return null;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const candidate = mockCandidates.find(c => c.id === id);
        resolve(candidate || null);
      }, 300);
    });
  }
};
