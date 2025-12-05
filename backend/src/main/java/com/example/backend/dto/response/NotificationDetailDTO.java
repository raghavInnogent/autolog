package com.example.backend.dto.response;

import com.example.backend.dto.summary.VehicleSummaryDTO;
import com.example.backend.dto.summary.ServiceItemSummaryDTO;
import com.example.backend.dto.summary.DocumentSummaryDTO;
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
public class NotificationDetailDTO {

    private Long id;
    private Long userId;
    private NotificationType notificationType;
    private String message;
    private LocalDate expiryDate;
    private Integer daysLeft;
    private NotificationPriority priority;
    private NotificationStatus status;
    private ReadStatus readStatus;
    private Set<String> notifiedVia;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Enriched data
    private VehicleSummaryDTO vehicle;
    private ServiceItemSummaryDTO servicedItem;  // Only if SERVICE_ITEM_EXPIRY
    private DocumentSummaryDTO document;         // Only if DOCUMENT_EXPIRY
}