package com.example.backend.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DocumentResponseDTO {

    private Integer id;

    private Long vehicleId;

    private String docImage;

    private String docName;

    private LocalDate expirationDate;
}
