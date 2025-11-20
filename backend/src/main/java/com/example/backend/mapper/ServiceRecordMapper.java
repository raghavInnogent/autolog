package com.example.backend.mapper;

import com.example.backend.dto.request.ServiceRecordRequestDTO;
import com.example.backend.dto.response.ServiceRecordResponseDTO;
import com.example.backend.dto.summary.ServiceRecordSummaryDTO;
import com.example.backend.entity.ServiceRecord;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        uses = {
                ServicedItemMapper.class
        }
)
public interface ServiceRecordMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    ServiceRecord toEntity(ServiceRecordRequestDTO dto);

    ServiceRecordSummaryDTO toSummaryDTO(ServiceRecord service);

    @Mapping(source = "vehicle.id", target = "vehicleId")
    ServiceRecordResponseDTO toDTO(ServiceRecord service);
}
