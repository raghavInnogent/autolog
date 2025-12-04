package com.example.backend.mapper;

import com.example.backend.dto.request.DocumentRequestDTO;
import com.example.backend.dto.response.DocumentResponseDTO;
import com.example.backend.entity.Document;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface DocumentMapper {

    Document toSummaryDTO(Document entity);

    @Mapping(target="id", ignore = true)
    @Mapping(target="vehicle", ignore = true)
    Document toEntity(DocumentRequestDTO dto);

    @Mapping(source="vehicle.id",target = "vehicleId")
    @Mapping(source="docName",target="docName")
    DocumentResponseDTO toResponseDTO(Document entity);

}