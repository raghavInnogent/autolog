package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.response.ScheduleResponseDTO;
import com.example.backend.security.UserPrincipal;
import com.example.backend.service.ScheduleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/schedules")
@RequiredArgsConstructor
public class ScheduleController {
	
	@Autowired
    private ScheduleService scheduleService;

    @GetMapping("/upcoming")
    public ResponseEntity<List<ScheduleResponseDTO>> getUpcoming() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(scheduleService.getUpcomingSchedules(principal.getId()));
    }
}
