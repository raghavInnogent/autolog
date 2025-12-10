package com.example.backend.dto.analysis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopUsedVehicleDTO {
    private Long vehicleId;
    private String vehicleName;
    private String registrationNumber;
    private Integer serviceCount;
    private Integer totalMileageCovered;
}