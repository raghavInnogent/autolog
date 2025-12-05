package com.example.backend.controller;

import java.util.List;

import com.example.backend.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.ServiceRecordRequestDTO;
import com.example.backend.dto.response.ServiceRecordResponseDTO;
import com.example.backend.service.ServiceRecordService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/servicing")
@RequiredArgsConstructor
public class ServiceRecordController {
	@Autowired
    private ServiceRecordService service;

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
        Long userId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();

        return ResponseEntity.ok(service.getAllByUserId(userId));
    }
}