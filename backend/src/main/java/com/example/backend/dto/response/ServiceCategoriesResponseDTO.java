package com.example.backend.dto.response;

import lombok.Data;
import java.time.Period;

@Data
public class ServiceCategoriesResponseDTO {

    private Long id;

    private String itemName;

    private String itemDescription;

    private Integer itemPrice;

    private Period itemQuantity;
}
