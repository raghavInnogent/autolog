package com.example.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DocumentResponseDTO {
    private Integer id;
    private Long vehicleId;
    @JsonProperty("name")
    private String docName;
    private String type;
    private LocalDate issuedDate;
    @JsonProperty("expiry")
    private LocalDate expirationDate;
    private String docImage;
}
