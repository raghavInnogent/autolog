package com.example.backend.repository;

import com.example.backend.entity.ServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ServiceRecordRepository extends JpaRepository<ServiceRecord, Long> {
    List<ServiceRecord> findByDateOfServiceBetween(LocalDate from, LocalDate to);
    List<ServiceRecord> findByVehicleId(Long vehicleId);

}