package com.example.backend.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ServicedItemResponseDTO {

    private Long id;

    private Long categoryId;

    private String categoryName;
    
    private LocalDate expirationDate;

    private Integer quantity;

    private Integer costPerItem;
}
