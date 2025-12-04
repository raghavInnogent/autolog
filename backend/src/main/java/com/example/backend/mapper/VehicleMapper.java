package com.example.backend.mapper;

import com.example.backend.dto.request.VehicleRequestDTO;
import com.example.backend.dto.response.VehicleResponseDTO;
import com.example.backend.dto.summary.VehicleSummaryDTO;
import com.example.backend.entity.Vehicle;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {
                ServiceRecordMapper.class,
                DocumentMapper.class
        }
)
public interface VehicleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "documents", expression = "java(new java.util.ArrayList<>())")
    Vehicle toEntity(VehicleRequestDTO dto);

    VehicleSummaryDTO toSummaryDTO(Vehicle vehicle);

    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "documents", target = "documents")
    VehicleResponseDTO toResponseDTO(Vehicle vehicle);
}