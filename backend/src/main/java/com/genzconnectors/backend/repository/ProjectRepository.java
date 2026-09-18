package com.genzconnectors.backend.repository;

import com.genzconnectors.backend.model.Project;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ProjectRepository {
    private final DynamoDbTable<Project> table;

    public ProjectRepository(DynamoDbEnhancedClient client,
                             @Value("${dynamodb.table.projects:Projects}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(Project.class));
    }

    public void save(Project project) {
        table.putItem(project);
    }

    public Project findById(String id) {
        return table.getItem(Key.builder().partitionValue(id).build());
    }

    public List<Project> findByOwnerId(String ownerId) {
        return table.scan().items().stream()
                .filter(p -> ownerId.equals(p.getOwnerId()))
                .collect(Collectors.toList());
    }

    public void deleteById(String id) {
        table.deleteItem(Key.builder().partitionValue(id).build());
    }
}
