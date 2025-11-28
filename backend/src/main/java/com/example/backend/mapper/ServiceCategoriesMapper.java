package com.example.backend.mapper;

import com.example.backend.dto.request.ServiceCategoriesRequestDTO;
import com.example.backend.dto.response.ServiceCategoriesResponseDTO;
import com.example.backend.entity.ServiceCategories;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.time.Period;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ServiceCategoriesMapper {

    @Mapping(target = "id", ignore = true)
    ServiceCategories  toEntity(ServiceCategoriesRequestDTO dto);

    ServiceCategoriesResponseDTO toResponseDTO(ServiceCategories serviceCategories);

    default Period map(Integer months) {
        return months != null ? Period.ofMonths(months) : null;
    }

    default Integer map(Period period) {
        return period != null ? period.getMonths() : null;
    }

}
