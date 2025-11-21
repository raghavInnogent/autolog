package com.example.backend.controller;

import com.example.backend.dto.vehicle.VehicleRequestDTO;
import com.example.backend.dto.vehicle.VehicleResponseDTO;
import com.example.backend.service.VehicleService;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;
    @Autowired
    private UserRepository userRepository;



    @GetMapping("getAll")
    public ResponseEntity<List<VehicleResponseDTO>> getAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Long userId = userRepository.findByEmail(email).getId();
        return ResponseEntity.ok(vehicleService.getAll(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponseDTO> get(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Long userId = userRepository.findByEmail(email).getId();
        return ResponseEntity.ok(vehicleService.getById(id, userId));
    }

    @PostMapping
    public ResponseEntity<VehicleResponseDTO> create(@RequestBody VehicleRequestDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth == null || !auth.isAuthenticated()) return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body(null);
        String email = auth.getName();
        Long ownerId = userRepository.findByEmail(email).getId();
        return ResponseEntity.status(201).body(vehicleService.create(ownerId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponseDTO> update(@PathVariable Long id,
                                                     @RequestBody VehicleRequestDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Long userId = userRepository.findByEmail(email).getId();
        return ResponseEntity.ok(vehicleService.update(id, userId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Long userId = userRepository.findByEmail(email).getId();
        vehicleService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}