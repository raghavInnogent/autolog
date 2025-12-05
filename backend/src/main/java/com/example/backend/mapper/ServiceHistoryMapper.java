package com.example.backend.mapper;

import com.example.backend.dto.response.ServiceHistoryResponseDTO;
import com.example.backend.entity.ServiceHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ServiceHistoryMapper {

    @Mapping(target = "serviceCategoryName", ignore = true)
    ServiceHistoryResponseDTO toResponseDTO(ServiceHistory serviceHistory);

    ServiceHistory toEntity(ServiceHistoryResponseDTO dto);
}