package com.example.backend.dto.summary;

import lombok.Data;

@Data
public class VehicleSummaryDTO {

    private Long id;

    private String registrationNumber;

    private String model;

    private String company;

    private String type;

    public VehicleSummaryDTO(Long id, String company, String model, String registrationNumber) {
        this.id = id;
        this.company = company;
        this.model = model;
        this.registrationNumber = registrationNumber;
    }
}
