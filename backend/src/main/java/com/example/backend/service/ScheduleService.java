package com.example.backend.service;

import com.example.backend.dto.response.ScheduleResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface ScheduleService {
    List<ScheduleResponseDTO> getUpcomingSchedules(Long userId);
}
