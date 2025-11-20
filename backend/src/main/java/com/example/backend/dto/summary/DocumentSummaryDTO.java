package com.example.backend.dto.summary;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DocumentSummaryDTO {

    private Integer id;

    private String docName;

    private LocalDate expirationDate;
}
