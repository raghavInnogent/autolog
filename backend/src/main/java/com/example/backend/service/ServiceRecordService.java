package com.example.backend.service;

import com.example.backend.dto.request.ServiceRecordRequestDTO;
import com.example.backend.dto.response.ServiceRecordResponseDTO;

import java.util.List;

public interface ServiceRecordService {

    ServiceRecordResponseDTO create(ServiceRecordRequestDTO dto);

    ServiceRecordResponseDTO getById(Long id);

    List<ServiceRecordResponseDTO> getAll();
}