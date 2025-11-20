package com.example.backend.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ServicedItemRequestDTO {

    private Long serviceOptionsId;

    private LocalDate expirationDate;

    private Integer quantity;
}
