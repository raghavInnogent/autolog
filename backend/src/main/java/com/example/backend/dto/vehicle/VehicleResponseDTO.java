package com.example.backend.dto.vehicle;

import lombok.Data;
import java.util.List;
import com.example.backend.dto.DocumentSummaryDTO;
import com.example.backend.dto.serviceRecord.ServiceRecordSummaryDTO;

@Data
public class VehicleResponseDTO {

    private Long id;

    private Long ownerId;

    private String registrationNumber;

    private String model;

    private String company;

    private String description;

    private String type;
}
