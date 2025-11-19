package com.example.backend.dto.vehicle;

import lombok.Data;

@Data
public class VehicleSummaryDTO {

    private Long id;

    private String registrationNumber;

    private String model;

    private String company;

    private String type;
}
