package com.example.backend.service;

import com.example.backend.dto.response.ServiceHistoryResponseDTO;
import com.example.backend.entity.ServiceHistory;
import com.example.backend.entity.ServicedItems;

import java.util.List;

public interface ServiceHistoryService {

    // Creation methods
    ServiceHistoryResponseDTO createHistory(ServiceHistory history);
    void checkAndCreatePrematureReplacementHistory(ServicedItems newItem, Long vehicleId);

    // Query methods
    List<ServiceHistoryResponseDTO> getByVehicle(Long vehicleId, Long userId);
    List<ServiceHistoryResponseDTO> getPrematureReplacements(Long vehicleId, Long userId);
    Integer getReplacementFrequency(Long vehicleId, Long categoryId);
    ServiceHistoryResponseDTO getById(Long id, Long userId);
}