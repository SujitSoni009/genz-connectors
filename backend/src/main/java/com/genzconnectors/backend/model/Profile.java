package com.genzconnectors.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class Profile {
    private String id;
    private String userId;
    private String headline;
    private String bio;
    private String university;
    private String company;
    private String role;
    private String experience;
    private String location;
    private List<String> skills;
    private List<String> interests;
    private List<String> canOffer;
    private List<String> lookingFor;
    private String availability;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
