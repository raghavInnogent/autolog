package com.example.backend.dto.serviceRecord;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class ServiceRecordRequestDTO {

    private Long vehicleId;

    private Integer cost;

    private LocalDate date;

    private String workshop;

    private Integer mileage;

    private String invoice;

    private String type;

    private List<String> items;
}
