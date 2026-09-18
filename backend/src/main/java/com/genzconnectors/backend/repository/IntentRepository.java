package com.genzconnectors.backend.repository;

import com.genzconnectors.backend.model.Intent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class IntentRepository {
    private final DynamoDbTable<Intent> table;

    public IntentRepository(DynamoDbEnhancedClient client,
                            @Value("${dynamodb.table.intents:Intents}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(Intent.class));
    }

    public void save(Intent intent) {
        table.putItem(intent);
    }

    public Intent findById(String id) {
        return table.getItem(Key.builder().partitionValue(id).build());
    }

    public Intent findByUserId(String userId) {
        return table.scan().items().stream()
                .filter(i -> userId.equals(i.getUserId()))
                .findFirst()
                .orElse(null);
    }
}
