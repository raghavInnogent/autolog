package com.example.backend.mapper;

import com.example.backend.dto.request.ServicedItemRequestDTO;
import com.example.backend.dto.response.ServicedItemsResponseDTO;
import com.example.backend.entity.ServicedItems;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = { ServiceCategoriesMapper.class } // ⭐ IMPORTANT
)
public interface ServicedItemMapper {


    ServicedItems toEntity(ServicedItemRequestDTO dto);

    ServicedItemsResponseDTO toDTO(ServicedItems servicedItem);
}
