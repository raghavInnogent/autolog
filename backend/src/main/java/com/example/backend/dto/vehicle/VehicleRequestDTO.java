package com.example.backend.dto.vehicle;

import lombok.Data;

@Data
public class VehicleRequestDTO {

    private String registrationNumber;

    private String model;

    private String company;

    private String description;

    private String type;
}
