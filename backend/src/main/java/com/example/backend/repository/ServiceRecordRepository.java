package com.example.backend.repository;

import com.example.backend.entity.ServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
@Repository
public interface ServiceRecordRepository extends JpaRepository<ServiceRecord, Long> {
    List<ServiceRecord> findByDateOfServiceBetween(LocalDate from, LocalDate to);
    List<ServiceRecord> findByVehicleId(Long vehicleId);


    @Query(value = "SELECT EXTRACT(MONTH FROM sr.date_of_service) as month, COALESCE(SUM(sr.cost), 0) as total " +
            "FROM service_record sr " +
            "INNER JOIN vehicle v ON sr.vehicle_id = v.id " +
            "WHERE v.owner_id = :userId " +
            "AND EXTRACT(YEAR FROM sr.date_of_service) = :year " +
            "GROUP BY EXTRACT(MONTH FROM sr.date_of_service) " +
            "ORDER BY month",
            nativeQuery = true)
    List<Object[]> getMonthlyExpenditureByYear(@Param("userId") Long userId, @Param("year") int year);


    @Query(value = "SELECT v.id as vehicleId, " +
            "v.model as vehicleName, " +
            "v.registration_number as registrationNumber, " +
            "COALESCE(SUM(sr.cost), 0) as totalExpenditure, " +
            "COUNT(sr.id) as serviceCount " +
            "FROM vehicle v " +
            "LEFT JOIN service_record sr ON v.id = sr.vehicle_id " +
            "WHERE v.owner_id = :userId " +
            "GROUP BY v.id, v.model, v.registration_number " +
            "ORDER BY totalExpenditure DESC",
            nativeQuery = true)
    List<Object[]> getVehicleWiseExpenditureByUser(@Param("userId") Long userId);


    @Query(value = "SELECT v.id as vehicleId, " +
            "CONCAT(v.company, ' ', v.model) as vehicleName, " +
            "v.registration_number as registrationNumber, " +
            "COALESCE(MAX(sr.mileage), 0) as latestMileage, " +
            "COALESCE(SUM(sr.cost), 0) as totalServiceCost " +
            "FROM vehicle v " +
            "LEFT JOIN service_record sr ON v.id = sr.vehicle_id " +
            "WHERE v.owner_id = :userId " +
            "GROUP BY v.id, v.company, v.model, v.registration_number",
            nativeQuery = true)
    List<Object[]> getRunningCostDataByUser(@Param("userId") Long userId);

    @Query(value = "SELECT v.id as vehicleId, " +
            "CONCAT(v.company, ' ', v.model) as vehicleName, " +
            "v.registration_number as registrationNumber, " +
            "COUNT(sr.id) as serviceCount, " +
            "COALESCE(MAX(sr.mileage) - MIN(sr.mileage), 0) as totalMileageCovered " +
            "FROM vehicle v " +
            "INNER JOIN service_record sr ON v.id = sr.vehicle_id " +
            "WHERE v.owner_id = :userId " +
            "AND EXTRACT(YEAR FROM sr.date_of_service) = :year " +
            "GROUP BY v.id, v.company, v.model, v.registration_number " +
            "ORDER BY totalMileageCovered DESC " +
            "LIMIT 3",
            nativeQuery = true)
    List<Object[]> getTop3MostUsedVehiclesByYear(@Param("userId") Long userId, @Param("year") int year);

}