package com.example.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DocumentRequestDTO {

    private Long vehicleId;
    private String registrationNumber;
    @Column(name = "doc_name")
    @JsonProperty("name")
    private String docName;
    private String type;
    private LocalDate issuedDate;
    @Column(name = "expiration_date")
    @JsonProperty("expiry")
    private LocalDate expirationDate;

    @Column(name = "doc_image")
    @JsonProperty("docImage")
    private String docImage;
}
