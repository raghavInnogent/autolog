package com.example.backend.serviceImpl;

import com.example.backend.dao.ServiceCategoriesDao;
import com.example.backend.dao.ServiceHistoryDao;
import com.example.backend.dao.VehicleDao;
import com.example.backend.dto.response.ServiceHistoryResponseDTO;
import com.example.backend.entity.ServiceCategories;
import com.example.backend.entity.ServiceHistory;
import com.example.backend.entity.ServicedItems;
import com.example.backend.entity.Vehicle;
import com.example.backend.enums.MessageKey;
import com.example.backend.enums.ReferenceType;
import com.example.backend.mapper.ServiceHistoryMapper;
import com.example.backend.repository.ServicedItemsRepository;
import com.example.backend.service.NotificationService;
import com.example.backend.service.ServiceHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ServiceHistoryServiceImpl implements ServiceHistoryService {

    private final ServiceHistoryDao serviceHistoryDao;
    private final ServicedItemsRepository servicedItemsRepository;
    private final ServiceCategoriesDao serviceCategoriesDao;
    private final VehicleDao vehicleDao;
    private final NotificationService notificationService;
    private final ServiceHistoryMapper serviceHistoryMapper;

    @Override
    public ServiceHistoryResponseDTO createHistory(ServiceHistory history) {
        ServiceHistory saved = serviceHistoryDao.save(history);
        log.info("ServiceHistory created with ID: {}", saved.getId());

        ServiceHistoryResponseDTO dto = serviceHistoryMapper.toResponseDTO(saved);
        enrichWithCategoryName(dto);
        return dto;
    }

    @Override
    public void checkAndCreatePrematureReplacementHistory(ServicedItems newItem, Long vehicleId) {
        log.info("Checking for premature replacement - New ServicedItem ID: {}, Vehicle ID: {}",
                newItem.getId(), vehicleId);

        LocalDate currentDate = LocalDate.now();

        // Find active items of the same category for this vehicle
        List<ServicedItems> activeOldItems = servicedItemsRepository.findActiveItemsByVehicleAndCategory(
                vehicleId, newItem.getServiceCategoryId(), currentDate);

        if (activeOldItems.isEmpty()) {
            log.info("No active old items found. This is a new or expired item replacement.");
            createNormalReplacementHistory(newItem, vehicleId);
            return;
        }

        // Take the most recent active item (first in the list due to ORDER BY)
        ServicedItems oldItem = activeOldItems.get(0);

        log.info("Found active old ServicedItem ID: {} with expiry: {}",
                oldItem.getId(), oldItem.getExpirationDate());

        // This is a premature replacement
        ServiceHistory history = new ServiceHistory();
        history.setVehicleId(vehicleId);
        history.setServiceCategoryId(newItem.getServiceCategoryId());
        history.setOldServicedItemId(oldItem.getId());
        history.setNewServicedItemId(newItem.getId());
        history.setOriginalExpiryDate(oldItem.getExpirationDate());
        history.setActualReplacementDate(LocalDate.now());
        history.setIsPrematureReplacement(true);

        long daysBeforeExpiry = ChronoUnit.DAYS.between(LocalDate.now(), oldItem.getExpirationDate());
        history.setDaysBeforeExpiry((int) daysBeforeExpiry);

        // Calculate replacement frequency
        Long frequency = serviceHistoryDao.countReplacementsByVehicleAndCategory(
                vehicleId, newItem.getServiceCategoryId());
        history.setReplacementFrequency(frequency.intValue() + 1);

        serviceHistoryDao.save(history);
        log.info("Premature replacement history created - {} days before expiry", daysBeforeExpiry);

        // Mark old item's notifications as ACKNOWLEDGED
        notificationService.markAsAcknowledged(oldItem.getId(), ReferenceType.SERVICED_ITEM);
    }

    @Override
    public List<ServiceHistoryResponseDTO> getByVehicle(Long vehicleId, Long userId) {
        Vehicle vehicle = vehicleDao.findById(vehicleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        MessageKey.VEHICLE_NOT_FOUND.name()));

        if (!vehicle.getOwner().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        List<ServiceHistory> histories = serviceHistoryDao.findByVehicleIdOrderByActualReplacementDateDesc(vehicleId);

        return histories.stream()
                .map(history -> {
                    ServiceHistoryResponseDTO dto = serviceHistoryMapper.toResponseDTO(history);
                    enrichWithCategoryName(dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceHistoryResponseDTO> getPrematureReplacements(Long vehicleId, Long userId) {
        Vehicle vehicle = vehicleDao.findById(vehicleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        MessageKey.VEHICLE_NOT_FOUND.name()));

        if (!vehicle.getOwner().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        List<ServiceHistory> histories = serviceHistoryDao.findByVehicleIdAndIsPrematureReplacementTrue(vehicleId);

        return histories.stream()
                .map(history -> {
                    ServiceHistoryResponseDTO dto = serviceHistoryMapper.toResponseDTO(history);
                    enrichWithCategoryName(dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Integer getReplacementFrequency(Long vehicleId, Long categoryId) {
        Long count = serviceHistoryDao.countReplacementsByVehicleAndCategory(vehicleId, categoryId);
        return count.intValue();
    }

    @Override
    public ServiceHistoryResponseDTO getById(Long id, Long userId) {
        ServiceHistory history = serviceHistoryDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "ServiceHistory not found with ID: " + id));

        Vehicle vehicle = vehicleDao.findById(history.getVehicleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        MessageKey.VEHICLE_NOT_FOUND.name()));

        if (!vehicle.getOwner().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        ServiceHistoryResponseDTO dto = serviceHistoryMapper.toResponseDTO(history);
        enrichWithCategoryName(dto);
        return dto;
    }

    // Helper methods

    private void createNormalReplacementHistory(ServicedItems newItem, Long vehicleId) {
        ServiceHistory history = new ServiceHistory();
        history.setVehicleId(vehicleId);
        history.setServiceCategoryId(newItem.getServiceCategoryId());
        history.setOldServicedItemId(null);
        history.setNewServicedItemId(newItem.getId());
        history.setOriginalExpiryDate(null);
        history.setActualReplacementDate(LocalDate.now());
        history.setIsPrematureReplacement(false);
        history.setDaysBeforeExpiry(null);

        // Calculate replacement frequency
        Long frequency = serviceHistoryDao.countReplacementsByVehicleAndCategory(
                vehicleId, newItem.getServiceCategoryId());
        history.setReplacementFrequency(frequency.intValue() + 1);

        serviceHistoryDao.save(history);
        log.info("Normal replacement history created for new ServicedItem ID: {}", newItem.getId());
    }

    private void enrichWithCategoryName(ServiceHistoryResponseDTO dto) {
        try {
            ServiceCategories category = serviceCategoriesDao.findById(dto.getServiceCategoryId());
            if (category != null) {
                dto.setServiceCategoryName(category.getName());
            }
        } catch (Exception e) {
            log.warn("ServiceCategory not found with ID: {}", dto.getServiceCategoryId());
        }
    }
}