package com.genzconnectors.backend.controller;

import com.genzconnectors.backend.dto.ProfileRequest;
import com.genzconnectors.backend.model.Profile;
import com.genzconnectors.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    // Temporary mock user ID until Auth/Cognito is added
    private final String MOCK_USER_ID = "user-123";

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<Profile> getMyProfile() {
        Profile profile = profileService.getMyProfile(MOCK_USER_ID);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<Profile> updateMyProfile(@Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(profileService.updateMyProfile(MOCK_USER_ID, request));
    }
}
