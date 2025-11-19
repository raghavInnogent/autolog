package com.example.backend.dto.serviceRecord;

import lombok.Data;
import java.time.LocalDate;

import com.example.backend.dto.serviceOptions.ServiceCategoriesResponseDTO;
import com.example.backend.entity.ServiceCategories;

@Data
public class ServicedItemsResponseDTO {

    private Long id;

    private ServiceCategoriesResponseDTO servicedOption;

    private LocalDate expirationDate;

    private Integer quantity;
}
