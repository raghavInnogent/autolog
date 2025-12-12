package com.example.backend.service;

import com.example.backend.dto.request.PrematureServiceItemRequestDto;
import com.example.backend.dto.response.PrematureItemResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PrematureServiceItemService {

    PrematureItemResponseDto savePrematureItem(PrematureServiceItemRequestDto itemDto);

    PrematureItemResponseDto updatePrematureItem(PrematureServiceItemRequestDto itemDto);

    List<PrematureItemResponseDto> getAllPrematureItemsByUserId(Long userId);

    Integer getTotalPrematureCountByCategoryId(Long categoryId);

    Integer getTotalPrematureCountByVehicleIdAndCategoryId(Long vehicleId, Long categoryId);

    Integer getAdminTotalPrematureCountForAllCategories();

    List<PrematureItemResponseDto> getPrematureByVehicleId(Long vehicleId);

    List<PrematureItemResponseDto> getPrematureItemByUserIdAndVehicleId(Long userId, Long vehicleId);
}
