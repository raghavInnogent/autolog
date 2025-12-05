package com.example.backend.dto.response;

import com.example.backend.enums.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {

    private Long id;
    private Long userId;
    private Long vehicleId;
    private NotificationType notificationType;
    private Long referenceId;
    private ReferenceType referenceType;
    private String message;
    private LocalDate expiryDate;
    private Integer daysLeft;
    private NotificationPriority priority;
    private NotificationStatus status;
    private ReadStatus readStatus;
    private Set<String> notifiedVia;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}