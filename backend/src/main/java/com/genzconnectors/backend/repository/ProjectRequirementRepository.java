package com.genzconnectors.backend.repository;

import com.genzconnectors.backend.model.ProjectRequirement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ProjectRequirementRepository {
    private final DynamoDbTable<ProjectRequirement> table;

    public ProjectRequirementRepository(DynamoDbEnhancedClient client,
                                        @Value("${dynamodb.table.project_requirements:ProjectRequirements}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(ProjectRequirement.class));
    }

    public void save(ProjectRequirement requirement) {
        table.putItem(requirement);
    }

    public ProjectRequirement findById(String id) {
        return table.getItem(Key.builder().partitionValue(id).build());
    }

    public List<ProjectRequirement> findByProjectId(String projectId) {
        return table.scan().items().stream()
                .filter(r -> projectId.equals(r.getProjectId()))
                .collect(Collectors.toList());
    }
}
