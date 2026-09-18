package com.genzconnectors.backend.service;

import com.genzconnectors.backend.model.Project;
import com.genzconnectors.backend.model.ProjectAnalysis;
import com.genzconnectors.backend.model.ProjectGap;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectIntelligenceService {

    public ProjectAnalysis analyzeProject(Project project) {
        List<String> strengths = new ArrayList<>();
        List<ProjectGap> gaps = new ArrayList<>();
        List<String> recommendedCapabilities = new ArrayList<>();
        
        List<String> tech = project.getTechnologies() != null ? project.getTechnologies() : new ArrayList<>();
        List<String> caps = project.getCurrentCapabilities() != null ? project.getCurrentCapabilities() : new ArrayList<>();
        List<String> needs = project.getDeclaredNeeds() != null ? project.getDeclaredNeeds() : new ArrayList<>();
        
        // Very basic deterministic logic for demonstration
        if (tech.contains("Java") || tech.contains("Spring Boot") || caps.contains("Backend")) {
            strengths.add("Backend Development");
        }
        if (tech.contains("React") || tech.contains("Next.js") || caps.contains("Frontend")) {
            strengths.add("Frontend Development");
        }
        if (tech.contains("AWS") || caps.contains("Cloud")) {
            strengths.add("Cloud Infrastructure");
        }
        
        // Add all declared needs as high priority gaps
        for (String need : needs) {
            gaps.add(ProjectGap.builder()
                    .id(UUID.randomUUID().toString())
                    .capability(need)
                    .priority("High")
                    .reason("Explicitly declared as a need by project owner")
                    .build());
            recommendedCapabilities.add(need);
        }
        
        // Infer gaps based on missing common components
        if (!strengths.contains("Frontend Development") && !needs.contains("Frontend Development")) {
            gaps.add(ProjectGap.builder()
                    .id(UUID.randomUUID().toString())
                    .capability("Frontend Development")
                    .priority("Medium")
                    .reason("No frontend capabilities explicitly listed in technologies")
                    .build());
            recommendedCapabilities.add("Frontend Development");
            recommendedCapabilities.add("UI/UX Design");
        }
        
        if (!strengths.contains("Backend Development") && !needs.contains("Backend Development")) {
            gaps.add(ProjectGap.builder()
                    .id(UUID.randomUUID().toString())
                    .capability("Backend Development")
                    .priority("Medium")
                    .reason("No backend frameworks detected in stack")
                    .build());
            recommendedCapabilities.add("Backend Development");
        }
        
        String summary = String.format("A %s project in the %s domain. Currently strong in %d areas but needs support in %d areas.", 
                project.getStage() != null ? project.getStage() : "early", 
                project.getDomain() != null ? project.getDomain() : "general", 
                strengths.size(), gaps.size());
                
        String collabOpp = "Great opportunity for individuals skilled in " + String.join(" and ", recommendedCapabilities);

        return ProjectAnalysis.builder()
                .projectId(project.getId())
                .summary(summary)
                .strengths(strengths)
                .gaps(gaps)
                .recommendedCapabilities(recommendedCapabilities)
                .collaborationOpportunities(collabOpp)
                .analyzedAt(LocalDateTime.now())
                .build();
    }
}
