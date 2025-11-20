package com.example.backend.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ServicedItemsResponseDTO {

    private Long id;

    private ServiceCategoriesResponseDTO servicedOption;

    private LocalDate expirationDate;

    private Integer quantity;
}
