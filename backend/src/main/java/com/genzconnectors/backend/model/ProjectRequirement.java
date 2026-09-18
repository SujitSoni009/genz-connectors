package com.genzconnectors.backend.model;

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
public class ProjectRequirement {
    private String id;
    private String projectId;
    private String capability;
    private String priority;
    private String reason;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
