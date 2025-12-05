package com.example.backend.repository;

import com.example.backend.entity.ServiceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ServiceHistoryRepository extends JpaRepository<ServiceHistory,Long> {

    // Find replacement history for a vehicle
    List<ServiceHistory> findByVehicleIdOrderByActualReplacementDateDesc(Long vehicleId);

    // Find premature replacements for analysis
    List<ServiceHistory> findByVehicleIdAndIsPrematureReplacementTrue(Long vehicleId);

    // Calculate replacement frequency
    @Query("SELECT COUNT(sh) FROM ServiceHistory sh WHERE sh.vehicleId = :vehicleId AND sh.serviceCategoryId = :categoryId")
    Long countReplacementsByVehicleAndCategory(@Param("vehicleId") Long vehicleId,
                                               @Param("categoryId") Long categoryId);

    // Find last replacement for a category
    Optional<ServiceHistory> findFirstByVehicleIdAndServiceCategoryIdOrderByActualReplacementDateDesc(
            Long vehicleId, Long serviceCategoryId);

    // Find if old serviced item has history (for linking replacements)
    Optional<ServiceHistory> findByNewServicedItemId(Long servicedItemId);

    Optional<ServiceHistory> findByOldServicedItemId(Long oldServicedItemId);

    List<ServiceHistory> findByVehicleIdAndServiceCategoryIdOrderByActualReplacementDateDesc(Long vehicleId, Long serviceCategoryId);
}


