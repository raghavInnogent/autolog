package com.example.backend.mapper;

import com.example.backend.dto.request.ServiceRecordRequestDTO;
import com.example.backend.dto.response.ServiceRecordResponseDTO;
import com.example.backend.dto.summary.ServiceRecordSummaryDTO;
import com.example.backend.entity.ServiceRecord;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ServiceRecordMapper {

    ServiceRecord toEntity(ServiceRecordRequestDTO dto);

    ServiceRecordResponseDTO toDTO(ServiceRecord entity);

    ServiceRecordSummaryDTO toSummaryDTO(ServiceRecord entity);
}
