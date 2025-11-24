package com.example.backend.service;

import com.example.backend.dto.response.UserResponseDTO;

public interface AuthService {
    UserResponseDTO login(String email, String password);
    void logout();
    UserResponseDTO getCurrentUser();
}