package com.genzconnectors.backend.repository;

import com.genzconnectors.backend.model.Connection;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ConnectionRepository {
    private final DynamoDbTable<Connection> table;

    public ConnectionRepository(DynamoDbEnhancedClient client,
                                @Value("${dynamodb.table.connections:Connections}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(Connection.class));
    }

    public void save(Connection connection) {
        table.putItem(connection);
    }

    public Connection findById(String id) {
        return table.getItem(Key.builder().partitionValue(id).build());
    }

    public List<Connection> findByUserId(String userId) {
        return table.scan().items().stream()
                .filter(c -> userId.equals(c.getRequesterId()) || userId.equals(c.getReceiverId()))
                .collect(Collectors.toList());
    }
}
