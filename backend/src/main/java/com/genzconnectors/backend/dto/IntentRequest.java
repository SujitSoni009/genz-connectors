package com.genzconnectors.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class IntentRequest {
    @NotEmpty(message = "At least one intent type must be provided")
    private List<String> types;
    
    private String description;
}
