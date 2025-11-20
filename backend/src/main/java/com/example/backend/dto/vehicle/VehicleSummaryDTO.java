package com.example.backend.dto.vehicle;

import lombok.Data;

@Data
public class VehicleSummaryDTO {

    private Long id;

    private String vehicleNumber;

    private String model;

    private String company;

    private String type;

    public VehicleSummaryDTO(Long id, String company, String model, String vehicleNumber) {
    }
}
