package com.genzconnectors.backend.service;

import com.genzconnectors.backend.dto.ProfileRequest;
import com.genzconnectors.backend.dto.UserProfileDto;
import com.genzconnectors.backend.model.Profile;
import com.genzconnectors.backend.model.User;
import com.genzconnectors.backend.repository.ProfileRepository;
import com.genzconnectors.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public List<UserProfileDto> getAllCandidateProfiles(String currentUserId) {
        return profileRepository.findAll().stream()
                .filter(p -> !p.getUserId().equals(currentUserId))
                .map(this::buildUserProfileDto)
                .collect(Collectors.toList());
    }

    public UserProfileDto getUserProfile(String userId) {
        Profile profile = profileRepository.findByUserId(userId);
        if (profile != null) {
            return buildUserProfileDto(profile);
        }
        return null;
    }

    private UserProfileDto buildUserProfileDto(Profile profile) {
        User user = userRepository.findById(profile.getUserId());
        if (user == null) {
            user = User.builder().id(profile.getUserId()).name("Unknown").build();
        }
        return buildUserProfileDto(user, profile);
    }

    private UserProfileDto buildUserProfileDto(User user, Profile profile) {
        return UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getId())
                .headline(profile.getHeadline())
                .bio(profile.getBio())
                .location(profile.getLocation())
                .university(profile.getUniversity())
                .company(profile.getCompany())
                .role(profile.getRole())
                .experience(profile.getExperience())
                .skills(profile.getSkills() != null ? profile.getSkills() : new ArrayList<>())
                .interests(profile.getInterests() != null ? profile.getInterests() : new ArrayList<>())
                .canOffer(profile.getCanOffer() != null ? profile.getCanOffer() : new ArrayList<>())
                .lookingFor(profile.getLookingFor() != null ? profile.getLookingFor() : new ArrayList<>())
                .availability(profile.getAvailability())
                .build();
    }

    public Profile getMyProfile(String userId) {
        return profileRepository.findByUserId(userId);
    }

    public Profile updateMyProfile(String userId, ProfileRequest request) {
        Profile profile = profileRepository.findByUserId(userId);
        if (profile == null) {
            profile = Profile.builder()
                    .id(UUID.randomUUID().toString())
                    .userId(userId)
                    .build();
        }

        profile.setHeadline(request.getHeadline());
        profile.setBio(request.getBio());
        profile.setUniversity(request.getUniversity());
        profile.setCompany(request.getCompany());
        profile.setRole(request.getRole());
        profile.setExperience(request.getExperience());
        profile.setLocation(request.getLocation());
        profile.setSkills(request.getSkills());
        profile.setInterests(request.getInterests());
        profile.setCanOffer(request.getCanOffer());
        profile.setLookingFor(request.getLookingFor());
        profile.setAvailability(request.getAvailability());

        profileRepository.save(profile);

        // Also ensure user exists for mockup purposes
        if (userRepository.findById(userId) == null) {
            userRepository.save(User.builder()
                    .id(userId)
                    .name("Current User")
                    .email("current@example.com")
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        return profile;
    }
}
