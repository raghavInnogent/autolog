package com.example.backend.serviceImpl;

import com.example.backend.dao.DocumentDao;
import com.example.backend.dao.VehicleDao;
import com.example.backend.dto.request.DocumentRequestDTO;
import com.example.backend.dto.response.DocumentResponseDTO;
import com.example.backend.entity.Document;
import com.example.backend.mapper.DocumentMapper;
import com.example.backend.service.DocumentService;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.AccessDeniedException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class DocumentServiceImpl implements DocumentService {
        @Autowired
        private DocumentDao documentDao;
        @Autowired
        private DocumentMapper documentMapper;
        @Autowired
        private VehicleDao vehicleDao;

        @Override
        public DocumentResponseDTO uploadDocument(DocumentRequestDTO document) {
                document.setVehicleId(
                                vehicleDao.findByRegistrationNumber(document.getRegistrationNumber()).get().getId());
                Document originalDocument = documentMapper.toEntity(document);
                originalDocument.setVehicle(vehicleDao.findById(document.getVehicleId()).get());
                return documentMapper.toResponseDTO(documentDao.save(originalDocument));
        }

        @Override
        public List<DocumentResponseDTO> getAllDocuments(Long userId) {
                return documentDao.findAllByVehicleOwnerId(userId).stream()
                                .map(document -> documentMapper.toResponseDTO(document)).toList();
        }

        @Override
        public DocumentResponseDTO getDocumentById(Integer id, Long userId) {
                Document document = documentDao.findById(id).orElseThrow(
                                () -> new ResourceNotFoundException("Document not found"));

                if (!document.getVehicle().getOwner().getId().equals(userId)) {
                        throw new AccessDeniedException("You do not have permission to access this document");
                }

                return documentMapper.toResponseDTO(document);
        }

        @Override
        public DocumentResponseDTO deleteById(Integer id, Long userId) {
                Document document = documentDao.findById(id).orElseThrow(
                                () -> new ResourceNotFoundException("Document not found"));

                if (!document.getVehicle().getOwner().getId().equals(userId)) {
                        throw new AccessDeniedException("You do not have permission to delete this document");
                }

                DocumentResponseDTO documentResponseDTO = documentMapper.toResponseDTO(document);
                documentDao.deleteById(id);
                return documentResponseDTO;
        }

        @Override
        public DocumentResponseDTO updateDocument(Integer id, DocumentRequestDTO documentDto, Long userId) {
                Document existingDocument = documentDao.findById(id).orElseThrow(
                                () -> new ResourceNotFoundException("Document not found"));

                if (!existingDocument.getVehicle().getOwner().getId().equals(userId)) {
                        throw new AccessDeniedException("You do not have permission to update this document");
                }

                Document newDocument = documentMapper.toEntity(documentDto);
                newDocument.setId(id);
                documentDao.save(newDocument);
                return documentMapper.toResponseDTO(newDocument);
        }
}