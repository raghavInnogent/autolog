package com.example.backend.serviceImpl;

import com.example.backend.dao.PrematureServiceItemDao;
import com.example.backend.dao.ServiceCategoriesDao;
import com.example.backend.dao.VehicleDao;
import com.example.backend.dto.request.PrematureServiceItemRequestDto;
import com.example.backend.dto.response.PrematureItemResponseDto;
import com.example.backend.entity.PrematureServiceItem;
import com.example.backend.entity.ServiceCategories;
import com.example.backend.entity.Vehicle;
import com.example.backend.enums.MessageKey;
import com.example.backend.mapper.PrematureServiceItemMapper;
import com.example.backend.service.PrematureServiceItemService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class PrematureServiceItemServiceImpl implements PrematureServiceItemService {

    @Autowired
    private PrematureServiceItemDao prematureServiceItemDao;

    @Autowired
    private PrematureServiceItemMapper prematureServiceItemMapper;

    @Autowired
    private VehicleDao vehicleDao;

    @Autowired
    private ServiceCategoriesDao serviceCategoriesDao;

    @Override
    public PrematureItemResponseDto savePrematureItem(PrematureServiceItemRequestDto itemDto) {
        if (itemDto == null) {
            log.error("Request body is null");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body cannot be null");
        }

        log.info("Creating new premature item for userId: {}, vehicleId: {}, categoryId: {}",
                itemDto.getUserId(), itemDto.getVehicleId(), itemDto.getCategoryId());

        if (itemDto.getUserId() == null || itemDto.getVehicleId() == null || itemDto.getCategoryId() == null) {
            log.error("Missing required fields in request");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId, vehicleId, and categoryId are required");
        }

        validatePrematureCount(itemDto.getPrematureCount());
        validateVehicleOwnership(itemDto.getVehicleId(), itemDto.getUserId());
        validateCategoryExists(itemDto.getCategoryId());

        PrematureServiceItem prematureItem = prematureServiceItemMapper.toEntity(itemDto);
        PrematureServiceItem savedItem = prematureServiceItemDao.save(prematureItem);

        PrematureItemResponseDto responseDto = convertToResponseDTO(savedItem);

        log.info("Successfully created premature item with id: {}", savedItem.getId());
        return responseDto;
    }

    @Override
    public PrematureItemResponseDto updatePrematureItem(PrematureServiceItemRequestDto itemDto) {
        log.info("Updating premature item for categoryId: {}", itemDto.getCategoryId());

        validatePrematureCount(itemDto.getPrematureCount());

        PrematureServiceItem existingItem = prematureServiceItemDao.findByCategoryId(itemDto.getCategoryId())
                .orElseThrow(() -> {
                    log.error("Premature item not found for categoryId: {}", itemDto.getCategoryId());
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Premature service item not found");
                });

        validateVehicleOwnership(itemDto.getVehicleId(), itemDto.getUserId());
        validateCategoryExists(itemDto.getCategoryId());

        existingItem.setUserId(itemDto.getUserId());
        existingItem.setVehicleId(itemDto.getVehicleId());
        existingItem.setCategoryId(itemDto.getCategoryId());
        existingItem.setPrematureCount(itemDto.getPrematureCount());

        PrematureServiceItem updatedItem = prematureServiceItemDao.save(existingItem);
        PrematureItemResponseDto responseDto = convertToResponseDTO(updatedItem);

        log.info("Successfully updated premature item with id: {}", updatedItem.getId());
        return responseDto;
    }



    @Override
    public List<PrematureItemResponseDto> getAllPrematureItemsByUserId(Long userId) {
        log.info("Fetching all premature items for userId: {}", userId);

        List<PrematureItemResponseDto> responseList = prematureServiceItemDao.findByUserId(userId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());

        log.info("Found {} premature items for userId: {}", responseList.size(), userId);
        return responseList;
    }

    @Override
    public Integer getTotalPrematureCountByCategoryId(Long categoryId) {
        log.info("Fetching total premature count for categoryId: {}", categoryId);

        ServiceCategories category = serviceCategoriesDao.findById(categoryId);
        if (category == null) {
            log.error("Category not found with id: {}", categoryId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }

        Integer count = prematureServiceItemDao.getTotalPrematureCountByCategoryId(categoryId);
        log.info("Total premature count for categoryId {}: {}", categoryId, count);
        return count;
    }

    @Override
    public Integer getTotalPrematureCountByVehicleIdAndCategoryId(Long vehicleId, Long categoryId) {
        log.info("Fetching total premature count for vehicleId: {} and categoryId: {}", vehicleId, categoryId);

        vehicleDao.findById(vehicleId)
                .orElseThrow(() -> {
                    log.error("Vehicle not found with id: {}", vehicleId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.VEHICLE_NOT_FOUND.name());
                });

        ServiceCategories category = serviceCategoriesDao.findById(categoryId);
        if (category == null) {
            log.error("Category not found with id: {}", categoryId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }

        Integer count = prematureServiceItemDao.getTotalPrematureCountByVehicleIdAndCategoryId(vehicleId, categoryId);
        log.info("Total premature count for vehicleId {} and categoryId {}: {}", vehicleId, categoryId, count);
        return count;
    }

    @Override
    public Integer getAdminTotalPrematureCountForAllCategories() {
        log.info("Fetching total premature count for all categories (admin)");

        Integer count = prematureServiceItemDao.getAdminTotalPrematureCountForAllCategories();
        log.info("Total premature count across all categories: {}", count);
        return count;
    }

    @Override
    public List<PrematureItemResponseDto> getPrematureByVehicleId(Long vehicleId) {
        log.info("Fetching premature items for vehicleId: {}", vehicleId);

        vehicleDao.findById(vehicleId)
                .orElseThrow(() -> {
                    log.error("Vehicle not found with id: {}", vehicleId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.VEHICLE_NOT_FOUND.name());
                });

        List<PrematureServiceItem> prematureItems = prematureServiceItemDao.findByVehicleId(vehicleId);

        if (prematureItems.isEmpty()) {
            log.info("No premature items found for vehicleId: {}", vehicleId);
            return new ArrayList<PrematureItemResponseDto>();
        }

        List<PrematureItemResponseDto> responseDtos = prematureItems.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());

        log.info("Found {} premature items for vehicleId: {}", responseDtos.size(), vehicleId);
        return responseDtos;
    }

    @Override
    public List<PrematureItemResponseDto> getPrematureItemByUserIdAndVehicleId(Long userId,
            Long vehicleId) {
        log.info("Fetching premature items for userId: {} and vehicleId: {}", userId, vehicleId);

        vehicleDao.findById(vehicleId)
                .orElseThrow(() -> {
                    log.error("Vehicle not found with id: {}", vehicleId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.VEHICLE_NOT_FOUND.name());
                });

        List<PrematureServiceItem> prematureItems = prematureServiceItemDao.findByUserIdAndVehicleId(userId, vehicleId);

        if (prematureItems.isEmpty()) {
            log.info("No premature items found for userId: {} and vehicleId: {}", userId, vehicleId);
            return new ArrayList<PrematureItemResponseDto>();
        }

        List<PrematureItemResponseDto> responseDtos = prematureItems.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());

        log.info("Found {} premature items for userId: {} and vehicleId: {}", responseDtos.size(), userId, vehicleId);
        return responseDtos;
    }

    private PrematureItemResponseDto convertToResponseDTO(PrematureServiceItem item) {
        String vehicleName = "Unknown";
        if (item.getVehicleId() != null) {
            Vehicle vehicle = vehicleDao.findById(item.getVehicleId()).orElse(null);
            if (vehicle != null) {
                vehicleName = vehicle.getModel();
            }
        }

        String categoryName = "Unknown";
        if (item.getCategoryId() != null) {
            ServiceCategories category = serviceCategoriesDao.findById(item.getCategoryId());
            if (category != null) {
                categoryName = category.getName();
            }
        }

        return prematureServiceItemMapper.toResponseDTO(item, vehicleName, categoryName);
    }

    private void validateVehicleOwnership(Long vehicleId, Long userId) {
        Vehicle vehicle = vehicleDao.findById(vehicleId)
                .orElseThrow(() -> {
                    log.error("Vehicle not found with id: {}", vehicleId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.VEHICLE_NOT_FOUND.name());
                });

        if (!vehicle.getOwner().getId().equals(userId)) {
            log.error("Vehicle {} does not belong to user {}", vehicleId, userId);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vehicle does not belong to this user");
        }
    }

    private void validateCategoryExists(Long categoryId) {
        ServiceCategories category = serviceCategoriesDao.findById(categoryId);
        if (category == null) {
            log.error("Category not found with id: {}", categoryId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }
    }

    private void validatePrematureCount(int count) {
        if (count < 0) {
            log.error("Invalid premature count: {}", count);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Premature count cannot be negative");
        }
    }
}
