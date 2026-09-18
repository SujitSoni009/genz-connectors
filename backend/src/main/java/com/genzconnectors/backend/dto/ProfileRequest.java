package com.genzconnectors.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ProfileRequest {
    @NotBlank(message = "Headline cannot be empty")
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
}
