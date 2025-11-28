package com.example.backend.controller;


import com.example.backend.dto.request.ServiceCategoriesRequestDTO;
import com.example.backend.dto.response.ServiceCategoriesResponseDTO;
import com.example.backend.service.ServiceCategoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
public class ServiceCategoriesController {

    @Autowired
    ServiceCategoriesService serviceCategoriesService;

    @PostMapping("/addCategory")
    public ServiceCategoriesResponseDTO  addCategory(@RequestBody ServiceCategoriesRequestDTO  dto) {
        return serviceCategoriesService.addCategory(dto);
    }
}
