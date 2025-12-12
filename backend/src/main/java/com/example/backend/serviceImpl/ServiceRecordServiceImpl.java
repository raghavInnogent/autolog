package com.example.backend.serviceImpl;

import com.example.backend.dao.PrematureServiceItemDao;
import com.example.backend.dao.ServiceCategoriesDao;
import com.example.backend.dao.ServiceRecordDao;
import com.example.backend.dao.VehicleDao;
import com.example.backend.dto.analysis.MonthlyExpenditureDTO;
import com.example.backend.dto.analysis.TopUsedVehicleDTO;
import com.example.backend.dto.analysis.VehicleExpenditureDTO;
import com.example.backend.dto.analysis.VehicleRunningCostDTO;
import com.example.backend.dto.ocr.ServiceRecordOCR_DTO;
import com.example.backend.dto.request.PrematureServiceItemRequestDto;
import com.example.backend.dto.request.ServiceRecordRequestDTO;
import com.example.backend.dto.request.ServicedItemRequestDTO;
import com.example.backend.dto.response.ServiceRecordResponseDTO;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.entity.*;
import com.example.backend.event.ServiceRecordCreatedEvent;  // ADD THIS
import com.example.backend.mapper.ServiceRecordMapper;
import com.example.backend.repository.ServiceCategoriesRepository;
import com.example.backend.repository.ServicedItemsRepository;
import com.example.backend.repository.VehicleRepository;
import com.example.backend.service.PrematureServiceItemService;
import com.example.backend.service.ServiceRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;  // ADD THIS
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceRecordServiceImpl implements ServiceRecordService {

    private final ServiceRecordDao dao;
    private final VehicleRepository vehicleRepo;
    private final ServiceCategoriesRepository categoryRepo;
    private final ServiceRecordMapper mapper;
    private final ServiceCategoriesDao  categoryDao;
    private final AuthServiceImpl authService;
    private final PrematureServiceItemService prematureServiceItemService;
    private final ServicedItemsRepository servicedItemsRepository;
    private final PrematureServiceItemDao prematureServiceItemDao;
    @Autowired
    private VehicleDao vehicleDao;

    @Override
    public ServiceRecordResponseDTO create(ServiceRecordRequestDTO dto) {
        ServiceRecord record = mapper.toEntity(dto);

        Vehicle vehicle = vehicleRepo.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        String.format("Vehicle not found with id: %d", dto.getVehicleId())
                ));
        vehicle.setOdometerReading(dto.getMileage());
        record.setVehicle(vehicle);
        record.getServicedItems().forEach(item-> {
            ServiceCategories category = categoryDao.findById(item.getServiceCategoryId());
            Period period =category.getExpiryInMonths();
            item.setCategoryName(category.getName());
            item.setExpirationDate(record.getDateOfService().plus(period));
        });

        ServiceRecord savedRecord = dao.save(record);
        checkAndStorePrematureItems(savedRecord, vehicle.getOwner().getId());

        return mapper.toResponseDTO(savedRecord);
    }

    @Override
    public ServiceRecordResponseDTO getById(Long id) {
        ServiceRecord record = dao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"ServiceRecord not found"));
        return mapper.toResponseDTO(record);
    }

    @Override
    public List<ServiceRecordResponseDTO> getAllByUserId(Long userId) {
        return dao.findByUserId(userId).stream()
                .map(mapper::toResponseDTO)
                .toList();
    }


    @Override
    public List<ServiceRecordResponseDTO> getByVehicleId(Long vehicleId) {
        return dao.findByVehicleId(vehicleId).stream()
                .map(mapper::toResponseDTO)
                .toList();
    }



    @Override
    public MonthlyExpenditureDTO getMonthlyExpenditure() {
        UserResponseDTO user = authService.getCurrentUser();


        List<Object[]> results = dao.getMonthlyExpenditureByYear(user.getId(),2025);

        List<Double> monthlyExpenditure = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            monthlyExpenditure.add(0.0);
        }

        double totalExpenditure = 0.0;

        for (Object[] result : results) {
            int month = ((Number) result[0]).intValue() - 1;
            double amount = ((Number) result[1]).doubleValue();
            monthlyExpenditure.set(month, amount);
            totalExpenditure += amount;
        }

        return new MonthlyExpenditureDTO(2025, monthlyExpenditure, totalExpenditure);
    }

    @Override
    public List<VehicleExpenditureDTO> getVehicleWiseExpenditure(Long userId) {
        List<Object[]> results = dao.getVehicleWiseExpenditureByUser(userId);
        List<VehicleExpenditureDTO> dtos = new ArrayList<>();

        for (Object[] row : results) {
            VehicleExpenditureDTO dto = new VehicleExpenditureDTO();
            dto.setVehicleId(((Number) row[0]).longValue());
            dto.setVehicleName((String) row[1]);
            dto.setRegistrationNumber((String) row[2]);
            dto.setTotalExpenditure(((Number) row[3]).doubleValue());
            dto.setServiceCount(((Number) row[4]).intValue());
            dtos.add(dto);
        }

        return dtos;
    }
    @Override
    public List<VehicleRunningCostDTO> getRunningCostPerKm(Long userId) {
        List<Object[]> results = dao.getRunningCostDataByUser(userId);
        List<VehicleRunningCostDTO> vehicleRunningCosts = new ArrayList<>();

        for (Object[] row : results) {
            VehicleRunningCostDTO cost = new VehicleRunningCostDTO();
            cost.setVehicleId(((Number) row[0]).longValue());
            cost.setVehicleName((String) row[1]);
            cost.setRegistrationNumber((String) row[2]);

            int latestMileage = ((Number) row[3]).intValue();
            double totalServiceCost = ((Number) row[4]).doubleValue();

            cost.setLatestMileage(latestMileage);
            cost.setTotalServiceCost(totalServiceCost);

            double runningCostPerKm = 0.0;
            if (latestMileage > 0) {
                runningCostPerKm = totalServiceCost / latestMileage;
            }
            cost.setRunningCostPerKm(runningCostPerKm);

            vehicleRunningCosts.add(cost);
        }

        return vehicleRunningCosts;
    }

    public VehicleRunningCostDTO getMostEfficientVehicle(Long userId) {
        List<VehicleRunningCostDTO> allVehicles = this.getRunningCostPerKm(userId);

        return allVehicles.stream()
                .filter(v -> v.getLatestMileage() > 0)
                .min(Comparator.comparing(VehicleRunningCostDTO::getRunningCostPerKm))
                .orElse(null);
    }


    @Override
    public ServiceRecordRequestDTO convertToRequestDTO(ServiceRecordOCR_DTO dto) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date = LocalDate.parse(dto.getDateOfService(), formatter);


        ServiceRecordRequestDTO serviceRecordRequestDTO = new ServiceRecordRequestDTO();
        serviceRecordRequestDTO.setVehicleId(vehicleDao.findByRegistrationNumber(dto.getVehicleNo()).orElseThrow(() ->
                new RuntimeException( "No vehicle found with ID: ")).getId());
        serviceRecordRequestDTO.setCost(dto.getCost());
        serviceRecordRequestDTO.setDateOfService(date);
        serviceRecordRequestDTO.setMileage(dto.getMileage());
        serviceRecordRequestDTO.setType(dto.getType());
        serviceRecordRequestDTO.setWorkshop(dto.getWorkshop());
        List<ServicedItemRequestDTO> servicedItems = dto.getServicedItems().stream().map((item)-> {
            ServicedItemRequestDTO servicedItem = new ServicedItemRequestDTO();
            servicedItem.setQuantity(item.getQuantity());
            servicedItem.setCostPerItem(item.getPerItemCost());
            if (categoryDao.existsByName(item.getItemName()))
                    {
                        servicedItem.setServiceCategoryId(categoryDao.findByName(item.getItemName()).getId());
                        return servicedItem;
                    }
            else
            {
                ServiceCategories serviceCategories = new ServiceCategories();
                serviceCategories.setName(item.getItemName());
                serviceCategories.setExpiryInMonths(Period.ofMonths(item.getExpiryInMonth()));
                servicedItem.setServiceCategoryId(categoryDao.save(serviceCategories).getId());

            }
            return servicedItem;
        }).toList();

        serviceRecordRequestDTO.setServicedItems(servicedItems);


        return serviceRecordRequestDTO;

    }

    private void checkAndStorePrematureItems(ServiceRecord savedRecord, Long userId) {
        LocalDate today = LocalDate.now();
        Long vehicleId = savedRecord.getVehicle().getId();

        for (ServicedItems serviceItem : savedRecord.getServicedItems()) {

            Long categoryId = serviceItem.getServiceCategoryId();
            LocalDate newExpirationDate = serviceItem.getExpirationDate();

            ServicedItems previousItem = servicedItemsRepository.getPrematureItemByExpirationDate(
                    vehicleId, categoryId, today);

            if (previousItem != null && newExpirationDate.isBefore(previousItem.getExpirationDate())) {
                addPrematureServiceItem(serviceItem, categoryId, vehicleId, userId);
            }
        }
    }

    private void addPrematureServiceItem(ServicedItems serviceItem, Long categoryId,
            Long vehicleId, Long userId) {
        try {

            PrematureServiceItem existing = prematureServiceItemDao.findByCategoryId(categoryId)
                    .orElse(null);

            PrematureServiceItemRequestDto requestDto = new PrematureServiceItemRequestDto();
            requestDto.setUserId(userId);
            requestDto.setVehicleId(vehicleId);
            requestDto.setCategoryId(categoryId);

            if (existing != null) {
                requestDto.setPrematureCount(existing.getPrematureCount() + 1);
                prematureServiceItemService.updatePrematureItem(requestDto);
            } else {
                requestDto.setPrematureCount(1);
                prematureServiceItemService.savePrematureItem(requestDto);
            }
        } catch (Exception e) {
            System.err.println("Failed to record premature replacement for categoryId: "
                    + categoryId + " - " + e.getMessage());
        }
    }
}
