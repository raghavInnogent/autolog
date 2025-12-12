package com.example.backend.scheduler;

import com.example.backend.dao.NotificationDao;
import com.example.backend.dao.UserDao;
import com.example.backend.entity.User;
import com.example.backend.enums.NotificationStatus;
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
    private final NotificationDao notificationDao;
    private final UserDao userDao;


    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void markExpiredNotificationsAsInactive() {
        log.info("Starting scheduled job: Mark Expired Notifications as INACTIVE");

        try {
            int updatedCount = notificationDao.markExpiredAsInactive(
                    LocalDate.now(),
                    NotificationStatus.ACTIVE,
                    NotificationStatus.INACTIVE);

            log.info("Successfully marked {} expired notifications as INACTIVE", updatedCount);
        } catch (Exception e) {
            log.error("Error marking expired notifications as INACTIVE: {}", e.getMessage(), e);
        }
    }


    @Scheduled(cron = "5 0 0 * * *")
    @Transactional
    public void scanAndGenerateNotificationsForAllUsers() {
        log.info("Starting scheduled job: Scan and Generate Notifications for All Users");

        try {
            List<User> allUsers = userDao.findAll();
            int totalUsers = allUsers.size();
            int successCount = 0;
            int errorCount = 0;

            for (User user : allUsers) {
                try {
                    notificationService.scanAndGenerateNotificationsForUser(user.getId());
                    successCount++;
                } catch (Exception e) {
                    errorCount++;
                    log.error("Error scanning notifications for User ID: {} - {}",
                            user.getId(), e.getMessage());
                }
            }

            log.info("Completed notification scan for {} users (Success: {}, Errors: {})",
                    totalUsers, successCount, errorCount);
        } catch (Exception e) {
            log.error("Error in scheduled notification scan: {}", e.getMessage(), e);
        }
    }
}
