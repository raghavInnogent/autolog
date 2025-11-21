package com.example.backend.dto.document;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DocumentRequestDTO {
    private Long vehicleId;
    private String registrationNumber;
    private String name;
    private String type;
    private LocalDate issuedDate;
    private LocalDate expiry;
}