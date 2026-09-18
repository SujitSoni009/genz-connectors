package com.genzconnectors.backend.controller;

import com.genzconnectors.backend.model.Connection;
import com.genzconnectors.backend.service.ConnectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;

    // Temporary mock user ID until Auth/Cognito is added
    private final String MOCK_USER_ID = "user-123";

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @GetMapping
    public ResponseEntity<List<Connection>> getConnections() {
        return ResponseEntity.ok(connectionService.getConnections(MOCK_USER_ID));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Connection> createConnection(@PathVariable String userId) {
        // Here MOCK_USER_ID is requesting to connect with the target userId
        return ResponseEntity.ok(connectionService.createConnection(MOCK_USER_ID, userId));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Connection> acceptConnection(@PathVariable String id) {
        return ResponseEntity.ok(connectionService.acceptConnection(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Connection> rejectConnection(@PathVariable String id) {
        return ResponseEntity.ok(connectionService.rejectConnection(id));
    }
}
