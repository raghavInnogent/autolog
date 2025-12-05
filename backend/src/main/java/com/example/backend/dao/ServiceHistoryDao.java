package com.example.backend.dao;

import com.example.backend.entity.ServiceHistory;
import com.example.backend.repository.ServiceHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ServiceHistoryDao {

    private final ServiceHistoryRepository serviceHistoryRepository;

    public ServiceHistory save(ServiceHistory serviceHistory) {
        return serviceHistoryRepository.save(serviceHistory);
    }

    public Optional<ServiceHistory> findById(Long id) {
        return serviceHistoryRepository.findById(id);
    }

    public List<ServiceHistory> findAll() {
        return serviceHistoryRepository.findAll();
    }

    public void delete(ServiceHistory serviceHistory) {
        serviceHistoryRepository.delete(serviceHistory);
    }

    public List<ServiceHistory> findByVehicleIdOrderByActualReplacementDateDesc(Long vehicleId) {
        return serviceHistoryRepository.findByVehicleIdOrderByActualReplacementDateDesc(vehicleId);
    }

    public List<ServiceHistory> findByVehicleIdAndIsPrematureReplacementTrue(Long vehicleId) {
        return serviceHistoryRepository.findByVehicleIdAndIsPrematureReplacementTrue(vehicleId);
    }

    public List<ServiceHistory> findByVehicleIdAndServiceCategoryIdOrderByActualReplacementDateDesc(
            Long vehicleId, Long serviceCategoryId) {
        return serviceHistoryRepository.findByVehicleIdAndServiceCategoryIdOrderByActualReplacementDateDesc(
                vehicleId, serviceCategoryId);
    }

    public Long countReplacementsByVehicleAndCategory(Long vehicleId, Long categoryId) {
        return serviceHistoryRepository.countReplacementsByVehicleAndCategory(vehicleId, categoryId);
    }

    public Optional<ServiceHistory> findFirstByVehicleIdAndServiceCategoryIdOrderByActualReplacementDateDesc(
            Long vehicleId, Long serviceCategoryId) {
        return serviceHistoryRepository.findFirstByVehicleIdAndServiceCategoryIdOrderByActualReplacementDateDesc(
                vehicleId, serviceCategoryId);
    }

    public Optional<ServiceHistory> findByNewServicedItemId(Long servicedItemId) {
        return serviceHistoryRepository.findByNewServicedItemId(servicedItemId);
    }

    public Optional<ServiceHistory> findByOldServicedItemId(Long oldServicedItemId) {
        return serviceHistoryRepository.findByOldServicedItemId(oldServicedItemId);
    }
}