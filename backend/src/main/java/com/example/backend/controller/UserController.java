package com.example.backend.controller;

import com.example.backend.dto.user.UserRequestDTO;
import com.example.backend.dto.user.UserResponseDTO;
import com.example.backend.dto.user.PasswordUpdateRequestDTO;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/users")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<UserResponseDTO> create(@Valid @RequestBody UserRequestDTO dto) {
        return ResponseEntity.status(201).body(userService.create(dto));
    }


    @GetMapping("/getById/{id}")
    public ResponseEntity<UserResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<UserResponseDTO>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }


    @PutMapping("/updateById/{id}")
    public ResponseEntity<UserResponseDTO> update(@PathVariable Long id,@RequestBody UserRequestDTO dto)
    {
        return ResponseEntity.ok(userService.update(id, dto));
    }


    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody PasswordUpdateRequestDTO dto){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth==null || !auth.isAuthenticated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        userService.updatePassword(auth.getName(), dto.getOldPassword(), dto.getNewPassword());
        return ResponseEntity.ok().build();
    }
}
