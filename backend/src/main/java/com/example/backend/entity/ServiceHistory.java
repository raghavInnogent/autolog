package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_history", indexes = {
        @Index(name = "idx_vehicle_category", columnList = "vehicle_id,service_category_id"),
        @Index(name = "idx_vehicle_date", columnList = "vehicle_id,actual_replacement_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_id", nullable = false)
    private Long vehicleId;

    @Column(name = "service_category_id", nullable = false)
    private Long serviceCategoryId;

    @Column(name = "old_serviced_item_id")
    private Long oldServicedItemId;

    @Column(name = "new_serviced_item_id", nullable = false)
    private Long newServicedItemId;

    @Column(name = "original_expiry_date")
    private LocalDate originalExpiryDate;

    @Column(name = "actual_replacement_date", nullable = false)
    private LocalDate actualReplacementDate;

    @Column(name = "is_premature_replacement", nullable = false)
    private Boolean isPrematureReplacement;

    @Column(name = "days_before_expiry")
    private Integer daysBeforeExpiry;

    @Column(name = "replacement_reason", length = 500)
    private String replacementReason;

    @Column(name = "replacement_frequency")
    private Integer replacementFrequency;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isPrematureReplacement == null) {
            isPrematureReplacement = false;
        }
    }
}