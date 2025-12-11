package com.example.backend.dto.response;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
@Component
public class PrematureItemResponseDto {
    private String categoryName;
    private String vehicleName;
    private Long prematureCount;
}
