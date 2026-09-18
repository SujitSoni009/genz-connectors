package com.genzconnectors.backend.controller;

import com.genzconnectors.backend.model.Recommendation;
import com.genzconnectors.backend.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    // Temporary mock user ID until Auth/Cognito is added
    private final String MOCK_USER_ID = "user-123";

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<List<Recommendation>> getRecommendations() {
        return ResponseEntity.ok(recommendationService.getRecommendations(MOCK_USER_ID));
    }
}
