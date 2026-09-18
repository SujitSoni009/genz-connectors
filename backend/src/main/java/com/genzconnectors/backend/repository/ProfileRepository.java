package com.genzconnectors.backend.repository;

import com.genzconnectors.backend.model.Profile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ProfileRepository {
    private final DynamoDbTable<Profile> table;

    public ProfileRepository(DynamoDbEnhancedClient client,
                             @Value("${dynamodb.table.profiles:Profiles}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(Profile.class));
    }

    public void save(Profile profile) {
        table.putItem(profile);
    }

    public Profile findById(String id) {
        return table.getItem(Key.builder().partitionValue(id).build());
    }

    public List<Profile> findAll() {
        return table.scan().items().stream().collect(Collectors.toList());
    }

    public Profile findByUserId(String userId) {
        // Simple scan approach as requested for simple access patterns without GSI overhead right now
        return table.scan().items().stream()
                .filter(p -> userId.equals(p.getUserId()))
                .findFirst()
                .orElse(null);
    }
}
