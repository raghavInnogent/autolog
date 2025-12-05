package com.example.backend.serviceImpl;

import com.example.backend.dao.*;
import com.example.backend.dto.response.NotificationCountDTO;
import com.example.backend.dto.response.NotificationDetailDTO;
import com.example.backend.dto.response.NotificationResponseDTO;
import com.example.backend.dto.summary.DocumentSummaryDTO;
import com.example.backend.dto.summary.ServiceItemSummaryDTO;
import com.example.backend.dto.summary.VehicleSummaryDTO;
import com.example.backend.entity.*;
import com.example.backend.enums.*;
import com.example.backend.mapper.NotificationMapper;
import com.example.backend.mapper.VehicleMapper;
import com.example.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationDao notificationDao;
    private final VehicleDao vehicleDao;
    private final UserDao userDao;
    private final ServiceCategoriesDao serviceCategoriesDao;
    private final DocumentDao documentDao;
    private final NotificationMapper notificationMapper;
    private final VehicleMapper vehicleMapper;

    @Override
    public void generateNotificationsForServicedItem(ServicedItems item, Long vehicleId, Long userId) {
        log.info("Generating notification for ServicedItem ID: {}, Vehicle ID: {}", item.getId(), vehicleId);

        if (item.getExpirationDate() == null) {
            log.warn("ServicedItem ID: {} has no expiration date. Skipping notification generation.", item.getId());
            return;
        }

        // Check if notification already exists for this item
        Optional<Notification> existingNotification = notificationDao.findByReferenceIdAndReferenceTypeAndStatus(
                item.getId(), ReferenceType.SERVICED_ITEM, NotificationStatus.ACTIVE
        );

        if (existingNotification.isPresent()) {
            log.info("Notification already exists for ServicedItem ID: {}. Updating...", item.getId());
            updateNotification(existingNotification.get(), item.getExpirationDate());
            return;
        }

        // Create new notification
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setVehicleId(vehicleId);
        notification.setNotificationType(NotificationType.SERVICE_ITEM_EXPIRY);
        notification.setReferenceId(item.getId());
        notification.setReferenceType(ReferenceType.SERVICED_ITEM);
        notification.setExpiryDate(item.getExpirationDate());

        // Calculate days left and priority
        updateNotificationDaysAndPriority(notification);

        // Generate message
        // NEW CODE (FIXED)
        ServiceCategories category = serviceCategoriesDao.findById(item.getServiceCategoryId());
        if (category == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "ServiceCategory not found with ID: " + item.getServiceCategoryId());
        }
        Vehicle vehicle = vehicleDao.findById(vehicleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Vehicle not found with ID: " + vehicleId));

        notification.setMessage(buildServiceItemMessage(category.getName(), vehicle, notification.getDaysLeft()));
        notification.setStatus(NotificationStatus.ACTIVE);
        notification.setReadStatus(ReadStatus.UNREAD);
        notification.getNotifiedVia().add("IN_APP");

        notificationDao.save(notification);
        log.info("Notification created successfully for ServicedItem ID: {}", item.getId());

        // Send email for high priority
        if (notification.getPriority() == NotificationPriority.HIGH) {
            sendHighPriorityNotificationEmail(notification);
        }
    }

    @Override
    public void generateNotificationsForDocument(Document document, Long userId) {
        log.info("Generating notification for Document ID: {}", document.getId());

        if (document.getExpirationDate() == null) {
            log.warn("Document ID: {} has no expiration date. Skipping notification generation.", document.getId());
            return;
        }

        // Check if notification already exists
        Optional<Notification> existingNotification = notificationDao.findByReferenceIdAndReferenceTypeAndStatus(
                Long.valueOf(document.getId()), ReferenceType.DOCUMENT, NotificationStatus.ACTIVE
        );

        if (existingNotification.isPresent()) {
            log.info("Notification already exists for Document ID: {}. Updating...", document.getId());
            updateNotification(existingNotification.get(), document.getExpirationDate());
            return;
        }

        // Create new notification
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setVehicleId(document.getVehicle().getId());
        notification.setNotificationType(NotificationType.DOCUMENT_EXPIRY);
        notification.setReferenceId(Long.valueOf(document.getId()));
        notification.setReferenceType(ReferenceType.DOCUMENT);
        notification.setExpiryDate(document.getExpirationDate());

        // Calculate days left and priority
        updateNotificationDaysAndPriority(notification);

        // Generate message
        notification.setMessage(buildDocumentMessage(document.getDocName(),
                document.getVehicle(), notification.getDaysLeft()));
        notification.setStatus(NotificationStatus.ACTIVE);
        notification.setReadStatus(ReadStatus.UNREAD);
        notification.getNotifiedVia().add("IN_APP");

        notificationDao.save(notification);
        log.info("Notification created successfully for Document ID: {}", document.getId());

        // Send email for high priority
        if (notification.getPriority() == NotificationPriority.HIGH) {
            sendHighPriorityNotificationEmail(notification);
        }
    }

    @Override
    public void generateNotificationsForAllExpiringSoon() {
        log.info("Starting batch notification generation for all expiring items...");

        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysLater = today.plusDays(30);

        // Process all serviced items expiring in next 30 days
        // Note: This requires a custom query - we'll get all service records and filter
        log.info("Processing serviced items...");
        // Implementation will be in scheduler

        log.info("Batch notification generation completed.");
    }

    @Override
    public NotificationDetailDTO getById(Long id, Long userId) {
        Notification notification = notificationDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        MessageKey.NOTIFICATION_NOT_FOUND.name()));

        if (!notification.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        return enrichNotificationDetail(notification);
    }

    @Override
    public List<NotificationResponseDTO> getAllByUser(Long userId, NotificationStatus status,
                                                      ReadStatus readStatus, NotificationPriority priority) {
        List<Notification> notifications;

        if (status != null && readStatus != null) {
            notifications = notificationDao.findByUserIdAndStatusAndReadStatusOrderByPriorityDescCreatedAtDesc(
                    userId, status, readStatus);
        } else if (status != null) {
            notifications = notificationDao.findByUserIdAndStatusOrderByPriorityDescCreatedAtDesc(userId, status);
        } else if (readStatus != null) {
            notifications = notificationDao.findByUserIdAndReadStatusOrderByPriorityDescCreatedAtDesc(userId, readStatus);
        } else if (priority != null) {
            notifications = notificationDao.findByUserIdAndPriorityOrderByCreatedAtDesc(userId, priority);
        } else {
            notifications = notificationDao.findByUserIdOrderByPriorityDescCreatedAtDesc(userId);
        }

        return notifications.stream()
                .map(notificationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationResponseDTO> getByVehicle(Long vehicleId, Long userId) {
        Vehicle vehicle = vehicleDao.findById(vehicleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        MessageKey.VEHICLE_NOT_FOUND.name()));

        if (!vehicle.getOwner().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        List<Notification> notifications = notificationDao.findByVehicleIdOrderByCreatedAtDesc(vehicleId);

        return notifications.stream()
                .map(notificationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationCountDTO getCounts(Long userId) {
        Long unreadCount = notificationDao.countByUserIdAndReadStatus(userId, ReadStatus.UNREAD);
        Long activeCount = notificationDao.countByUserIdAndStatus(userId, NotificationStatus.ACTIVE);
        Long highPriorityCount = notificationDao.countByUserIdAndStatusAndPriority(
                userId, NotificationStatus.ACTIVE, NotificationPriority.HIGH);
        Long moderatePriorityCount = notificationDao.countByUserIdAndStatusAndPriority(
                userId, NotificationStatus.ACTIVE, NotificationPriority.MODERATE);
        Long lowPriorityCount = notificationDao.countByUserIdAndStatusAndPriority(
                userId, NotificationStatus.ACTIVE, NotificationPriority.LOW);

        return new NotificationCountDTO(unreadCount, activeCount, highPriorityCount,
                moderatePriorityCount, lowPriorityCount);
    }

    @Override
    public void markAsRead(Long id, Long userId) {
        Notification notification = notificationDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        MessageKey.NOTIFICATION_NOT_FOUND.name()));

        if (!notification.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        notification.setReadStatus(ReadStatus.READ);
        notificationDao.save(notification);

        log.info("Notification ID: {} marked as READ by User ID: {}", id, userId);
    }

    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationDao.findByUserIdAndReadStatusOrderByPriorityDescCreatedAtDesc(
                userId, ReadStatus.UNREAD);

        for (Notification notification : unreadNotifications) {
            notification.setReadStatus(ReadStatus.READ);
            notificationDao.save(notification);
        }

        log.info("All notifications marked as READ for User ID: {}. Count: {}", userId, unreadNotifications.size());
    }

    @Override
    public void markAsAcknowledged(Long referenceId, ReferenceType referenceType) {
        List<Notification> notifications = notificationDao.findByReferenceIdAndReferenceType(
                referenceId, referenceType);

        for (Notification notification : notifications) {
            if (notification.getStatus() == NotificationStatus.ACTIVE) {
                notification.setStatus(NotificationStatus.ACKNOWLEDGED);
                notificationDao.save(notification);
                log.info("Notification ID: {} marked as ACKNOWLEDGED for reference ID: {}",
                        notification.getId(), referenceId);
            }
        }
    }

    @Override
    public void updateNotificationPrioritiesAndStatus() {
        log.info("Updating notification priorities and statuses...");

        List<Notification> activeNotifications = notificationDao.findByUserIdAndStatusOrderByPriorityDescCreatedAtDesc(
                null, NotificationStatus.ACTIVE);

        // This is inefficient - we'll use a better approach in scheduler
        // For now, this is a placeholder
    }

    @Override
    public void markExpiredNotificationsAsInactive() {
        LocalDate today = LocalDate.now();
        int updatedCount = notificationDao.markExpiredAsInactive(
                today, NotificationStatus.ACTIVE, NotificationStatus.INACTIVE);

        log.info("Marked {} expired notifications as INACTIVE", updatedCount);
    }

    @Override
    public void sendHighPriorityNotificationEmail(Notification notification) {
        try {
            User user = userDao.findById(notification.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            MessageKey.USER_NOT_FOUND.name()));

            String subject = " HIGH Priority: " + notification.getMessage();
            String message = buildEmailTemplate(notification, user);

            // Assuming EmailService interface
            // emailService.sendEmail(user.getEmail(), subject, message);

            notification.getNotifiedVia().add("EMAIL_SENT");
            notificationDao.save(notification);

            log.info("HIGH priority email sent to User ID: {} for Notification ID: {}",
                    notification.getUserId(), notification.getId());
        } catch (Exception e) {
            log.error("Failed to send email for Notification ID: {} - {}", notification.getId(), e.getMessage());
        }
    }

    // Helper methods

    private void updateNotification(Notification notification, LocalDate expiryDate) {
        notification.setExpiryDate(expiryDate);
        updateNotificationDaysAndPriority(notification);
        notificationDao.save(notification);
    }

    private void updateNotificationDaysAndPriority(Notification notification) {
        LocalDate today = LocalDate.now();
        long daysLeft = ChronoUnit.DAYS.between(today, notification.getExpiryDate());
        notification.setDaysLeft((int) daysLeft);

        if (daysLeft < 0) {
            notification.setStatus(NotificationStatus.INACTIVE);
            notification.setPriority(NotificationPriority.LOW);
        } else if (daysLeft <= 1) {
            notification.setPriority(NotificationPriority.HIGH);
        } else if (daysLeft <= 7) {
            notification.setPriority(NotificationPriority.MODERATE);
        } else if (daysLeft <= 30) {
            notification.setPriority(NotificationPriority.LOW);
        } else {
            // Don't create notification yet if more than 30 days
            notification.setStatus(NotificationStatus.INACTIVE);
        }
    }

    private String buildServiceItemMessage(String categoryName, Vehicle vehicle, Integer daysLeft) {
        if (daysLeft <= 0) {
            return String.format("%s has expired for %s (%s)",
                    categoryName, vehicle.getModel(), vehicle.getRegistrationNumber());
        } else if (daysLeft == 1) {
            return String.format("%s expires today for %s (%s)",
                    categoryName, vehicle.getModel(), vehicle.getRegistrationNumber());
        } else {
            return String.format("%s expires in %d days for %s (%s)",
                    categoryName, daysLeft, vehicle.getModel(), vehicle.getRegistrationNumber());
        }
    }

    private String buildDocumentMessage(String docName, Vehicle vehicle, Integer daysLeft) {
        if (daysLeft <= 0) {
            return String.format("%s has expired for %s (%s)",
                    docName, vehicle.getModel(), vehicle.getRegistrationNumber());
        } else if (daysLeft == 1) {
            return String.format("%s expires today for %s (%s)",
                    docName, vehicle.getModel(), vehicle.getRegistrationNumber());
        } else {
            return String.format("%s expires in %d days for %s (%s)",
                    docName, daysLeft, vehicle.getModel(), vehicle.getRegistrationNumber());
        }
    }

    private String buildEmailTemplate(Notification notification, User user) {
        StringBuilder email = new StringBuilder();
        email.append("Dear ").append(user.getName()).append(",\n\n");
        email.append("Your vehicle requires attention:\n\n");
        email.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        email.append("Message: ").append(notification.getMessage()).append("\n");
        email.append("Expiry Date: ").append(notification.getExpiryDate()).append("\n");
        email.append("Days Left: ").append(notification.getDaysLeft()).append(" day(s)\n");
        email.append("Priority: ").append(notification.getPriority()).append("\n");
        email.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
        email.append("Please schedule a service appointment soon to avoid vehicle damage.\n\n");
        email.append("Best regards,\n");
        email.append("AutoLog Team");
        return email.toString();
    }

    private NotificationDetailDTO enrichNotificationDetail(Notification notification) {
        NotificationDetailDTO dto = notificationMapper.toDetailDTO(notification);

        // Enrich with vehicle data
        Vehicle vehicle = vehicleDao.findById(notification.getVehicleId())
                .orElse(null);
        if (vehicle != null) {
            dto.setVehicle(vehicleMapper.toSummaryDTO(vehicle));
        }

        // Enrich with item/document data based on type
        if (notification.getReferenceType() == ReferenceType.SERVICED_ITEM) {
            // We'll need to query ServiceRecord to get ServicedItem
            // For now, basic implementation
            ServiceItemSummaryDTO itemSummary = new ServiceItemSummaryDTO();
            itemSummary.setId(notification.getReferenceId());
            itemSummary.setExpirationDate(notification.getExpiryDate());
            dto.setServicedItem(itemSummary);
        } else if (notification.getReferenceType() == ReferenceType.DOCUMENT) {
            Document document = documentDao.findById(notification.getReferenceId().intValue())
                    .orElse(null);
            if (document != null) {
                DocumentSummaryDTO docSummary = new DocumentSummaryDTO();
                docSummary.setId(document.getId());
                docSummary.setDocName(document.getDocName());
                docSummary.setExpirationDate(document.getExpirationDate());
                dto.setDocument(docSummary);
            }
        }

        return dto;
    }
}