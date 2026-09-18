export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Profile {
  userId: string;
  headline?: string;
  bio?: string;
  university?: string;
  company?: string;
  role?: string;
  experience?: 'Beginner' | 'Intermediate' | 'Advanced';
  location?: string;
  skills: string[];
  interests: string[];
  canOffer: string[];
  lookingFor: string[];
  availability?: string;
  privacy: {
    showProfile: boolean;
    allowRequests: boolean;
    showIntent: boolean;
  };
}

export interface Intent {
  types: string[];
  description: string;
}

export interface ProjectGap {
  id: string;
  capability: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  evidence?: string;
}

export interface ProjectAnalysis {
  projectId: string;
  summary: string;
  strengths: string[];
  gaps: ProjectGap[];
  recommendedCapabilities: string[];
  collaborationOpportunities: string;
  analyzedAt: string;
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  domain: string;
  technologies: string[];
  stage: 'Idea' | 'Planning' | 'Prototype' | 'MVP' | 'Beta' | 'Production';
  currentCapabilities: string[];
  declaredNeeds: string[];
  createdAt: string;
  analysis?: ProjectAnalysis;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  type: string;
}

export interface ComplementarityResult {
  candidateId: string;
  matchingCapabilities: string[];
  candidateNeeds: string[];
  userOffers: string[];
  projectNeeds: string[];
  sharedInterests: string[];
  context: string[];
  reason: string;
  potentialCollaboration: string;
  score: number; // Internal ranking score, not necessarily shown
}

export interface Recommendation {
  id: string;
  candidateId: string;
  user: Profile & User;
  complementarity: ComplementarityResult;
}
