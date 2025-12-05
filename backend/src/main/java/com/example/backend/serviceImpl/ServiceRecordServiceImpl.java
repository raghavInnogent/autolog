package com.example.backend.serviceImpl;

import com.example.backend.dao.ServiceCategoriesDao;
import com.example.backend.dao.ServiceRecordDao;
import com.example.backend.dto.analysis.MonthlyExpenditureDTO;
import com.example.backend.dto.analysis.TopUsedVehicleDTO;
import com.example.backend.dto.analysis.VehicleExpenditureDTO;
import com.example.backend.dto.analysis.VehicleRunningCostDTO;
import com.example.backend.dto.request.ServiceRecordRequestDTO;
import com.example.backend.dto.response.ServiceRecordResponseDTO;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.entity.ServiceRecord;
import com.example.backend.entity.Vehicle;
import com.example.backend.event.ServiceRecordCreatedEvent;  // ADD THIS
import com.example.backend.mapper.ServiceRecordMapper;
import com.example.backend.repository.ServiceCategoriesRepository;
import com.example.backend.repository.VehicleRepository;
import com.example.backend.service.ServiceRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;  // ADD THIS
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Period;
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
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Override
    public ServiceRecordResponseDTO create(ServiceRecordRequestDTO dto) {
        ServiceRecord record = mapper.toEntity(dto);

        Vehicle vehicle = vehicleRepo.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        String.format("Vehicle not found with id: %d", dto.getVehicleId())
                ));
        record.setVehicle(vehicle);

        System.out.println(dto);
        System.out.println(record);
        record.getServicedItems().forEach(item-> {
            Period period =categoryDao.findById(item.getServiceCategoryId()).getExpiryInMonths();
            item.setExpirationDate(record.getDateOfService().plus(period));
        });

        ServiceRecord savedRecord = dao.save(record);
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
    public MonthlyExpenditureDTO getMonthlyExpenditure() {
        UserResponseDTO user = authService.getCurrentUser();


        List<Object[]> results = dao.getMonthlyExpenditureByYear(user.getId(),2025);

        List<Double> monthlyExpenditure = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            monthlyExpenditure.add(0.0);
        }

        double totalExpenditure = 0.0;

        for (Object[] result : results) {
            int month = ((Number) result[0]).intValue() - 1; // Convert to 0-indexed (Jan=0)
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

    public List<TopUsedVehicleDTO> getTop3MostUsedVehicles(Long userId, int year) {
        List<Object[]> results = dao.getTop3MostUsedVehiclesByYear(userId, year);
        List<TopUsedVehicleDTO> topVehicles = new ArrayList<>();

        for (Object[] row : results) {
            TopUsedVehicleDTO dto = new TopUsedVehicleDTO();
            dto.setVehicleId(((Number) row[0]).longValue());
            dto.setVehicleName((String) row[1]);
            dto.setRegistrationNumber((String) row[2]);
            dto.setServiceCount(((Number) row[3]).intValue());
            dto.setTotalMileageCovered(((Number) row[4]).intValue());
            topVehicles.add(dto);
        }

        return topVehicles;
    }

    public VehicleRunningCostDTO getMostEfficientVehicle(Long userId) {
        List<VehicleRunningCostDTO> allVehicles = this.getRunningCostPerKm(userId);

        return allVehicles.stream()
                .filter(v -> v.getLatestMileage() > 0)
                .min(Comparator.comparing(VehicleRunningCostDTO::getRunningCostPerKm))
                .orElse(null);
    }
}

