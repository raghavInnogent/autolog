package com.example.backend.dto.serviceRecord;

import lombok.Data;
import java.time.LocalDate;

import com.example.backend.dto.serviceOptions.ServiceCategoriesResponseDTO;

@Data
public class ServicedItemsResponseDTO {

    private Long id;

    private ServiceCategoriesResponseDTO servicedOption;

    private LocalDate expirationDate;

    private Integer quantity;
}
