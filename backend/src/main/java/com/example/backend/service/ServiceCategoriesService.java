package com.example.backend.service;

import com.example.backend.dto.request.ServiceCategoriesRequestDTO;
import com.example.backend.dto.response.ServiceCategoriesResponseDTO;
import com.example.backend.entity.ServiceCategories;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

public interface ServiceCategoriesService {
    ServiceCategoriesResponseDTO addCategory(ServiceCategoriesRequestDTO dto);

    List<ServiceCategoriesResponseDTO> getAll();

    ServiceCategoriesResponseDTO addNewServiceCategory(ServiceCategoriesRequestDTO dto);
   ResponseEntity< ServiceCategoriesResponseDTO> updateCategory(Long id, ServiceCategoriesRequestDTO dto);

    void deleteCategory(Long id);

    ServiceCategories findById(Long categoryId);

}
