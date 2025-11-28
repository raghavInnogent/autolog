package com.example.backend.controller;

import com.example.backend.dto.request.ServiceRecordRequestDTO;
import com.example.backend.dto.response.ServiceRecordResponseDTO;
import com.example.backend.service.ServiceRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servicing")
@RequiredArgsConstructor
public class ServiceRecordController {

    private final ServiceRecordService service;

    @PostMapping("/create")
    public ResponseEntity<ServiceRecordResponseDTO> create(@RequestBody ServiceRecordRequestDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ServiceRecordResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ServiceRecordResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
