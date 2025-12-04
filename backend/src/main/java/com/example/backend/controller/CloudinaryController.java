package com.example.backend.controller;

import com.example.backend.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class CloudinaryController {
    @Autowired
    private CloudinaryService cloudinaryService;

    public String uploadFileToCloudinary(MultipartFile file, String folderName) {
        return cloudinaryService.uploadFile(file, folderName);
    }

}
