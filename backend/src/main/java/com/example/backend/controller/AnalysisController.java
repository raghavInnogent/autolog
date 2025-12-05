package com.example.backend.controller;

import com.example.backend.dto.analysis.MonthlyExpenditureDTO;
import com.example.backend.dto.analysis.TopUsedVehicleDTO;
import com.example.backend.dto.analysis.VehicleExpenditureDTO;
import com.example.backend.dto.analysis.VehicleRunningCostDTO;
import com.example.backend.security.UserPrincipal;
import com.example.backend.service.ServiceRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.List;

@RestController
@RequestMapping("/analysis")
public class AnalysisController {

    @Autowired
    private ServiceRecordService serviceRecordService;

    @GetMapping("/getMonthlyExpenditure")
    public ResponseEntity<MonthlyExpenditureDTO> getMonthlyExpenditure() {
        MonthlyExpenditureDTO expenditure = serviceRecordService.getMonthlyExpenditure();
        return ResponseEntity.ok(expenditure);
    }

    @GetMapping("/getVehicleWiseExpenditure")
    public ResponseEntity<List<VehicleExpenditureDTO>> getVehicleWiseExpenditure() {
        Long userId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();


        try {
            List<VehicleExpenditureDTO> expenditures =
                    serviceRecordService.getVehicleWiseExpenditure(userId);
            return ResponseEntity.ok(expenditures);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getRunningCostPerKm")
    public ResponseEntity<List<VehicleRunningCostDTO>> getRunningCostPerKm() {

        Long userId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();

        try {
            List<VehicleRunningCostDTO> runningCosts =
                    serviceRecordService.getRunningCostPerKm(userId);
            return ResponseEntity.ok(runningCosts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getTop3MostUsedVehicles")
    public ResponseEntity<List<TopUsedVehicleDTO>> getTop3MostUsedVehicles() {
        Long userId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();

        try {
            int targetYear = 2025;

            List<TopUsedVehicleDTO> topVehicles =
                    serviceRecordService.getTop3MostUsedVehicles(userId, targetYear);
            return ResponseEntity.ok(topVehicles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getMostEfficientVehicle")
    public ResponseEntity<VehicleRunningCostDTO> getMostEfficientVehicle() {
        Long userId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();

        try {
            VehicleRunningCostDTO efficientVehicle =
                    serviceRecordService.getMostEfficientVehicle(userId);

            if (efficientVehicle == null) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(efficientVehicle);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}