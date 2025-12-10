package com.example.backend.dto.response;

import com.example.backend.dto.summary.DocumentSummaryDTO;
import com.example.backend.dto.summary.ServiceItemSummaryDTO;
import com.example.backend.dto.summary.VehicleSummaryDTO;
import com.example.backend.enums.NotificationPriority;
import com.example.backend.enums.NotificationStatus;
import com.example.backend.enums.NotificationType;
import com.example.backend.enums.ReadStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Enriched data
    private VehicleSummaryDTO vehicle;
    private ServiceItemSummaryDTO servicedItem; // Only if SERVICE_ITEM_EXPIRY
    private DocumentSummaryDTO document; // Only if DOCUMENT_EXPIRY
}