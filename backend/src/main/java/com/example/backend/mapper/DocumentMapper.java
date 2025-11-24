package com.example.backend.mapper;

import com.example.backend.dto.summary.DocumentSummaryDTO;
import com.example.backend.entity.Document;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface DocumentMapper {

    DocumentSummaryDTO toSummaryDTO(Document entity);
}
