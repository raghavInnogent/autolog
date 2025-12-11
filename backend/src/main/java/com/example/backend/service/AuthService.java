package com.example.backend.service;

import com.example.backend.dto.response.UserResponseDTO;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    UserResponseDTO login(String email, String password);
    void logout();
    UserResponseDTO getCurrentUser();

    void sendOtp(String email);

    String verifyOtp(String email, Integer otp);
}