package com.genzconnectors.backend.dto;

import com.genzconnectors.backend.model.Profile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class UserProfileDto {
    private String id;
    private String name;
    private String email;
    private String avatarUrl;
    
    // Profile fields flattened for frontend convenience
    private String headline;
    private String bio;
    private String location;
    private String university;
    private String company;
    private String role;
    private String experience;
    private java.util.List<String> skills;
    private java.util.List<String> interests;
    private java.util.List<String> canOffer;
    private java.util.List<String> lookingFor;
    private String availability;
}
