package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceHistoryResponseDTO {

    private Long id;
    private Long vehicleId;
    private Long serviceCategoryId;
    private String serviceCategoryName;
    private Long oldServicedItemId;
    private Long newServicedItemId;
    private LocalDate originalExpiryDate;
    private LocalDate actualReplacementDate;
    private Boolean isPrematureReplacement;
    private Integer daysBeforeExpiry;
    private String replacementReason;
    private Integer replacementFrequency;
    private LocalDateTime createdAt;
}