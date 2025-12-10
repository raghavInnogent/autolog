package com.example.backend.dto.analysis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleExpenditureDTO {
    private Long vehicleId;
    private String vehicleName;
    private String registrationNumber;
    private Double totalExpenditure;
    private Integer serviceCount;
}
