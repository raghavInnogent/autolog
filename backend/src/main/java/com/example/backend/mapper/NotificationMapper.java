package com.example.backend.mapper;

import com.example.backend.dto.response.NotificationDetailDTO;
import com.example.backend.dto.response.NotificationResponseDTO;
import com.example.backend.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {

    NotificationResponseDTO toResponseDTO(Notification notification);

    NotificationDetailDTO toDetailDTO(Notification notification);

    Notification toEntity(NotificationResponseDTO dto);
}