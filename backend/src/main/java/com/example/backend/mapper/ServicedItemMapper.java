package com.example.backend.mapper;

import com.example.backend.dto.request.ServicedItemRequestDTO;
import com.example.backend.dto.response.ServicedItemsResponseDTO;
import com.example.backend.entity.ServicedItems;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ServicedItemMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "serviceOptions", ignore = true)
    ServicedItems toEntity(ServicedItemRequestDTO dto);

    @Mapping(source = "serviceOptions.id", target = "serviceOptionsId")
    ServicedItemsResponseDTO toResponseDTO(ServicedItems entity);
}
