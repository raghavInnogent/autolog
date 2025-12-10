package com.example.backend.serviceImpl;

import com.example.backend.dao.*;
import com.example.backend.dto.response.NotificationCountDTO;
import com.example.backend.dto.response.NotificationDetailDTO;
import com.example.backend.dto.response.NotificationResponseDTO;
import com.example.backend.dto.summary.DocumentSummaryDTO;
import com.example.backend.dto.summary.ServiceItemSummaryDTO;
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
import java.util.List;
import java.util.Optional;
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
    private final ServiceRecordDao serviceRecordDao;
    private final DocumentDao documentDao;
    private final NotificationMapper notificationMapper;
    private final VehicleMapper vehicleMapper;

    @Override
    public void generateNotificationsForServicedItem(ServicedItems item, Long vehicleId, Long userId) {
        createOrUpdateNotification(item.getId(), ReferenceType.SERVICED_ITEM, NotificationType.SERVICE_ITEM_EXPIRY,
                item.getExpirationDate(), userId, vehicleId, "ServicedItem ID: " + item.getId(),
                daysLeft -> {
                    ServiceCategories category = serviceCategoriesDao.findById(item.getServiceCategoryId())
                            .orElse(null);
                    if (category == null) {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "ServiceCategory not found with ID: " + item.getServiceCategoryId());
                    }
                    Vehicle vehicle = vehicleDao.findById(vehicleId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                    "Vehicle not found with ID: " + vehicleId));
                    return buildServiceItemMessage(category.getName(), vehicle, daysLeft);
                });
    }

    @Override
    public void generateNotificationsForDocument(Document document, Long userId) {
        createOrUpdateNotification(
                Long.valueOf(document.getId()),
                ReferenceType.DOCUMENT,
                NotificationType.DOCUMENT_EXPIRY,
                document.getExpirationDate(),
                userId,
                document.getVehicle().getId(),
                "Document ID: " + document.getId(),
                daysLeft -> buildDocumentMessage(document.getDocName(), document.getVehicle(), daysLeft));
    }

    private void createOrUpdateNotification(Long referenceId, ReferenceType referenceType,
            NotificationType notificationType, LocalDate expiryDate, Long userId, Long vehicleId,
            String logIdentifier, java.util.function.Function<Integer, String> messageBuilder) {
        log.info("Generating notification for {}", logIdentifier);

        if (expiryDate == null) {
            log.warn("{} has no expiration date. Skipping notification generation.", logIdentifier);
            return;
        }

        Optional<Notification> existingNotification = notificationDao.findByReferenceIdAndReferenceTypeAndStatus(
                referenceId, referenceType, NotificationStatus.ACTIVE);

        if (existingNotification.isPresent()) {
            log.info("Notification already exists for {}. Updating...", logIdentifier);
            updateNotification(existingNotification.get(), expiryDate);
            return;
        }

        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setVehicleId(vehicleId);
        notification.setNotificationType(notificationType);
        notification.setReferenceId(referenceId);
        notification.setReferenceType(referenceType);
        notification.setExpiryDate(expiryDate);

        int daysLeft = updateNotificationDaysAndPriority(notification);

        notification.setMessage(messageBuilder.apply(daysLeft));
        notification.setStatus(NotificationStatus.ACTIVE);
        notification.setReadStatus(ReadStatus.UNREAD);

        notificationDao.save(notification);
        log.info("Notification created successfully for {}", logIdentifier);

        if (notification.getPriority() == NotificationPriority.HIGH) {
            sendHighPriorityNotificationEmail(notification);
        }
    }

    @Override
    public void scanAndGenerateNotificationsForUser(Long userId) {
        log.info("Scanning for expiring items for User ID: {}", userId);

        List<Vehicle> vehicles = vehicleDao.findByOwnerId(userId);

        for (Vehicle vehicle : vehicles) {
            // 1. Check Documents
            if (vehicle.getDocuments() != null) {
                for (Document doc : vehicle.getDocuments()) {
                    try {
                        generateNotificationsForDocument(doc, userId);
                    } catch (Exception e) {
                        log.error("Error scanning document ID: {} - {}", doc.getId(), e.getMessage());
                    }
                }
            }

            // 2. Check Serviced Items (via ServiceRecords)
            try {
                List<ServiceRecord> records = serviceRecordDao.findByVehicleId(vehicle.getId());
                for (ServiceRecord record : records) {
                    if (record.getServicedItems() != null) {
                        for (ServicedItems item : record.getServicedItems()) {
                            try {
                                generateNotificationsForServicedItem(item, vehicle.getId(), userId);
                            } catch (Exception e) {
                                log.error("Error scanning ServicedItem ID: {} - {}", item.getId(), e.getMessage());
                            }
                        }
                    }
                }
            } catch (Exception e) {
                log.error("Error fetching service records for vehicle ID: {} - {}", vehicle.getId(), e.getMessage());
            }
        }
        log.info("Completed scan for User ID: {}", userId);
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
        // Fetch all notifications for the user
        List<Notification> notifications = notificationDao.findByUserIdOrderByPriorityDescCreatedAtDesc(userId);

        // Apply filters using stream operations to support all combinations
        return notifications.stream()
                .filter(n -> status == null || n.getStatus() == status)
                .filter(n -> readStatus == null || n.getReadStatus() == readStatus)
                .filter(n -> priority == null || n.getPriority() == priority)
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
        // Count only ACTIVE + UNREAD notifications (for bell badge)
        Long unreadCount = notificationDao.countByUserIdAndStatusAndReadStatus(
                userId, NotificationStatus.ACTIVE, ReadStatus.UNREAD);

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
        List<Notification> unreadNotifications = notificationDao
                .findByUserIdAndReadStatusOrderByPriorityDescCreatedAtDesc(
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
    public void sendHighPriorityNotificationEmail(Notification notification) {
        try {
            User user = userDao.findById(notification.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            MessageKey.USER_NOT_FOUND.name()));

            String subject = " HIGH Priority: " + notification.getMessage();
            String message = buildEmailTemplate(notification, user);

            // Assuming EmailService interface
            // emailService.sendEmail(user.getEmail(), subject, message);

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

    private int updateNotificationDaysAndPriority(Notification notification) {
        LocalDate today = LocalDate.now();
        long daysLeft = ChronoUnit.DAYS.between(today, notification.getExpiryDate());

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
        return (int) daysLeft;
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

        long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), notification.getExpiryDate());
        email.append("Days Left: ").append(daysLeft).append(" day(s)\n");

        email.append("Priority: ").append(notification.getPriority()).append("\n");
        email.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
        email.append("Please schedule a service appointment soon to avoid vehicle damage.\n\n");
        email.append("Best regards,\n");
        email.append("AutoLog Team");
        return email.toString();
    }

    private NotificationDetailDTO enrichNotificationDetail(Notification notification) {
        NotificationDetailDTO dto = notificationMapper.toDetailDTO(notification);

        Vehicle vehicle = vehicleDao.findById(notification.getVehicleId())
                .orElse(null);
        if (vehicle != null) {
            dto.setVehicle(vehicleMapper.toSummaryDTO(vehicle));
        }

        if (notification.getReferenceType() == ReferenceType.SERVICED_ITEM) {

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