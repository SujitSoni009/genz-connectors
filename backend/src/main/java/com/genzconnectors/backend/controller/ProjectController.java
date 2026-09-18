package com.genzconnectors.backend.controller;

import com.genzconnectors.backend.dto.ProjectRequest;
import com.genzconnectors.backend.model.Project;
import com.genzconnectors.backend.model.ProjectAnalysis;
import com.genzconnectors.backend.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    // Temporary mock user ID until Auth/Cognito is added
    private final String MOCK_USER_ID = "user-123";

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.createProject(MOCK_USER_ID, request));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjects() {
        return ResponseEntity.ok(projectService.getProjects(MOCK_USER_ID));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/analyze")
    public ResponseEntity<ProjectAnalysis> analyzeProject(@PathVariable String id) {
        return ResponseEntity.ok(projectService.analyzeProject(id));
    }
}
