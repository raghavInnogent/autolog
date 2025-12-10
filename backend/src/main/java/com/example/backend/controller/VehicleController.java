package com.example.backend.controller;


import com.example.backend.dto.request.VehicleRequestDTO;
import com.example.backend.dto.response.VehicleResponseDTO;
import com.example.backend.service.CloudinaryService;
import com.example.backend.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.security.UserPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    @Autowired
    CloudinaryService cloudinaryService;
    @Autowired
    private VehicleService vehicleService;

    @GetMapping("/getAll")
    public ResponseEntity<List<VehicleResponseDTO>> getAll() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(vehicleService.getAll(principal.getId()));
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<VehicleResponseDTO> get(@PathVariable Long id) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(vehicleService.getById(id, principal.getId()));
    }


    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VehicleResponseDTO> create(@RequestPart("file") MultipartFile file,
           @Valid @RequestPart VehicleRequestDTO dto) {
        String img = cloudinaryService.uploadFile(file,"Vehicle");
        dto.setImage(img);
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.status(201).body(vehicleService.create(principal.getId(), dto));
    }

    @PutMapping("/updateById/{id}")
    public ResponseEntity<VehicleResponseDTO> update(@PathVariable Long id, @RequestBody VehicleRequestDTO dto) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(vehicleService.update(id, principal.getId(), dto));
    }

    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        vehicleService.delete(id, principal.getId());
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/getAllVehiclesByOwnerId")
    public ResponseEntity<List<VehicleResponseDTO>> getAllByOwnerId(@RequestParam Long ownerId) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(vehicleService.getAll(principal.getId()));
    }

    @GetMapping("/getVehicleCountByOwnerId")
    public int getVehiclesCountByOwnerId(@RequestParam Long ownerId) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal.getId().equals(ownerId)) return vehicleService.getVehiclesCountByOwnerId(principal.getId());
        else return 0;
    }
}