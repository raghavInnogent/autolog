package com.example.backend.service;

import com.example.backend.dto.request.DocumentRequestDTO;
import com.example.backend.dto.response.DocumentResponseDTO;

import java.util.List;

public interface DocumentService {
    DocumentResponseDTO uploadDocument(DocumentRequestDTO document);

    List<DocumentResponseDTO> getAllDocuments(Long userId);

    DocumentResponseDTO getDocumentById(Integer id, Long userId);

    DocumentResponseDTO deleteById(Integer id, Long userId);

    DocumentResponseDTO updateDocument(Integer id, DocumentRequestDTO document, Long userId);
}
