package com.example.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.OcrResponse;

@Service
public interface OcrService {
    OcrResponse extractData(MultipartFile file) throws Exception;
}
