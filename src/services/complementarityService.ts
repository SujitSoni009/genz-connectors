import { Profile, Project, ComplementarityResult } from '../types';

export const complementarityService = {
  analyzeComplementarity(
    myProfile: Profile,
    myProjects: Project[],
    candidate: Profile,
    sharedContext: string[] = []
  ): ComplementarityResult {
    
    const candidateOffers = candidate.canOffer || [];
    const candidateNeeds = candidate.lookingFor || [];
    
    const myOffers = myProfile.canOffer || [];
    const myNeeds = myProfile.lookingFor || [];
    
    // Check if candidate offers what user/project needs
    const matchingCapabilities: string[] = [];
    
    // Check user profile needs
    candidateOffers.forEach(offer => {
       if (myNeeds.some(need => need.toLowerCase().includes(offer.toLowerCase()) || offer.toLowerCase().includes(need.toLowerCase()))) {
           if (!matchingCapabilities.includes(offer)) matchingCapabilities.push(offer);
       }
    });

    // Check project gaps
    const projectNeeds: string[] = [];
    myProjects.forEach(project => {
        if (project.analysis) {
            project.analysis.gaps.forEach(gap => {
               projectNeeds.push(gap.capability);
               const matchingOffer = candidateOffers.find(offer => offer.toLowerCase().includes(gap.capability.toLowerCase()) || gap.capability.toLowerCase().includes(offer.toLowerCase()));
               if (matchingOffer) {
                   if (!matchingCapabilities.includes(matchingOffer)) matchingCapabilities.push(matchingOffer);
               }
            });
        }
    });

    // Determine reverse complementarity (Candidate needs something the User offers)
    const reverseMatches: string[] = [];
    candidateNeeds.forEach(need => {
        if (myOffers.some(offer => offer.toLowerCase().includes(need.toLowerCase()) || need.toLowerCase().includes(offer.toLowerCase()))) {
           reverseMatches.push(need);
        }
    });
    
    // Also check my skills against candidate needs
    candidateNeeds.forEach(need => {
        if (myProfile.skills.some(skill => skill.toLowerCase().includes(need.toLowerCase()) || need.toLowerCase().includes(skill.toLowerCase()))) {
           if(!reverseMatches.includes(need)) reverseMatches.push(need);
        }
    });

    const sharedInterests = candidate.interests.filter(i => myProfile.interests.includes(i));
    
    let reason = '';
    let potentialCollaboration = '';
    let score = 0;

    if (matchingCapabilities.length > 0 && reverseMatches.length > 0) {
        // Strong Two-Way Complementarity
        reason = `Strong mutual fit. You need ${matchingCapabilities[0]} which they offer, and they are looking for ${reverseMatches[0]} which you have.`;
        potentialCollaboration = `You can provide ${reverseMatches.join(' and ')} while they focus on ${matchingCapabilities.join(' and ')}.`;
        score += 100;
    } else if (matchingCapabilities.length > 0) {
        // One-Way: Candidate can help User
        reason = `They offer ${matchingCapabilities.join(' and ')}, which directly addresses your current needs.`;
        potentialCollaboration = `They could help you with ${matchingCapabilities[0]}.`;
        score += 50;
    } else if (reverseMatches.length > 0) {
        // One-Way: User can help Candidate
        reason = `You have the ${reverseMatches.join(' and ')} experience they are currently looking for.`;
        potentialCollaboration = `You could collaborate by providing ${reverseMatches[0]} expertise.`;
        score += 40;
    } else if (sharedInterests.length > 0) {
        // Shared Interests
        reason = `You both share an interest in ${sharedInterests.join(', ')}.`;
        potentialCollaboration = `Connect to discuss ${sharedInterests[0]} and share insights.`;
        score += 20;
    } else {
        // Generic fallback
        reason = `You both are building in the tech space and might benefit from connecting.`;
        potentialCollaboration = `Explore potential synergies.`;
        score += 5;
    }
    
    score += sharedInterests.length * 5;
    score += sharedContext.length * 10;

    return {
        candidateId: candidate.userId,
        matchingCapabilities,
        candidateNeeds,
        userOffers: myOffers,
        projectNeeds,
        sharedInterests,
        context: sharedContext,
        reason,
        potentialCollaboration,
        score
    };
  }
};
