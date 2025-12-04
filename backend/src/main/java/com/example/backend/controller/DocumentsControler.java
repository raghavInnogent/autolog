package com.example.backend.controller;

import com.example.backend.dto.request.DocumentRequestDTO;
import com.example.backend.dto.response.DocumentResponseDTO;
import com.example.backend.service.DocumentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.security.UserPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentsControler {
    @Autowired
    private DocumentService documentService;
    @Autowired
    private  CloudinaryController cloudinaryController;
    @Autowired
    private OcrController ocrController;

    @PostMapping(value = "/uploadDocument", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponseDTO> uploadDocument(
            @RequestPart("file") MultipartFile file,
            @Valid @RequestPart("document") DocumentRequestDTO document) {
    	  ocrController.extract(file);//calling OCR
        String imageAddress = cloudinaryController.uploadFileToCloudinary(file, "documents");
        System.out.println(imageAddress);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(documentService.uploadDocument(document));
    }

    @GetMapping("/getAllDocuments")
    public ResponseEntity<List<DocumentResponseDTO>> getAllDocuments() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(documentService.getAllDocuments(principal.getId()));
    }

    @GetMapping("/getDocumentById/{id}")
    public ResponseEntity<DocumentResponseDTO> getDocumentById(@PathVariable Integer id) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(documentService.getDocumentById(id, principal.getId()));
    }

    @DeleteMapping("/deleteDocumentById/{id}")
    public ResponseEntity<Void> deleteDocumentById(@PathVariable Integer id) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        documentService.deleteById(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/updateDocumentById")
    public ResponseEntity<DocumentResponseDTO> updateDocument(@RequestParam Integer id,
            @RequestBody DocumentRequestDTO document) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(documentService.updateDocument(id, document, principal.getId()));
    }
}
