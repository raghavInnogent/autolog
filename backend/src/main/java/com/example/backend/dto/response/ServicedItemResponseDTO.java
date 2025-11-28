package com.example.backend.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ServicedItemResponseDTO {

    private Long id;

    private Long serviceCategoryId;
    
    private LocalDate expirationDate;

    private Integer quantity;
}
