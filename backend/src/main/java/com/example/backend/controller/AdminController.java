package com.example.backend.controller;

import com.example.backend.dto.request.PasswordUpdateRequestDTO;
import com.example.backend.dto.request.ServiceCategoriesRequestDTO;
import com.example.backend.dto.request.UserRequestDTO;
import com.example.backend.dto.response.ServiceCategoriesResponseDTO;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.service.AdminService;
import com.example.backend.service.ServiceCategoriesService;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    @PostMapping("/create")
    public ResponseEntity<UserResponseDTO> create(@Valid @RequestBody UserRequestDTO dto) {
        return ResponseEntity.status(201).body(userService.create(dto));
    }

    @GetMapping("/getById/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @PutMapping("/updateById/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> update(@PathVariable Long id,
            @RequestBody UserRequestDTO dto) {
        return ResponseEntity.ok(userService.update(id, dto));
    }

    @DeleteMapping("/deleteById/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/updatePassword")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody PasswordUpdateRequestDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated())
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        userService.updatePassword(auth.getName(), dto.getOldPassword(), dto.getNewPassword());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/updateStatus/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return adminService.updateUserStatus(id, status);
    }

}
