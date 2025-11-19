package com.example.backend.dto.user;

import lombok.Data;
import java.util.List;

import com.example.backend.dto.vehicle.VehicleSummaryDTO;

@Data
public class UserResponseDTO {

    private Long id;

    private String name;

    private String email;

    private Long contactNo;

    private List<VehicleSummaryDTO> vehicles;
}
