package com.example.backend.repository;

import com.example.backend.entity.ServicedItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
@Repository
public interface ServicedItemsRepository extends JpaRepository<ServicedItems, Long> {

    // Existing method
    List<ServicedItems> findByExpirationDateBetween(LocalDate from, LocalDate to);

    // NEW: Find active items by vehicle and category (for premature replacement detection)
    @Query("SELECT si FROM ServicedItems si " +
            "JOIN ServiceRecord sr ON si MEMBER OF sr.servicedItems " +
            "WHERE sr.vehicle.id = :vehicleId " +
            "AND si.serviceCategoryId = :categoryId " +
            "AND si.expirationDate > :currentDate " +
            "ORDER BY si.expirationDate DESC")
    List<ServicedItems> findActiveItemsByVehicleAndCategory(
            @Param("vehicleId") Long vehicleId,
            @Param("categoryId") Long categoryId,
            @Param("currentDate") LocalDate currentDate);

    // NEW: Find all items that expired (for marking notifications inactive)
    @Query("SELECT si FROM ServicedItems si WHERE si.expirationDate < :date")
    List<ServicedItems> findExpiredItems(@Param("date") LocalDate date);

    // NEW: Find items by vehicle (for notification generation)
    @Query("SELECT si FROM ServicedItems si " +
            "JOIN ServiceRecord sr ON si MEMBER OF sr.servicedItems " +
            "WHERE sr.vehicle.id = :vehicleId")
    List<ServicedItems> findByVehicleId(@Param("vehicleId") Long vehicleId);
}