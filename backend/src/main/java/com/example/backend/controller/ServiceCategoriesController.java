package com.example.backend.controller;

import com.example.backend.dto.request.ServiceCategoriesRequestDTO;
import com.example.backend.dto.response.ServiceCategoriesResponseDTO;
import com.example.backend.service.ServiceCategoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class ServiceCategoriesController {

    @Autowired
    ServiceCategoriesService serviceCategoriesService;

    @PostMapping("/addCategory")
    public ServiceCategoriesResponseDTO addCategory(@RequestBody ServiceCategoriesRequestDTO dto) {
        return serviceCategoriesService.addCategory(dto);
    }

    @GetMapping("/getAll")
    public List<ServiceCategoriesResponseDTO> getAll() {
        return serviceCategoriesService.getAll();
    }


    @PostMapping("/addNewServiceCategory")
    public ServiceCategoriesResponseDTO addNewServiceCategory(@RequestBody ServiceCategoriesRequestDTO dto)
    {
        return serviceCategoriesService.addNewServiceCategory(dto);
    }

    @PutMapping("/updateCategory/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceCategoriesResponseDTO> updateCategory(@PathVariable Long id,
                                                                      @RequestBody ServiceCategoriesRequestDTO dto) {
        return serviceCategoriesService.updateCategory(id, dto);
    }

    @DeleteMapping("/deleteCategory/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCategory(@PathVariable Long id) {
        serviceCategoriesService.deleteCategory(id);
    }
}