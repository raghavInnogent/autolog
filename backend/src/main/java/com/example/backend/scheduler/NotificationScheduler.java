package com.example.backend.scheduler;

import com.example.backend.dao.NotificationDao;
import com.example.backend.entity.Document;
import com.example.backend.entity.Notification;
import com.example.backend.entity.ServiceRecord;
import com.example.backend.entity.ServicedItems;
import com.example.backend.enums.NotificationStatus;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.repository.ServiceRecordRepository;
import com.example.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final NotificationService notificationService;
    private final ServiceRecordRepository serviceRecordRepository;
    private final DocumentRepository documentRepository;
    private final NotificationDao notificationDao;

    @Scheduled(cron = "0 0 0 * * *") // Daily at 12:00 AM
    @Transactional
    public void runDailyNotificationUpdate() {

        log.info("Starting Daily Notification Update Job");

        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysLater = today.plusDays(30);

        try {

            markExpiredNotifications(today);
            processServicedItems(today, thirtyDaysLater);

            processDocuments(today, thirtyDaysLater);

            updateExistingNotifications();

            log.info("Daily Notification Update Job completed successfully");
        } catch (Exception e) {
            log.error("Error during Daily Notification Update Job: {}", e.getMessage(), e);
        }
    }

    private void markExpiredNotifications(LocalDate today) {
        log.info("Step 1: Marking expired notifications as INACTIVE...");
        int updatedCount = notificationDao.markExpiredAsInactive(
                today, NotificationStatus.ACTIVE, NotificationStatus.INACTIVE);
        log.info("Marked {} notifications as INACTIVE", updatedCount);
    }

    private void processServicedItems(LocalDate today, LocalDate thirtyDaysLater) {
        log.info("Step 2: Processing ServicedItems expiring within 30 days...");

        // Get all service records (we need to iterate through serviced items)
        List<ServiceRecord> allRecords = serviceRecordRepository.findAll();

        int processedCount = 0;
        for (ServiceRecord record : allRecords) {
            if (record.getServicedItems() == null) continue;

            for (ServicedItems item : record.getServicedItems()) {
                if (item.getExpirationDate() == null) continue;

                LocalDate expiryDate = item.getExpirationDate();

                // Check if item expires within 30 days
                if (!expiryDate.isBefore(today) && !expiryDate.isAfter(thirtyDaysLater)) {
                    try {
                        notificationService.generateNotificationsForServicedItem(
                                item,
                                record.getVehicle().getId(),
                                record.getVehicle().getOwner().getId()
                        );
                        processedCount++;
                    } catch (Exception e) {
                        log.error("Error processing ServicedItem ID: {} - {}", item.getId(), e.getMessage());
                    }
                }
            }
        }

        log.info("Processed {} ServicedItems", processedCount);
    }

    private void processDocuments(LocalDate today, LocalDate thirtyDaysLater) {
        log.info("Step 3: Processing Documents expiring within 30 days...");

        List<Document> documents = documentRepository.findByExpirationDateBetween(today, thirtyDaysLater);

        int processedCount = 0;
        for (Document document : documents) {
            try {
                notificationService.generateNotificationsForDocument(
                        document,
                        document.getVehicle().getOwner().getId()
                );
                processedCount++;
            } catch (Exception e) {
                log.error("Error processing Document ID: {} - {}", document.getId(), e.getMessage());
            }
        }

        log.info("Processed {} Documents", processedCount);
    }

    private void updateExistingNotifications() {
        log.info("Step 4: Updating existing active notifications...");

        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysLater = today.plusDays(30);

        List<Notification> activeNotifications = notificationDao.findActiveNotificationsExpiringSoon(
                today, thirtyDaysLater);

        for (Notification notification : activeNotifications) {
            try {
                // This will be handled by generateNotificationsForServicedItem/Document
                // which checks for existing notifications and updates them
            } catch (Exception e) {
                log.error("Error updating Notification ID: {} - {}", notification.getId(), e.getMessage());
            }
        }

        log.info("Updated existing active notifications");
    }
}