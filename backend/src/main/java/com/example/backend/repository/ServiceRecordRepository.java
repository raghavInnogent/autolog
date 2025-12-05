package com.example.backend.repository;

import com.example.backend.entity.ServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
@Repository
public interface ServiceRecordRepository extends JpaRepository<ServiceRecord, Long> {
    List<ServiceRecord> findByDateOfServiceBetween(LocalDate from, LocalDate to);
    List<ServiceRecord> findByVehicleId(Long vehicleId);

}