package com.example.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.dto.vehicle.VehicleRequestDTO;
import com.example.backend.dto.vehicle.VehicleResponseDTO;

@Service
public interface VehicleService {
    VehicleResponseDTO create(Long ownerId, VehicleRequestDTO dto);
    VehicleResponseDTO getById(Long id, Long userId);
    List<VehicleResponseDTO> getAll(Long userId);
    VehicleResponseDTO update(Long id, Long userId, VehicleRequestDTO dto);
    void delete(Long id, Long userId);
}