package com.example.backend.controller;

import com.example.backend.dto.response.NotificationCountDTO;
import com.example.backend.dto.response.NotificationDetailDTO;
import com.example.backend.dto.response.NotificationResponseDTO;
import com.example.backend.enums.NotificationPriority;
import com.example.backend.enums.NotificationStatus;
import com.example.backend.enums.ReadStatus;
import com.example.backend.security.UserPrincipal;
import com.example.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("getAllNotifications")
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotifications(
            Authentication authentication,
            @RequestParam(required = false) NotificationStatus status,
            @RequestParam(required = false) ReadStatus readStatus,
            @RequestParam(required = false) NotificationPriority priority
    ) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        List<NotificationResponseDTO> notifications = notificationService.getAllByUser(
                userId, status, readStatus, priority);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/getNotificationById/{id}")
    public ResponseEntity<NotificationDetailDTO> getNotificationById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        NotificationDetailDTO notification = notificationService.getById(id, userId);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/getNotificationCounts")
    public ResponseEntity<NotificationCountDTO> getNotificationCounts(Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        NotificationCountDTO counts = notificationService.getCounts(userId);
        return ResponseEntity.ok(counts);
    }

    @GetMapping("/getNotificationsByVehicle/{vehicleId}")
    public ResponseEntity<List<NotificationResponseDTO>> getNotificationsByVehicle(
            @PathVariable Long vehicleId,
            Authentication authentication
    ) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        List<NotificationResponseDTO> notifications = notificationService.getByVehicle(vehicleId, userId);
        return ResponseEntity.ok(notifications);
    }


    @PatchMapping("/markNotificationAsRead/{id}")
    public ResponseEntity<Void> markNotificationAsRead(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/markAllRead")
    public ResponseEntity<Void> markAllNotificationsAsRead(Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
}