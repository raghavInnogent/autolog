package com.example.backend.mapper;

import com.example.backend.dto.request.PrematureServiceItemRequestDto;
import com.example.backend.dto.response.PrematureItemResponseDto;
import com.example.backend.entity.PrematureServiceItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface PrematureServiceItemMapper {

    @Mapping(target = "id", ignore = true)
    PrematureServiceItem toEntity(PrematureServiceItemRequestDto dto);

    @Mapping(target = "vehicleName", source = "vehicleName")
    @Mapping(target = "categoryName", source = "categoryName")
    @Mapping(target = "prematureCount", expression = "java((long) entity.getPrematureCount())")
    PrematureItemResponseDto toResponseDTO(PrematureServiceItem entity, String vehicleName, String categoryName);
}
