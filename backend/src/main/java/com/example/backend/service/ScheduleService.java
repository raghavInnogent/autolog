package com.example.backend.service;

import com.example.backend.dto.response.ScheduleResponseDTO;
import java.util.List;

public interface ScheduleService {
    List<ScheduleResponseDTO> getUpcomingSchedules(Long userId);
}
