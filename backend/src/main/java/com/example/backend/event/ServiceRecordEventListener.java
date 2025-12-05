package com.example.backend.event;

import com.example.backend.entity.ServiceRecord;
import com.example.backend.entity.ServicedItems;
import com.example.backend.service.NotificationService;
import com.example.backend.service.ServiceHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class ServiceRecordEventListener {

    private final ServiceHistoryService serviceHistoryService;
    private final NotificationService notificationService;

    @EventListener
    @Async
    @Transactional
    public void handleServiceRecordCreated(ServiceRecordCreatedEvent event) {
        ServiceRecord record = event.getServiceRecord();

        log.info("Processing ServiceRecordCreatedEvent for ServiceRecord ID: {}", record.getId());

        if (record.getServicedItems() == null || record.getServicedItems().isEmpty()) {
            log.warn("No serviced items found in ServiceRecord ID: {}", record.getId());
            return;
        }

        Long vehicleId = record.getVehicle().getId();
        Long userId = record.getVehicle().getOwner().getId();

        // Process each serviced item
        for (ServicedItems newItem : record.getServicedItems()) {
            try {
                // Check for premature replacement and create history
                serviceHistoryService.checkAndCreatePrematureReplacementHistory(newItem, vehicleId);

                // Generate notifications for the new item
                notificationService.generateNotificationsForServicedItem(newItem, vehicleId, userId);

                log.info("Processed ServicedItem ID: {} for Vehicle ID: {}", newItem.getId(), vehicleId);
            } catch (Exception e) {
                log.error("Error processing ServicedItem ID: {} - {}", newItem.getId(), e.getMessage(), e);
            }
        }
    }
}