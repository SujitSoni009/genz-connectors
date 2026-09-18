package com.genzconnectors.backend.repository;

import com.genzconnectors.backend.model.Recommendation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class RecommendationRepository {
    private final DynamoDbTable<Recommendation> table;

    public RecommendationRepository(DynamoDbEnhancedClient client,
                                    @Value("${dynamodb.table.recommendations:Recommendations}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(Recommendation.class));
    }

    public void save(Recommendation recommendation) {
        table.putItem(recommendation);
    }

    public Recommendation findById(String id) {
        return table.getItem(Key.builder().partitionValue(id).build());
    }

    public List<Recommendation> findAll() {
        return table.scan().items().stream().collect(Collectors.toList());
    }
}
