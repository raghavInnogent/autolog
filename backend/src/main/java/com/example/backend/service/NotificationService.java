package com.example.backend.service;

import com.example.backend.dto.response.NotificationCountDTO;
import com.example.backend.dto.response.NotificationDetailDTO;
import com.example.backend.dto.response.NotificationResponseDTO;
import com.example.backend.entity.Document;
import com.example.backend.entity.Notification;
import com.example.backend.entity.ServicedItems;
import com.example.backend.enums.NotificationPriority;
import com.example.backend.enums.NotificationStatus;
import com.example.backend.enums.ReadStatus;
import com.example.backend.enums.ReferenceType;

import java.util.List;

public interface NotificationService {

    // Generation methods
    void generateNotificationsForServicedItem(ServicedItems item, Long vehicleId, Long userId);
    void generateNotificationsForDocument(Document document, Long userId);
    void generateNotificationsForAllExpiringSoon();

    // Query methods
    NotificationDetailDTO getById(Long id, Long userId);
    List<NotificationResponseDTO> getAllByUser(Long userId, NotificationStatus status,
                                               ReadStatus readStatus, NotificationPriority priority);
    List<NotificationResponseDTO> getByVehicle(Long vehicleId, Long userId);
    NotificationCountDTO getCounts(Long userId);

    // Action methods
    void markAsRead(Long id, Long userId);
    void markAllAsRead(Long userId);
    void markAsAcknowledged(Long referenceId, ReferenceType referenceType);

    // Scheduler methods
    void updateNotificationPrioritiesAndStatus();
    void markExpiredNotificationsAsInactive();

    // Email methods
    void sendHighPriorityNotificationEmail(Notification notification);
}