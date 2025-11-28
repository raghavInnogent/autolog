package com.example.backend.controller;

import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.service.AuthService;
import com.example.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req){
        UserResponseDTO user = authService.login(req.email, req.password);
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), "USER");
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(){
        authService.logout();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getCurrentUser")
    public ResponseEntity<UserResponseDTO> getCurrentUser(){
        return ResponseEntity.ok(authService.getCurrentUser());
    }

    public static class LoginRequest{
        public String email;
        public String password;
    }

    public static class AuthResponse{
        public String token;
        public UserResponseDTO user;
        public AuthResponse(String token, UserResponseDTO user){
            this.token = token;
            this.user = user;
        }
    }
}