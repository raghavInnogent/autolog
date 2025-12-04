package com.example.backend.mapper;

import com.example.backend.dto.request.ServiceRecordRequestDTO;
import com.example.backend.dto.request.ServicedItemRequestDTO;
import com.example.backend.dto.response.ServiceRecordResponseDTO;
import com.example.backend.dto.response.ServicedItemResponseDTO;
import com.example.backend.entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ServiceRecordMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "servicedItems", source = "servicedItems")
    ServiceRecord toEntity(ServiceRecordRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "expirationDate", ignore = true)
    @Mapping(target = "serviceCategoryId", source = "serviceCategoryId")
    ServicedItems toServicedItemEntity(ServicedItemRequestDTO dto);

    @Mapping(target = "vehicleId", source = "vehicle.id")
    ServiceRecordResponseDTO toResponseDTO(ServiceRecord entity);

    @Mapping(target = "serviceCategoryId", source = "serviceCategoryId")
    ServicedItemResponseDTO toServicedItemResponseDTO(ServicedItems entity);
}