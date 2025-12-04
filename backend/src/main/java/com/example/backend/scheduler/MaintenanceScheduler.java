package com.example.backend.scheduler;

import com.example.backend.entity.Document;
import com.example.backend.entity.ServicedItems;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.repository.ServicedItemsRepository;
import com.example.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MaintenanceScheduler {

    private final DocumentRepository documentRepository;
    @Autowired
    private ServicedItemsRepository servicedItemsRepository;
    @Autowired
    private NotificationService notificationService;

    @Scheduled(cron = "0 0 9 * * ?") // Daily at 9 AM
    public void checkUpcomingMaintenance() {
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysLater = today.plusDays(7);

        // Check for upcoming service maintenance
//        List<ServicedItems> upcomingItems = servicedItemsRepository.findByExpirationDateBetween(today, sevenDaysLater);
//        for (ServicedItems item : upcomingItems) {
//            if (item.getServiceRecord() != null && item.getServiceRecord().getVehicle() != null) {
//                Long ownerId = item.getServiceRecord().getVehicle().getOwner().getId();
//                String message = "Upcoming maintenance: " + item.getServiceCategory().getName() +
//                        " for vehicle " + item.getServiceRecord().getVehicle().getRegistrationNumber() +
//                        " is due on " + item.getExpirationDate();
//
//                notificationService.createNotification(ownerId, message);
//            }
//        }

        // Check for expiring documents
        List<Document> expiringDocuments = documentRepository.findByExpirationDateBetween(today, sevenDaysLater);
        for (Document doc : expiringDocuments) {
            if (doc.getVehicle() != null) {
                Long ownerId = doc.getVehicle().getOwner().getId();
                String message = "Document Expiry: " + doc.getDocName() +
                        " for vehicle " + doc.getVehicle().getRegistrationNumber() +
                        " expires on " + doc.getExpirationDate();

                notificationService.createNotification(ownerId, message);
            }
        }
    }
}
