package com.example.backend.dto.ocr;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicedItemsOCR_DTO {
    private String itemName;
    private Integer quantity;
    private Integer expiryInMonth;
    private Integer perItemCost;

}
