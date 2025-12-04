package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.response.OcrResponse;
import com.example.backend.service.OcrService;


@Controller
public class OcrController {

    @Autowired
    private OcrService ocrService;

    public ResponseEntity<?> extract(MultipartFile file) {
        try {
            OcrResponse result = ocrService.extractData(file);
            System.out.println(result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("OCR Error: " + e.getMessage());
        }
    }

}