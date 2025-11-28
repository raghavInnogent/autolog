package com.example.backend.dto.response;

import lombok.Data;
import java.time.Period;

@Data
public class ServiceCategoriesResponseDTO {

    private Long id;

    private String name;

    private String description;

    private Integer price;

    private String image;

    private Integer expiryInMonths;
}
