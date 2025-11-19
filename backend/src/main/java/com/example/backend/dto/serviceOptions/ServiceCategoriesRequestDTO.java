package com.example.backend.dto.serviceOptions;

import lombok.Data;
import java.time.Period;

@Data
public class ServiceCategoriesRequestDTO {

    private String itemName;

    private String itemDescription;

    private Integer itemPrice;

    private Period itemQuantity;
}
