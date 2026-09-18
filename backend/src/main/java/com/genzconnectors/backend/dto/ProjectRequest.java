package com.genzconnectors.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ProjectRequest {
    @NotBlank(message = "Project name cannot be empty")
    private String name;
    
    @NotBlank(message = "Project description cannot be empty")
    private String description;
    
    private String domain;
    private List<String> technologies;
    private String stage;
    private List<String> currentCapabilities;
    private List<String> declaredNeeds;
}
