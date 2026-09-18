package com.genzconnectors.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HealthResponse {
    private String status;
    private String service;
    private String version;
}
