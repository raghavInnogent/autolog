package com.example.backend.service;

import com.example.backend.dto.analysis.MonthlyExpenditureDTO;
import com.example.backend.dto.analysis.TopUsedVehicleDTO;
import com.example.backend.dto.analysis.VehicleExpenditureDTO;
import com.example.backend.dto.analysis.VehicleRunningCostDTO;
import com.example.backend.dto.request.ServiceRecordRequestDTO;
import com.example.backend.dto.response.ServiceRecordResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface ServiceRecordService {

    ServiceRecordResponseDTO create(ServiceRecordRequestDTO dto);

    ServiceRecordResponseDTO getById(Long id);

    List<ServiceRecordResponseDTO> getAllByUserId(Long userId);

    MonthlyExpenditureDTO getMonthlyExpenditure();

    List<VehicleExpenditureDTO> getVehicleWiseExpenditure(Long userId);

    List<VehicleRunningCostDTO> getRunningCostPerKm(Long userId);

    List<TopUsedVehicleDTO> getTop3MostUsedVehicles(Long userId, int targetYear);

    VehicleRunningCostDTO getMostEfficientVehicle(Long userId);
}