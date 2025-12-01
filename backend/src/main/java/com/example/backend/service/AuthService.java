package com.example.backend.service;

import org.springframework.stereotype.Service;

import com.example.backend.dto.user.UserResponseDTO;
import jakarta.servlet.http.HttpSession;

@Service
public interface AuthService {
    UserResponseDTO login(String email, String password);
    void logout();
    UserResponseDTO getCurrentUser();
}