package com.example.backend.dto.request;

import lombok.Data;
import java.time.Period;

@Data
public class ServiceCategoriesRequestDTO {

    private String itemName;

    private String itemDescription;

    private Integer itemPrice;

    private Period itemQuantity;
}
