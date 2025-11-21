package com.example.backend.mapper;

import com.example.backend.dto.vehicle.VehicleRequestDTO;
import com.example.backend.dto.vehicle.VehicleResponseDTO;
import com.example.backend.dto.vehicle.VehicleSummaryDTO;
import com.example.backend.entity.Vehicle;

public class VehicleMapper {

    public static Vehicle toEntity(VehicleRequestDTO dto, Vehicle v) {

        v.setRegistrationNumber(dto.getRegistrationNumber());
        v.setModel(dto.getModel());
        v.setCompany(dto.getCompany());
        v.setDescription(dto.getDescription());
        v.setType(dto.getType());
        v.setPurchaseDate(dto.getPurchaseDate());
        v.setImage(dto.getImage());
        return v;
    }

    public static VehicleResponseDTO toResponse(Vehicle v) {
        VehicleResponseDTO dto = new VehicleResponseDTO();
        dto.setId(v.getId());
        dto.setOwnerId(v.getOwner() != null ? v.getOwner().getId() : null);
        dto.setRegistrationNumber(v.getRegistrationNumber());
        dto.setModel(v.getModel());
        dto.setCompany(v.getCompany());
        dto.setDescription(v.getDescription());
        dto.setType(v.getType());
        dto.setPurchaseDate(v.getPurchaseDate());
        dto.setImage(v.getImage());
        return dto;
    }

    public static VehicleSummaryDTO toSummary(Vehicle v) {
        return new VehicleSummaryDTO(
                v.getId(),
                v.getCompany(),
                v.getModel(),
                v.getRegistrationNumber()
        );
    }
}