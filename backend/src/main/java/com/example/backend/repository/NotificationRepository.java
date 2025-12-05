package com.example.backend.repository;

import com.example.backend.entity.Notification;
import com.example.backend.enums.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find notifications by user with sorting
    List<Notification> findByUserIdOrderByPriorityDescCreatedAtDesc(Long userId);

    // Find by user and status
    List<Notification> findByUserIdAndStatusOrderByPriorityDescCreatedAtDesc(
            Long userId, NotificationStatus status);

    // Find by user and read status
    List<Notification> findByUserIdAndReadStatusOrderByPriorityDescCreatedAtDesc(
            Long userId, ReadStatus readStatus);

    // Find by user, status and read status
    List<Notification> findByUserIdAndStatusAndReadStatusOrderByPriorityDescCreatedAtDesc(
            Long userId, NotificationStatus status, ReadStatus readStatus);

    // Find by user and priority
    List<Notification> findByUserIdAndPriorityOrderByCreatedAtDesc(
            Long userId, NotificationPriority priority);

    // Find by vehicle
    List<Notification> findByVehicleIdOrderByCreatedAtDesc(Long vehicleId);

    // Find by reference (for checking duplicates and updating)
    Optional<Notification> findByReferenceIdAndReferenceTypeAndStatus(
            Long referenceId, ReferenceType referenceType, NotificationStatus status);

    // Find all by reference and status (for marking as ACKNOWLEDGED)
    List<Notification> findByReferenceIdAndReferenceType(
            Long referenceId, ReferenceType referenceType);

    // Count queries for dashboard
    Long countByUserIdAndReadStatus(Long userId, ReadStatus readStatus);

    Long countByUserIdAndStatus(Long userId, NotificationStatus status);

    Long countByUserIdAndStatusAndPriority(
            Long userId, NotificationStatus status, NotificationPriority priority);

    // Find notifications to update (for scheduler)
    List<Notification> findByExpiryDateBetweenAndStatus(
            LocalDate from, LocalDate to, NotificationStatus status);

    // Find all active notifications expiring soon
    @Query("SELECT n FROM Notification n WHERE n.expiryDate BETWEEN :from AND :to AND n.status = 'ACTIVE'")
    List<Notification> findActiveNotificationsExpiringSoon(
            @Param("from") LocalDate from, @Param("to") LocalDate to);

    // Bulk update for scheduler efficiency - mark expired as inactive
    @Modifying
    @Query("UPDATE Notification n SET n.status = :newStatus, n.updatedAt = CURRENT_TIMESTAMP " +
            "WHERE n.expiryDate < :date AND n.status = :currentStatus")
    int markExpiredAsInactive(@Param("date") LocalDate date,
                              @Param("currentStatus") NotificationStatus currentStatus,
                              @Param("newStatus") NotificationStatus newStatus);

    // Find high priority unread notifications for email
    List<Notification> findByUserIdAndPriorityAndReadStatusAndStatus(
            Long userId, NotificationPriority priority, ReadStatus readStatus, NotificationStatus status);
}