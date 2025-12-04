package com.example.backend.service;

import com.example.backend.entity.Notification;
import java.util.List;

public interface NotificationService {
    List<Notification> getUserNotifications(Long userId);

    void markAsRead(Long id);

    void createNotification(Long userId, String message);
}
