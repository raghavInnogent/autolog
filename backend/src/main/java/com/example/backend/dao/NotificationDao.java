package com.example.backend.dao;

import com.example.backend.entity.Notification;
import com.example.backend.enums.*;
import com.example.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class NotificationDao {

    private final NotificationRepository repository;

    public Notification save(Notification notification) {
        return repository.save(notification);
    }

    public Optional<Notification> findById(Long id) {
        return repository.findById(id);
    }

    public List<Notification> findAll() {
        return repository.findAll();
    }

    public void delete(Notification notification) {
        repository.delete(notification);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<Notification> findByUserIdOrderByPriorityDescCreatedAtDesc(Long userId) {
        return repository.findByUserIdOrderByPriorityDescCreatedAtDesc(userId);
    }

    public List<Notification> findByUserIdAndStatusOrderByPriorityDescCreatedAtDesc(
            Long userId, NotificationStatus status) {
        return repository.findByUserIdAndStatusOrderByPriorityDescCreatedAtDesc(userId, status);
    }

    public List<Notification> findByUserIdAndReadStatusOrderByPriorityDescCreatedAtDesc(
            Long userId, ReadStatus readStatus) {
        return repository.findByUserIdAndReadStatusOrderByPriorityDescCreatedAtDesc(userId, readStatus);
    }

    public List<Notification> findByUserIdAndStatusAndReadStatusOrderByPriorityDescCreatedAtDesc(
            Long userId, NotificationStatus status, ReadStatus readStatus) {
        return repository.findByUserIdAndStatusAndReadStatusOrderByPriorityDescCreatedAtDesc(
                userId, status, readStatus);
    }

    public List<Notification> findByUserIdAndPriorityOrderByCreatedAtDesc(
            Long userId, NotificationPriority priority) {
        return repository.findByUserIdAndPriorityOrderByCreatedAtDesc(userId, priority);
    }

    public List<Notification> findByVehicleIdOrderByCreatedAtDesc(Long vehicleId) {
        return repository.findByVehicleIdOrderByCreatedAtDesc(vehicleId);
    }

    public Optional<Notification> findByReferenceIdAndReferenceTypeAndStatus(
            Long referenceId, ReferenceType referenceType, NotificationStatus status) {
        return repository.findByReferenceIdAndReferenceTypeAndStatus(referenceId, referenceType, status);
    }

    public List<Notification> findByReferenceIdAndReferenceType(
            Long referenceId, ReferenceType referenceType) {
        return repository.findByReferenceIdAndReferenceType(referenceId, referenceType);
    }

    public Long countByUserIdAndReadStatus(Long userId, ReadStatus readStatus) {
        return repository.countByUserIdAndReadStatus(userId, readStatus);
    }

    public Long countByUserIdAndStatus(Long userId, NotificationStatus status) {
        return repository.countByUserIdAndStatus(userId, status);
    }

    public Long countByUserIdAndStatusAndPriority(
            Long userId, NotificationStatus status, NotificationPriority priority) {
        return repository.countByUserIdAndStatusAndPriority(userId, status, priority);
    }

    public List<Notification> findByExpiryDateBetweenAndStatus(
            LocalDate from, LocalDate to, NotificationStatus status) {
        return repository.findByExpiryDateBetweenAndStatus(from, to, status);
    }

    public List<Notification> findActiveNotificationsExpiringSoon(LocalDate from, LocalDate to) {
        return repository.findActiveNotificationsExpiringSoon(from, to);
    }

    public int markExpiredAsInactive(LocalDate date, NotificationStatus currentStatus,
                                     NotificationStatus newStatus) {
        return repository.markExpiredAsInactive(date, currentStatus, newStatus);
    }

    public List<Notification> findByUserIdAndPriorityAndReadStatusAndStatus(
            Long userId, NotificationPriority priority, ReadStatus readStatus, NotificationStatus status) {
        return repository.findByUserIdAndPriorityAndReadStatusAndStatus(
                userId, priority, readStatus, status);
    }
}