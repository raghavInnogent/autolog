package com.example.backend.serviceImpl;

import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.dto.response.VehicleResponseDTO;
import com.example.backend.service.AdminService;
import com.example.backend.service.UserService;
import com.example.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {
    @Autowired
    UserService userService;
    @Autowired
    VehicleService vehicleService;

    @Override
    public ResponseEntity<List<VehicleResponseDTO>> getVehiclesByOwnerId(Long ownerId) {
        List<VehicleResponseDTO> vehicleResponseDTOList = vehicleService.getAll(ownerId);
        return ResponseEntity.ok().body(vehicleResponseDTOList);
    }

    @Override
    public ResponseEntity<UserResponseDTO> updateUserStatus(Long userId, String status) {
        return ResponseEntity.ok(userService.updateStatus(userId, status));
    }
}
