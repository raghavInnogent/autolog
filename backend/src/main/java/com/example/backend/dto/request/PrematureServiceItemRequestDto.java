package com.example.backend.dto.request;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
@Component
public class PrematureServiceItemRequestDto {

    private Long userId;
    private Long vehicleId;
    private Long categoryId;
    private int prematureCount;
}
