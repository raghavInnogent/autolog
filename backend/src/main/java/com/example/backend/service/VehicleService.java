package com.example.backend.service;

import com.example.backend.dto.request.VehicleRequestDTO;
import com.example.backend.dto.response.VehicleResponseDTO;
import com.example.backend.entity.Vehicle;

import java.util.List;

public interface VehicleService {
    VehicleResponseDTO create(Long ownerId, VehicleRequestDTO dto);
    VehicleResponseDTO getById(Long id, Long userId);
    List<VehicleResponseDTO> getAll(Long userId);
    VehicleResponseDTO update(Long id, Long userId, VehicleRequestDTO dto);
    void delete(Long id, Long userId);
    Vehicle findVehicleByRegistrationNo(String registrationNo);
}