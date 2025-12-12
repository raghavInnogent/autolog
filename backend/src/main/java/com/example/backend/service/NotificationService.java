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
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface NotificationService {

    void generateNotificationsForServicedItem(ServicedItems item, Long vehicleId, Long userId);

    void generateNotificationsForDocument(Document document, Long userId);

    void scanAndGenerateNotificationsForUser(Long userId);

    NotificationDetailDTO getById(Long id, Long userId);

    List<NotificationResponseDTO> getAllByUser(Long userId, NotificationStatus status,
            ReadStatus readStatus, NotificationPriority priority);

    List<NotificationResponseDTO> getByVehicle(Long vehicleId, Long userId);

    NotificationCountDTO getCounts(Long userId);

    void markAsRead(Long id, Long userId);

    void markAllAsRead(Long userId);

    void sendHighPriorityNotificationEmail(Notification notification);
}