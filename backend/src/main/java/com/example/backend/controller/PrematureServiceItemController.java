package com.example.backend.controller;

import com.example.backend.dto.request.PrematureServiceItemRequestDto;
import com.example.backend.dto.response.PrematureItemResponseDto;
import com.example.backend.security.UserPrincipal;
import com.example.backend.service.PrematureServiceItemService;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/premature")
public class PrematureServiceItemController {

    @Autowired
    private PrematureServiceItemService prematureServiceItemService;

    @GetMapping("/getCountByCategory/{categoryId}")
    public ResponseEntity<Integer> getTotalPrematureCountByCategoryId(@PathVariable Long categoryId) {
        log.info("GET /premature/count/category/{} - Fetching total count for category", categoryId);
        Integer count = prematureServiceItemService.getTotalPrematureCountByCategoryId(categoryId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/vehicle/{vehicleId}/category/{categoryId}")
    public ResponseEntity<Integer> getTotalPrematureCountByVehicleIdAndCategoryId(
            @PathVariable Long vehicleId,
            @PathVariable Long categoryId) {
        log.info("GET /premature/count/vehicle/{}/category/{} - Fetching total count", vehicleId, categoryId);
        return ResponseEntity.ok(prematureServiceItemService.getTotalPrematureCountByVehicleIdAndCategoryId(vehicleId, categoryId));
    }

    @GetMapping("/admin/count/all")
    public ResponseEntity<Integer> getAdminTotalPrematureCountForAllCategories() {
        log.info("GET /premature/admin/count/all - Fetching total count for all categories");
        return ResponseEntity.ok(prematureServiceItemService.getAdminTotalPrematureCountForAllCategories());
    }

    @GetMapping("/getByVehicleId/{vehicleId}")
    public ResponseEntity<List<PrematureItemResponseDto>> getPrematureByVehicleId(@PathVariable Long vehicleId) {
        log.info("GET /premature/vehicle/{} - Fetching premature items for vehicle", vehicleId);
        return ResponseEntity.ok(prematureServiceItemService.getPrematureByVehicleId(vehicleId));
    }

    @GetMapping("/user/{userId}/vehicle/{vehicleId}")
    public ResponseEntity<List<PrematureItemResponseDto>> getPrematureItemByUserIdAndVehicleId(
            @PathVariable Long userId,
            @PathVariable Long vehicleId) {
        log.info("GET /premature/user/{}/vehicle/{} - Fetching premature items", userId, vehicleId);
        return ResponseEntity.ok(prematureServiceItemService.getPrematureItemByUserIdAndVehicleId(userId, vehicleId));
    }

    @GetMapping("/getTotalCount")
    public ResponseEntity<Integer> getPrematureItemsCount() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(prematureServiceItemService.getAllPrematureItemsByUserId(principal.getId()).size());

    }
    @GetMapping("/getAllForUser")
    public ResponseEntity<List<PrematureItemResponseDto>> getAllPrematurePerUser() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(prematureServiceItemService.getAllPrematureItemsByUserId(principal.getId()));

    }

}
