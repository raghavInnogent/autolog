package com.example.backend.service;

import com.example.backend.dto.request.ServiceCategoriesRequestDTO;
import com.example.backend.dto.response.ServiceCategoriesResponseDTO;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.dto.response.VehicleResponseDTO;
import com.example.backend.entity.ServiceCategories;
import com.example.backend.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public interface AdminService {

    ResponseEntity<List<VehicleResponseDTO>> getVehiclesByOwnerId(@RequestParam Long ownerId);

    ResponseEntity<UserResponseDTO> updateUserStatus(@RequestParam Long userId, @RequestParam String status);
}
