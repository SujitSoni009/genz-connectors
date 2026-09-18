package com.genzconnectors.backend.service;

import com.genzconnectors.backend.dto.UserProfileDto;
import com.genzconnectors.backend.model.ComplementarityResult;
import com.genzconnectors.backend.model.Project;
import com.genzconnectors.backend.model.ProjectGap;
import com.genzconnectors.backend.model.Recommendation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final ProfileService profileService;
    private final ProjectService projectService;

    public RecommendationService(ProfileService profileService, ProjectService projectService) {
        this.profileService = profileService;
        this.projectService = projectService;
    }

    public List<Recommendation> getRecommendations(String userId) {
        List<Recommendation> recommendations = new ArrayList<>();
        UserProfileDto myProfile = profileService.getUserProfile(userId);
        if (myProfile == null) return recommendations;
        
        List<Project> myProjects = projectService.getProjects(userId);
        List<UserProfileDto> candidates = profileService.getAllCandidateProfiles(userId);

        for (UserProfileDto candidate : candidates) {
            ComplementarityResult result = calculateComplementarity(myProfile, myProjects, candidate);
            if (result.getScore() > 0) {
                recommendations.add(Recommendation.builder()
                        .id(UUID.randomUUID().toString())
                        .candidateId(candidate.getId())
                        .user(candidate)
                        .complementarity(result)
                        .build());
            }
        }
        
        // Sort by highest score
        recommendations.sort((a, b) -> Integer.compare(b.getComplementarity().getScore(), a.getComplementarity().getScore()));
        
        return recommendations;
    }

    private ComplementarityResult calculateComplementarity(UserProfileDto myProfile, List<Project> myProjects, UserProfileDto candidate) {
        List<String> matchingCapabilities = new ArrayList<>();
        List<String> candidateNeeds = new ArrayList<>();
        List<String> userOffers = new ArrayList<>();
        List<String> projectNeeds = new ArrayList<>();
        List<String> sharedInterests = new ArrayList<>();
        
        int score = 0;

        // 1. What does the candidate offer that my projects need?
        for (Project project : myProjects) {
            if (project.getAnalysis() != null && project.getAnalysis().getGaps() != null) {
                for (ProjectGap gap : project.getAnalysis().getGaps()) {
                    projectNeeds.add(gap.getCapability());
                    
                    // Check if candidate can offer it or has the skill
                    boolean match = false;
                    for (String offer : candidate.getCanOffer()) {
                        if (offer.toLowerCase().contains(gap.getCapability().toLowerCase()) || 
                            gap.getCapability().toLowerCase().contains(offer.toLowerCase())) {
                            match = true;
                            if (!matchingCapabilities.contains(offer)) matchingCapabilities.add(offer);
                        }
                    }
                    if (!match) {
                        for (String skill : candidate.getSkills()) {
                            if (skill.toLowerCase().contains(gap.getCapability().toLowerCase()) || 
                                gap.getCapability().toLowerCase().contains(skill.toLowerCase())) {
                                match = true;
                                if (!matchingCapabilities.contains(skill)) matchingCapabilities.add(skill);
                            }
                        }
                    }
                    if (match) score += 5;
                }
            }
        }

        // 2. What does my profile offer that the candidate is looking for?
        for (String lookingFor : candidate.getLookingFor()) {
            candidateNeeds.add(lookingFor);
            boolean match = false;
            for (String offer : myProfile.getCanOffer()) {
                if (offer.toLowerCase().contains(lookingFor.toLowerCase()) || 
                    lookingFor.toLowerCase().contains(offer.toLowerCase())) {
                    match = true;
                    if (!userOffers.contains(offer)) userOffers.add(offer);
                }
            }
            if (!match) {
                for (String skill : myProfile.getSkills()) {
                    if (skill.toLowerCase().contains(lookingFor.toLowerCase()) || 
                        lookingFor.toLowerCase().contains(skill.toLowerCase())) {
                        match = true;
                        if (!userOffers.contains(skill)) userOffers.add(skill);
                    }
                }
            }
            if (match) score += 5;
        }

        // 3. Shared interests
        for (String myInterest : myProfile.getInterests()) {
            for (String theirInterest : candidate.getInterests()) {
                if (myInterest.equalsIgnoreCase(theirInterest)) {
                    sharedInterests.add(myInterest);
                    score += 2;
                }
            }
        }
        
        // Ensure some baseline score so we show everyone in this mock setup
        if (score == 0) score = 1;

        // Generate dynamic reason
        String reason;
        String collab;
        
        if (!matchingCapabilities.isEmpty() && !userOffers.isEmpty()) {
            reason = String.format("Strong mutual fit. Your project needs %s which %s offers. Meanwhile, they are looking for %s which you can provide.", 
                    matchingCapabilities.get(0), candidate.getName().split(" ")[0], userOffers.get(0));
            collab = "Two-way exchange of skills and capabilities.";
        } else if (!matchingCapabilities.isEmpty()) {
            reason = String.format("They bring %s, which directly addresses a gap in your project.", matchingCapabilities.get(0));
            collab = "They can support your project development.";
        } else if (!userOffers.isEmpty()) {
            reason = String.format("They are actively looking for someone with %s experience, which you possess.", userOffers.get(0));
            collab = "You can mentor or support their initiatives.";
        } else {
            reason = "You both share overlapping professional interests and industry domains.";
            collab = "General networking and knowledge sharing.";
        }

        return ComplementarityResult.builder()
                .candidateId(candidate.getId())
                .matchingCapabilities(matchingCapabilities)
                .candidateNeeds(candidateNeeds)
                .userOffers(userOffers)
                .projectNeeds(projectNeeds)
                .sharedInterests(sharedInterests)
                .context(new ArrayList<>())
                .reason(reason)
                .potentialCollaboration(collab)
                .score(score)
                .build();
    }
}
