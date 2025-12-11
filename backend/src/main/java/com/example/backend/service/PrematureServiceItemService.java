package com.example.backend.service;

import com.example.backend.dto.request.PrematureServiceItemRequestDto;
import com.example.backend.dto.response.PrematureItemResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PrematureServiceItemService {

    ResponseEntity<PrematureItemResponseDto> savePrematureItem(PrematureServiceItemRequestDto itemDto);

    ResponseEntity<PrematureItemResponseDto> updatePrematureItem(PrematureServiceItemRequestDto itemDto);

    ResponseEntity<Void> deletePrematureItem(Long id);

    ResponseEntity<List<PrematureItemResponseDto>> getAllPrematureItemsByUserId(Long userId);

    ResponseEntity<Integer> getTotalPrematureCountByCategoryId(Long categoryId);

    ResponseEntity<Integer> getTotalPrematureCountByVehicleIdAndCategoryId(Long vehicleId, Long categoryId);

    ResponseEntity<Integer> getAdminTotalPrematureCountForAllCategories();

    ResponseEntity<List<PrematureItemResponseDto>> getPrematureByVehicleId(Long vehicleId);

    ResponseEntity<List<PrematureItemResponseDto>> getPrematureItemByUserIdAndVehicleId(Long userId, Long vehicleId);
}
