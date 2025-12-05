package com.example.backend.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.ServiceRecord;
import com.example.backend.repository.ServiceRecordRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ServiceRecordDao {
	@Autowired
    private  ServiceRecordRepository serviceRecordRepository;

    public ServiceRecord save(ServiceRecord record) {
        return serviceRecordRepository.save(record);
    }

    public Optional<ServiceRecord> findById(Long id) {
        return serviceRecordRepository.findById(id);
    }

    public List<ServiceRecord> findByVehicleId(Long vehicleId) {
        return serviceRecordRepository.findByVehicleId(vehicleId);
    }

    public List<ServiceRecord> findAll() {

        return serviceRecordRepository.findAll();
    }

    public List<Object[]> getMonthlyExpenditureByYear(Long userId, int year) {
        return serviceRecordRepository.getMonthlyExpenditureByYear(userId,year);
    }

    public List<Object[]> getVehicleWiseExpenditureByUser(Long userId) {
        return serviceRecordRepository.getVehicleWiseExpenditureByUser(userId);
    }

    public List<Object[]> getRunningCostDataByUser(Long userId) {
        return serviceRecordRepository.getRunningCostDataByUser(userId);
    }

    public List<Object[]> getTop3MostUsedVehiclesByYear(Long userId, int year) {
        return serviceRecordRepository.getTop3MostUsedVehiclesByYear(userId, year);
    }
}
