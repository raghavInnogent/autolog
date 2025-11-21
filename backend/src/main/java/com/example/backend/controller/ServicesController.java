package com.example.backend.controller;

import com.example.backend.dto.serviceRecord.ServiceRecordRequestDTO;
import com.example.backend.dto.serviceRecord.ServiceRecordResponseDTO;
import com.example.backend.service.ServiceRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/services")
public class ServicesController {
    @Autowired private ServiceRecordService serviceRecordService;

 
}