package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/")
public class ApiStubsController {

//    @GetMapping("/documents")
//    public ResponseEntity<List<?>> documents() {
//        return ResponseEntity.ok(Collections.emptyList());
//    }

    @GetMapping("/services")
    public ResponseEntity<List<?>> services() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<?>> notifications() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/schedules/upcoming")
    public ResponseEntity<List<?>> schedulesUpcoming(@RequestParam(required = false) Long vehicleId) {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/analytics/spend-by-category")
    public ResponseEntity<List<?>> analyticsSpendByCategory(@RequestParam(required = false) Long vehicleId,
                                                            @RequestParam(required = false) String period) {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/analytics/cost-per-km")
    public ResponseEntity<List<?>> analyticsCostPerKm(@RequestParam(required = false) Long vehicleId,
                                                      @RequestParam(required = false) String period) {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/analytics/service-frequency")
    public ResponseEntity<List<?>> analyticsServiceFrequency(@RequestParam(required = false) Long vehicleId,
                                                             @RequestParam(required = false) String period) {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/analytics/ownership-cost")
    public ResponseEntity<List<?>> analyticsOwnershipCost(@RequestParam(required = false) Long vehicleId) {
        return ResponseEntity.ok(Collections.emptyList());
    }
}