package com.example.backend.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DocumentRequestDTO {

    private String docImage;

    private String docName;

    private LocalDate expirationDate;
}
