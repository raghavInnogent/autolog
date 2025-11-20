package com.example.backend.dto;

import com.example.backend.dto.summary.ServiceRecordSummaryDTO;
import lombok.Data;
import java.util.List;

@Data
public class VehicleResponseDTO {

    private Long id;

    private Long ownerId;

    private String registrationNumber;

    private String model;

    private String company;

    private String description;

    private String type;

    private List<DocumentSummaryDTO> documents;

    private List<ServiceRecordSummaryDTO> servicings;
}
