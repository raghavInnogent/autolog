package com.example.backend.dto.vehicle;

import lombok.Data;

@Data
public class VehicleRequestDTO {

    private String registrationNumber;

    private String model;

    private String company;

    private String description;

    private String type;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate purchaseDate;

    private String image;
}
