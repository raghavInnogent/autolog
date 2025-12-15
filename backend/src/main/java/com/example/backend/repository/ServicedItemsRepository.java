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


    @Query("SELECT si FROM ServicedItems si " + "JOIN ServiceRecord sr ON si MEMBER OF sr.servicedItems "
            + "WHERE sr.vehicle.id = :vehicleId " + "AND si.serviceCategoryId = :categoryId "
            + "AND si.expirationDate > :currentDate " + "ORDER BY si.expirationDate DESC")
    List<ServicedItems> findActiveItemsByVehicleAndCategory(@Param("vehicleId") Long vehicleId,
            @Param("categoryId") Long categoryId, @Param("currentDate") LocalDate currentDate);


    @Query("SELECT si FROM ServicedItems si " + "JOIN ServiceRecord sr ON si MEMBER OF sr.servicedItems "
            + "WHERE sr.vehicle.id = :vehicleId")
    List<ServicedItems> findByVehicleId(@Param("vehicleId") Long vehicleId);

    @Query("SELECT si FROM ServicedItems si " +
            "JOIN ServiceRecord sr ON si MEMBER OF sr.servicedItems " +
            "WHERE sr.vehicle.id = :vehicleId " +
            "AND si.serviceCategoryId = :categoryId " +
            "AND si.expirationDate > :currentDate " +
            "ORDER BY si.expirationDate ASC LIMIT 1")
    ServicedItems getPrematureItemByExpirationDate(@Param("vehicleId") Long vehicleId,
            @Param("categoryId") Long categoryId,
            @Param("currentDate") LocalDate currentDate);

}