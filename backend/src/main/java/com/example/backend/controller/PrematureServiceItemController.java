package com.example.backend.controller;

import com.example.backend.dto.request.PrematureServiceItemRequestDto;
import com.example.backend.dto.response.PrematureItemResponseDto;
import com.example.backend.security.UserPrincipal;
import com.example.backend.service.PrematureServiceItemService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/premature")
public class PrematureServiceItemController {

    @Autowired
    private PrematureServiceItemService prematureServiceItemService;

    @GetMapping("/getAllForUser")
    public ResponseEntity<List<PrematureItemResponseDto>> getAllPrematureItems() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("GET All For User - Fetching all premature items for userId: {}", principal.getId());
        return prematureServiceItemService.getAllPrematureItemsByUserId(principal.getId());
    }

    @GetMapping("/getCountByCategory/{categoryId}")
    public ResponseEntity<Integer> getTotalPrematureCountByCategoryId(@PathVariable Long categoryId) {
        log.info("GET Count By Category/category/{} - Fetching total count for category", categoryId);
        return prematureServiceItemService.getTotalPrematureCountByCategoryId(categoryId);
    }

    @GetMapping("/getCountByVehicleIdAndCategoryId/{vehicleId}/{categoryId}")
    public ResponseEntity<Integer> getTotalPrematureCountByVehicleIdAndCategoryId(@PathVariable Long vehicleId,
            @PathVariable Long categoryId) {
        log.info("GET Count By VehicleId And CategoryId vehicle/{}/category/{} - Fetching total count", vehicleId, categoryId);
        return prematureServiceItemService.getTotalPrematureCountByVehicleIdAndCategoryId(vehicleId, categoryId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getOverAllCountForAdmin")
    public ResponseEntity<Integer> getAdminTotalPrematureCountForAllCategories() {
        log.info("GET OverAll Count For Admin - Fetching total count for all categories");
        return prematureServiceItemService.getAdminTotalPrematureCountForAllCategories();
    }

    @GetMapping("/getByVehicleId/{vehicleId}")
    public ResponseEntity<List<PrematureItemResponseDto>> getPrematureByVehicleId(@PathVariable Long vehicleId) {
        log.info("GET By VehicleId/{} - Fetching premature items for vehicle", vehicleId);
        return prematureServiceItemService.getPrematureByVehicleId(vehicleId);
    }

    @GetMapping("/getByUserAndVehicleId/{userId}/{vehicleId}")
    public ResponseEntity<List<PrematureItemResponseDto>> getPrematureItemByUserIdAndVehicleId(@PathVariable Long userId,
            @PathVariable Long vehicleId) {
        log.info("GET By User And VehicleId/{}/vehicle/{} - Fetching premature items", userId, vehicleId);
        return prematureServiceItemService.getPrematureItemByUserIdAndVehicleId(userId, vehicleId);
    }
}
