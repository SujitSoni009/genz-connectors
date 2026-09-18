package com.genzconnectors.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class ProjectAnalysis {
    private String projectId;
    private String summary;
    private List<String> strengths;
    private List<ProjectGap> gaps;
    private List<String> recommendedCapabilities;
    private String collaborationOpportunities;
    private LocalDateTime analyzedAt;
}
