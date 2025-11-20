package com.example.backend.mapper;

import com.example.backend.dto.request.VehicleRequestDTO;
import com.example.backend.dto.response.VehicleResponseDTO;
import com.example.backend.dto.summary.VehicleSummaryDTO;
import com.example.backend.entity.Vehicle;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        uses = {
                ServiceRecordMapper.class
        }
)
public interface VehicleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "documents", ignore = true)
    @Mapping(target = "servicings", ignore = true)
    Vehicle toEntity(VehicleRequestDTO dto);

    VehicleSummaryDTO toSummaryDTO(Vehicle vehicle);

    @Mapping(source = "owner.id", target = "ownerId")
    VehicleResponseDTO toResponseDTO(Vehicle vehicle);

}
