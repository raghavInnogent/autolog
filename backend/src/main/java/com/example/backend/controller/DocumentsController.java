package com.example.backend.controller;

import com.example.backend.dto.document.DocumentRequestDTO;
import com.example.backend.dto.document.DocumentResponseDTO;
import com.example.backend.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentsController {
    @Autowired private DocumentService documentService;

}