package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponseDTO {
    private String title;
    private String vehicleName;
    private LocalDate dueDate;
    private String type; // "SERVICE" or "DOCUMENT"
    private String status; // "UPCOMING" or "OVERDUE"
}
