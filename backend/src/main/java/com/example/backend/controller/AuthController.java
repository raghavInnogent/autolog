package com.example.backend.controller;

import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.service.AuthService;
import com.example.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
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
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(){
        authService.logout();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sendOtp")
    public ResponseEntity<Void> sendOtp(@RequestParam String email){
        authService.sendOtp(email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/verifyOtp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam Integer otp){
        String response = authService.verifyOtp(email,otp);
        return response.equals("verified")? ResponseEntity.ok(response): ResponseEntity.badRequest().body(response);
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