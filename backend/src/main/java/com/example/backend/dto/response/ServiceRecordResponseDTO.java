package com.example.backend.dto.response;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class ServiceRecordResponseDTO {

    private Long id;

    private Long vehicleId;

    private Integer cost;

    private LocalDate dateOfService;

    private String workshop;

    private Integer mileage;

    private String invoice;

    private String type;

    private List<ServicedItemResponseDTO> servicedItems;
}
