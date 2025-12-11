package com.example.backend.repository;

import com.example.backend.entity.PrematureServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrematureServiceItemRepository extends JpaRepository<PrematureServiceItem, Long> {

    PrematureServiceItem getPrematureServiceItemByCategoryId(Long categoryId);

    List<PrematureServiceItem> findByUserId(Long userId);

    List<PrematureServiceItem> findByVehicleId(Long vehicleId);

    List<PrematureServiceItem> findByUserIdAndVehicleId(Long userId, Long vehicleId);

    @Query("SELECT COALESCE(SUM(p.prematureCount), 0) FROM PrematureServiceItem p WHERE p.categoryId = :categoryId")
    Integer getTotalPrematureCountByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT COALESCE(SUM(p.prematureCount), 0) FROM PrematureServiceItem p WHERE p.vehicleId = :vehicleId AND p.categoryId = :categoryId")
    Integer getTotalPrematureCountByVehicleIdAndCategoryId(@Param("vehicleId") Long vehicleId,
            @Param("categoryId") Long categoryId);

    @Query("SELECT COALESCE(SUM(p.prematureCount), 0) FROM PrematureServiceItem p")
    Integer getAdminTotalPrematureCountForAllCategories();
}
