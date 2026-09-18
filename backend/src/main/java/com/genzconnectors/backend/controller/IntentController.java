package com.genzconnectors.backend.controller;

import com.genzconnectors.backend.dto.IntentRequest;
import com.genzconnectors.backend.model.Intent;
import com.genzconnectors.backend.service.IntentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/intents")
public class IntentController {

    private final IntentService intentService;

    // Temporary mock user ID until Auth/Cognito is added
    private final String MOCK_USER_ID = "user-123";

    public IntentController(IntentService intentService) {
        this.intentService = intentService;
    }

    @GetMapping("/me")
    public ResponseEntity<Intent> getMyIntent() {
        Intent intent = intentService.getMyIntent(MOCK_USER_ID);
        if (intent == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(intent);
    }

    @PostMapping
    public ResponseEntity<Intent> createIntent(@Valid @RequestBody IntentRequest request) {
        return ResponseEntity.ok(intentService.createIntent(MOCK_USER_ID, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Intent> updateIntent(@PathVariable String id, @Valid @RequestBody IntentRequest request) {
        return ResponseEntity.ok(intentService.updateIntent(id, request));
    }
}
