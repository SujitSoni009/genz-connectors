import { Project, ProjectAnalysis, ProjectGap } from '../types';

export const projectIntelligenceService = {
  async analyzeProject(project: Project): Promise<ProjectAnalysis> {
    // Simulate network/AI delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const { name, technologies, currentCapabilities, declaredNeeds, domain } = project;
    
    const strengths: string[] = [...new Set([...technologies, ...currentCapabilities])];
    const gaps: ProjectGap[] = [];
    const recommendedCapabilities: Set<string> = new Set();
    
    // Deterministic rules engine mock
    const hasBackend = technologies.some(t => ['Java', 'Spring Boot', 'Node.js', 'Python', 'Go', 'Backend'].includes(t)) || currentCapabilities.some(c => c.toLowerCase().includes('backend'));
    const hasFrontend = technologies.some(t => ['React', 'Next.js', 'Vue', 'Frontend', 'HTML', 'CSS'].includes(t)) || currentCapabilities.some(c => c.toLowerCase().includes('frontend'));
    const hasDesign = currentCapabilities.some(c => c.toLowerCase().includes('design') || c.toLowerCase().includes('ui/ux'));
    const hasCloud = technologies.some(t => ['AWS', 'GCP', 'Azure', 'Cloud', 'Docker'].includes(t));
    const hasAI = technologies.some(t => ['Machine Learning', 'AI', 'LLM', 'GenAI', 'Bedrock'].includes(t));

    if (hasBackend && !hasFrontend) {
      gaps.push({
        id: 'gap_' + Date.now() + 1,
        capability: 'Frontend Development',
        reason: 'The project has backend infrastructure but lacks a frontend user interface layer.',
        priority: 'High'
      });
      recommendedCapabilities.add('React');
      recommendedCapabilities.add('TypeScript');
    }

    if (hasFrontend && !hasBackend) {
      gaps.push({
        id: 'gap_' + Date.now() + 2,
        capability: 'Backend Development',
        reason: 'The project needs a robust backend to support the frontend application.',
        priority: 'High'
      });
      recommendedCapabilities.add('Node.js');
      recommendedCapabilities.add('Database Management');
    }

    if (!hasDesign && hasFrontend) {
      gaps.push({
        id: 'gap_' + Date.now() + 3,
        capability: 'UI/UX Design',
        reason: 'Technical frontend capabilities exist, but dedicated product design is needed for a polished user experience.',
        priority: 'Medium'
      });
      recommendedCapabilities.add('UI/UX');
      recommendedCapabilities.add('Product Design');
    }
    
    if (domain.toLowerCase().includes('health') || domain.toLowerCase().includes('medical')) {
       if (!currentCapabilities.some(c => c.toLowerCase().includes('health'))) {
         gaps.push({
           id: 'gap_' + Date.now() + 4,
           capability: 'Healthcare Domain Expertise',
           reason: 'Building in the healthcare space requires specific domain knowledge (HIPAA, workflows) that the current team lacks.',
           priority: 'High'
         });
         recommendedCapabilities.add('Healthcare');
       }
    }

    // Add explicit declared needs
    declaredNeeds.forEach((need, index) => {
       if (!gaps.some(g => g.capability.toLowerCase() === need.toLowerCase())) {
         gaps.push({
           id: 'gap_explicit_' + index,
           capability: need,
           reason: `Explicitly declared as a need for the project.`,
           priority: 'High'
         });
         recommendedCapabilities.add(need);
       }
    });

    const summary = `A ${domain} project currently in the ${project.stage} stage, leveraging ${technologies.join(', ')}.`;
    
    let collaborationOpportunities = '';
    if (hasBackend && !hasFrontend) {
       collaborationOpportunities = 'Your team has strong backend capabilities but could benefit significantly from someone experienced in frontend development and product design to bring the product to users.';
    } else if (hasFrontend && !hasBackend) {
       collaborationOpportunities = 'You have a great frontend foundation but need a backend developer to build the APIs and database architecture.';
    } else {
       collaborationOpportunities = `Look for collaborators who bring ${Array.from(recommendedCapabilities).slice(0, 3).join(', ')} to round out the team's capabilities.`;
    }

    return {
      projectId: project.id,
      summary,
      strengths,
      gaps,
      recommendedCapabilities: Array.from(recommendedCapabilities),
      collaborationOpportunities,
      analyzedAt: new Date().toISOString()
    };
  }
};
