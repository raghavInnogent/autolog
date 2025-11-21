package com.example.backend.service;

import com.example.backend.dto.user.UserResponseDTO;
import jakarta.servlet.http.HttpSession;

public interface AuthService {
    UserResponseDTO login(String email, String password);
    void logout();
    UserResponseDTO getCurrentUser();
}