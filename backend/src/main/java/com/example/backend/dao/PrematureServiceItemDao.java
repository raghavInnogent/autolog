package com.example.backend.dao;

import com.example.backend.entity.PrematureServiceItem;
import com.example.backend.repository.PrematureServiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrematureServiceItemDao {

    @Autowired
    private PrematureServiceItemRepository prematureServiceItemRepository;

    public PrematureServiceItem save(PrematureServiceItem prematureServiceItem) {
        return prematureServiceItemRepository.save(prematureServiceItem);
    }

    public Optional<PrematureServiceItem> findById(Long id) {
        return prematureServiceItemRepository.findById(id);
    }

    public void deleteById(Long id) {
        prematureServiceItemRepository.deleteById(id);
    }

    public Optional<PrematureServiceItem> findByCategoryId(Long categoryId) {
        return Optional.ofNullable(prematureServiceItemRepository.getPrematureServiceItemByCategoryId(categoryId));
    }

    public List<PrematureServiceItem> findByUserId(Long userId) {
        return prematureServiceItemRepository.findByUserId(userId);
    }

    public List<PrematureServiceItem> findByVehicleId(Long vehicleId) {
        return prematureServiceItemRepository.findByVehicleId(vehicleId);
    }

    public List<PrematureServiceItem> findByUserIdAndVehicleId(Long userId, Long vehicleId) {
        return prematureServiceItemRepository.findByUserIdAndVehicleId(userId, vehicleId);
    }

    public Integer getTotalPrematureCountByCategoryId(Long categoryId) {
        return prematureServiceItemRepository.getTotalPrematureCountByCategoryId(categoryId);
    }

    public Integer getTotalPrematureCountByVehicleIdAndCategoryId(Long vehicleId, Long categoryId) {
        return prematureServiceItemRepository.getTotalPrematureCountByVehicleIdAndCategoryId(vehicleId, categoryId);
    }

    public Integer getAdminTotalPrematureCountForAllCategories() {
        return prematureServiceItemRepository.getAdminTotalPrematureCountForAllCategories();
    }
}
