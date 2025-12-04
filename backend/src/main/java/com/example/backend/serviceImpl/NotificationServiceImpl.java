package com.example.backend.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dao.NotificationDao;
import com.example.backend.entity.Notification;
import com.example.backend.service.NotificationService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Data
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationDao notificationDao;
    @Override
    public List<Notification> getUserNotifications(Long userId) {
        return notificationDao.findByUserId(userId);
    }

    @Override
    public void markAsRead(Long id) {
        notificationDao.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            notificationDao.save(notification);
        });
    }

    @Override
    public void createNotification(Long userId, String message) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notificationDao.save(notification);
    }
}
