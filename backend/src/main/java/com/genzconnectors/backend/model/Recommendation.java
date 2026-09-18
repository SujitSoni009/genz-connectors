package com.genzconnectors.backend.model;

import com.genzconnectors.backend.dto.UserProfileDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class Recommendation {
    private String id;
    private String candidateId;
    private UserProfileDto user;
    private ComplementarityResult complementarity;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
