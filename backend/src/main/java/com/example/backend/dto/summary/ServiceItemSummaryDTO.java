package com.example.backend.dto.summary;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceItemSummaryDTO {

    private Long id;
    private Long serviceCategoryId;
    private String categoryName;
    private Integer quantity;
    private LocalDate expirationDate;
    private LocalDate lastReplacedDate;
}