package com.genzconnectors.backend.controller;

import com.genzconnectors.backend.dto.HealthResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public HealthResponse checkHealth() {
        return HealthResponse.builder()
                .status("UP")
                .service("GenZ Connectors Backend")
                .version("1.0.0")
                .build();
    }
}
