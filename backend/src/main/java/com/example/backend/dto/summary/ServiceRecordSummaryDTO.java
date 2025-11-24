package com.example.backend.dto.summary;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ServiceRecordSummaryDTO {

    private Long id;

    private Integer cost;

    private LocalDate dateOfService;

    private String workshop;
}
