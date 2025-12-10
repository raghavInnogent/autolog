package com.example.backend.dto.request;

import lombok.Data;

@Data
public class ServiceCategoriesRequestDTO {

    private String name;
    private String description;
    private Integer expiryInMonths;
}

