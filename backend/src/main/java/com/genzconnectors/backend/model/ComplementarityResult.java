package com.genzconnectors.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class ComplementarityResult {
    private String candidateId;
    private List<String> matchingCapabilities;
    private List<String> candidateNeeds;
    private List<String> userOffers;
    private List<String> projectNeeds;
    private List<String> sharedInterests;
    private List<String> context;
    private String reason;
    private String potentialCollaboration;
    private int score;
}
