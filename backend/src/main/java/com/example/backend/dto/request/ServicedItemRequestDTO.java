package com.example.backend.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ServicedItemRequestDTO {

    private Long serviceCategoryId;

    private LocalDate expirationDate;

    private Integer quantity;

    @Override
    public String toString() {
        return "ServicedItemRequestDTO{" +
                "serviceCategoryId=" + serviceCategoryId +
                ", expirationDate=" + expirationDate +
                ", quantity=" + quantity +
                '}';
    }
}
