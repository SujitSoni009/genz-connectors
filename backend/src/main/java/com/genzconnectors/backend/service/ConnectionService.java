package com.genzconnectors.backend.service;

import com.genzconnectors.backend.model.Connection;
import com.genzconnectors.backend.repository.ConnectionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ConnectionService {
    private final ConnectionRepository connectionRepository;

    public ConnectionService(ConnectionRepository connectionRepository) {
        this.connectionRepository = connectionRepository;
    }

    public List<Connection> getConnections(String userId) {
        return connectionRepository.findByUserId(userId);
    }

    public Connection createConnection(String requesterId, String receiverId) {
        Connection connection = Connection.builder()
                .id(UUID.randomUUID().toString())
                .requesterId(requesterId)
                .receiverId(receiverId)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
                
        connectionRepository.save(connection);
        return connection;
    }

    public Connection acceptConnection(String id) {
        Connection connection = findConnection(id);
        connection.setStatus("ACCEPTED");
        connection.setUpdatedAt(LocalDateTime.now());
        connectionRepository.save(connection);
        return connection;
    }

    public Connection rejectConnection(String id) {
        Connection connection = findConnection(id);
        connection.setStatus("REJECTED");
        connection.setUpdatedAt(LocalDateTime.now());
        connectionRepository.save(connection);
        return connection;
    }
    
    private Connection findConnection(String id) {
        Connection connection = connectionRepository.findById(id);
        if (connection == null) {
            throw new IllegalArgumentException("Connection not found: " + id);
        }
        return connection;
    }
}
