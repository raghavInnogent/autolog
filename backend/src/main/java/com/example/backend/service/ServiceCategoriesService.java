package com.example.backend.service;

import com.example.backend.dto.request.ServiceCategoriesRequestDTO;
import com.example.backend.dto.response.ServiceCategoriesResponseDTO;
import com.example.backend.entity.ServiceCategories;

import java.util.List;

public interface ServiceCategoriesService {
    ServiceCategoriesResponseDTO addCategory(ServiceCategoriesRequestDTO dto);
    List<ServiceCategoriesResponseDTO> getAll();

}
