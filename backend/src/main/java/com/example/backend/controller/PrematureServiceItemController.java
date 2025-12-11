package com.example.backend.controller;

import com.example.backend.dto.request.PrematureServiceItemRequestDto;
import com.example.backend.dto.response.PrematureItemResponseDto;
import com.example.backend.security.UserPrincipal;
import com.example.backend.service.PrematureServiceItemService;
import lombok.extern.slf4j.Slf4j;
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

    @PostMapping("/save")
    public ResponseEntity<PrematureItemResponseDto> savePrematureItem(
            @RequestBody PrematureServiceItemRequestDto itemDto) {
        log.info("POST /premature/save - Creating new premature item");
        return prematureServiceItemService.savePrematureItem(itemDto);
    }

    @PutMapping("/updateById/{id}")
    public ResponseEntity<PrematureItemResponseDto> updatePrematureItem(
            @RequestBody PrematureServiceItemRequestDto itemDto) {
        log.info("PUT /premature/updateById/{} - Updating premature item", itemDto.getCategoryId());
        return prematureServiceItemService.updatePrematureItem(itemDto);
    }

    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<Void> deletePrematureItem(@PathVariable Long id) {
        log.info("DELETE /premature/deleteById/{} - Deleting premature item", id);
        return prematureServiceItemService.deletePrematureItem(id);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<PrematureItemResponseDto>> getAllPrematureItems() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("GET /premature/getAll - Fetching all premature items for userId: {}", principal.getId());
        return prematureServiceItemService.getAllPrematureItemsByUserId(principal.getId());
    }

    @GetMapping("/count/category/{categoryId}")
    public ResponseEntity<Integer> getTotalPrematureCountByCategoryId(@PathVariable Long categoryId) {
        log.info("GET /premature/count/category/{} - Fetching total count for category", categoryId);
        return prematureServiceItemService.getTotalPrematureCountByCategoryId(categoryId);
    }

    @GetMapping("/count/vehicle/{vehicleId}/category/{categoryId}")
    public ResponseEntity<Integer> getTotalPrematureCountByVehicleIdAndCategoryId(
            @PathVariable Long vehicleId,
            @PathVariable Long categoryId) {
        log.info("GET /premature/count/vehicle/{}/category/{} - Fetching total count", vehicleId, categoryId);
        return prematureServiceItemService.getTotalPrematureCountByVehicleIdAndCategoryId(vehicleId, categoryId);
    }

    @GetMapping("/admin/count/all")
    public ResponseEntity<Integer> getAdminTotalPrematureCountForAllCategories() {
        log.info("GET /premature/admin/count/all - Fetching total count for all categories");
        return prematureServiceItemService.getAdminTotalPrematureCountForAllCategories();
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<PrematureItemResponseDto>> getPrematureByVehicleId(@PathVariable Long vehicleId) {
        log.info("GET /premature/vehicle/{} - Fetching premature items for vehicle", vehicleId);
        return prematureServiceItemService.getPrematureByVehicleId(vehicleId);
    }

    @GetMapping("/user/{userId}/vehicle/{vehicleId}")
    public ResponseEntity<List<PrematureItemResponseDto>> getPrematureItemByUserIdAndVehicleId(
            @PathVariable Long userId,
            @PathVariable Long vehicleId) {
        log.info("GET /premature/user/{}/vehicle/{} - Fetching premature items", userId, vehicleId);
        return prematureServiceItemService.getPrematureItemByUserIdAndVehicleId(userId, vehicleId);
    }
}
