package com.genzconnectors.backend.service;

import com.genzconnectors.backend.dto.IntentRequest;
import com.genzconnectors.backend.model.Intent;
import com.genzconnectors.backend.repository.IntentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class IntentService {
    private final IntentRepository intentRepository;

    public IntentService(IntentRepository intentRepository) {
        this.intentRepository = intentRepository;
    }

    public Intent getMyIntent(String userId) {
        return intentRepository.findByUserId(userId);
    }

    public Intent createIntent(String userId, IntentRequest request) {
        Intent intent = intentRepository.findByUserId(userId);
        if (intent == null) {
            intent = Intent.builder()
                    .id(UUID.randomUUID().toString())
                    .userId(userId)
                    .createdAt(LocalDateTime.now())
                    .build();
        }
        
        intent.setTypes(request.getTypes());
        intent.setDescription(request.getDescription());
        intent.setUpdatedAt(LocalDateTime.now());
        
        intentRepository.save(intent);
        return intent;
    }

    public Intent updateIntent(String id, IntentRequest request) {
        Intent intent = intentRepository.findById(id);
        if (intent != null) {
            intent.setTypes(request.getTypes());
            intent.setDescription(request.getDescription());
            intent.setUpdatedAt(LocalDateTime.now());
            intentRepository.save(intent);
            return intent;
        }
        throw new IllegalArgumentException("Intent not found with id: " + id);
    }
}
