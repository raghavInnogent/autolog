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

    @GetMapping("/analytics/spend-by-category")
    public ResponseEntity<List<?>> analyticsSpendByCategory(@RequestParam(required = false) Long vehicleId,
            @RequestParam(required = false) String period) {
        return ResponseEntity.ok(Collections.emptyList());
    }
    @GetMapping("/notifications")
    public ResponseEntity<List<?>> notification(@RequestParam(required = false) Long vehicleId,
            @RequestParam(required = false) String period) {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/analytics/cost-per-km")
    public ResponseEntity<List<?>> analyticsCostPerKm(@RequestParam(required = false) Long vehicleId,
            @RequestParam(required = false) String period) {
        return ResponseEntity.ok(Collections.emptyList());
    }
}