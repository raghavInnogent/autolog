package com.example.backend.service;

import com.example.backend.dto.analysis.MonthlyExpenditureDTO;
import com.example.backend.dto.analysis.TopUsedVehicleDTO;
import com.example.backend.dto.analysis.VehicleExpenditureDTO;
import com.example.backend.dto.analysis.VehicleRunningCostDTO;
import com.example.backend.dto.request.ServiceRecordRequestDTO;
import com.example.backend.dto.response.ServiceRecordResponseDTO;

import java.util.List;

public interface ServiceRecordService {

    ServiceRecordResponseDTO create(ServiceRecordRequestDTO dto);

    ServiceRecordResponseDTO getById(Long id);

    List<ServiceRecordResponseDTO> getAll();

    MonthlyExpenditureDTO getMonthlyExpenditure();

    List<VehicleExpenditureDTO> getVehicleWiseExpenditure(Long userId);

    List<VehicleRunningCostDTO> getRunningCostPerKm(Long userId);

    List<TopUsedVehicleDTO> getTop3MostUsedVehicles(Long userId, int targetYear);

    VehicleRunningCostDTO getMostEfficientVehicle(Long userId);
}