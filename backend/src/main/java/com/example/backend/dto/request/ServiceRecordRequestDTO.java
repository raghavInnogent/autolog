package com.example.backend.dto.request;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class ServiceRecordRequestDTO {

    private Integer cost;

    private LocalDate dateOfService;

    private String serviceCentre;

    private List<ServicedItemRequestDTO> servicedItems;
}
