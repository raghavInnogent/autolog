package com.example.backend.controller;

import com.example.backend.dto.response.ServiceHistoryResponseDTO;
import com.example.backend.security.UserPrincipal;
import com.example.backend.service.ServiceHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-history")
@RequiredArgsConstructor
public class ServiceHistoryController {

    private final ServiceHistoryService serviceHistoryService;

    @GetMapping("/getServiceHistoryByVehicle/{vehicleId}")
    public ResponseEntity<List<ServiceHistoryResponseDTO>> getServiceHistoryByVehicle(
            @PathVariable Long vehicleId,
            Authentication authentication
    ) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        List<ServiceHistoryResponseDTO> history = serviceHistoryService.getByVehicle(vehicleId, userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/getPrematureReplacements/{vehicleId}")
    public ResponseEntity<List<ServiceHistoryResponseDTO>> getPrematureReplacements(
            @PathVariable Long vehicleId,
            Authentication authentication
    ) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        List<ServiceHistoryResponseDTO> history = serviceHistoryService.getPrematureReplacements(vehicleId, userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/getReplacementFrequency/{vehicleId}/{categoryId}")
    public ResponseEntity<Integer> getReplacementFrequency(
            @PathVariable Long vehicleId,
            @PathVariable Long categoryId,
            Authentication authentication
    ) {
        // Authentication check is done inside service
        Integer frequency = serviceHistoryService.getReplacementFrequency(vehicleId, categoryId);
        return ResponseEntity.ok(frequency);
    }

    @GetMapping("/getServiceHistoryById/{id}")
    public ResponseEntity<ServiceHistoryResponseDTO> getServiceHistoryById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        ServiceHistoryResponseDTO history = serviceHistoryService.getById(id, userId);
        return ResponseEntity.ok(history);
    }
}