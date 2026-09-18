package com.genzconnectors.backend.service;

import com.genzconnectors.backend.dto.ProjectRequest;
import com.genzconnectors.backend.model.Project;
import com.genzconnectors.backend.model.ProjectAnalysis;
import com.genzconnectors.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {
    private final ProjectIntelligenceService intelligenceService;
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectIntelligenceService intelligenceService, ProjectRepository projectRepository) {
        this.intelligenceService = intelligenceService;
        this.projectRepository = projectRepository;
    }

    public Project createProject(String ownerId, ProjectRequest request) {
        Project project = Project.builder()
                .id(UUID.randomUUID().toString())
                .ownerId(ownerId)
                .name(request.getName())
                .description(request.getDescription())
                .domain(request.getDomain())
                .technologies(request.getTechnologies())
                .stage(request.getStage())
                .currentCapabilities(request.getCurrentCapabilities())
                .declaredNeeds(request.getDeclaredNeeds())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
                
        projectRepository.save(project);
        return project;
    }

    public List<Project> getProjects(String ownerId) {
        return projectRepository.findByOwnerId(ownerId);
    }

    public Project getProject(String id) {
        Project project = projectRepository.findById(id);
        if (project == null) {
            throw new IllegalArgumentException("Project not found: " + id);
        }
        return project;
    }

    public Project updateProject(String id, ProjectRequest request) {
        Project project = getProject(id);
        
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setDomain(request.getDomain());
        project.setTechnologies(request.getTechnologies());
        project.setStage(request.getStage());
        project.setCurrentCapabilities(request.getCurrentCapabilities());
        project.setDeclaredNeeds(request.getDeclaredNeeds());
        project.setUpdatedAt(LocalDateTime.now());
        
        projectRepository.save(project);
        return project;
    }

    public void deleteProject(String id) {
        Project project = projectRepository.findById(id);
        if (project == null) {
            throw new IllegalArgumentException("Project not found: " + id);
        }
        projectRepository.deleteById(id);
    }
    
    public ProjectAnalysis analyzeProject(String id) {
        Project project = getProject(id);
        ProjectAnalysis analysis = intelligenceService.analyzeProject(project);
        project.setAnalysis(analysis);
        projectRepository.save(project);
        return analysis;
    }
}
