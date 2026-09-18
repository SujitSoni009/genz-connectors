package com.genzconnectors.backend.repository;

import com.genzconnectors.backend.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class UserRepository {
    private final DynamoDbTable<User> table;

    public UserRepository(DynamoDbEnhancedClient client,
                          @Value("${dynamodb.table.users:Users}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(User.class));
    }

    public void save(User user) {
        table.putItem(user);
    }

    public User findById(String id) {
        return table.getItem(Key.builder().partitionValue(id).build());
    }

    public List<User> findAll() {
        return table.scan().items().stream().collect(Collectors.toList());
    }
}
