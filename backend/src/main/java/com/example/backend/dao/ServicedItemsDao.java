package com.example.backend.dao;

import com.example.backend.entity.ServiceCategories;
import com.example.backend.entity.ServicedItems;
import com.example.backend.entity.Vehicle;
import com.example.backend.repository.ServicedItemsRepository;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class ServicedItemsDao {

    @Autowired
    ServicedItemsRepository servicedItemsRepository;
    public ServicedItems findById(Long id) {
        return servicedItemsRepository.findById(id).get();
    }
    public List<ServicedItems> findAll() {
        return servicedItemsRepository.findAll();
    }
    public List<ServicedItems> findByVehicleId(Long vehicleId) {
        return servicedItemsRepository.findByVehicleId(vehicleId);
    }
    public List<ServicedItems> findActiveItemsByVehicleAndCategory(Long vehicleId, Long categoryId, LocalDate currentDate) {
        return servicedItemsRepository.findActiveItemsByVehicleAndCategory(vehicleId,categoryId,currentDate);
    }
    public ServicedItems getPrematureItemByExpirationDate(Long vehicleId, Long categoryId, LocalDate currentDate) {
        return servicedItemsRepository.getPrematureItemByExpirationDate(vehicleId, categoryId, currentDate);
    }

}
