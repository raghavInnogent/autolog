package com.example.backend.dao;

import com.example.backend.entity.Document;
import com.example.backend.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentDao {
    @Autowired
    private DocumentRepository documentRepository;

    public List<Document> findAll() {
        return documentRepository.findAll();
    }

    public Optional<Document> findById(Integer id) {
        return documentRepository.findById(id);
    }

    public Document save(Document document) {
        return documentRepository.save(document);
    }

    public Document update(Document document) {
        return documentRepository.save(document);
    }

    public void deleteById(Integer id) {
        documentRepository.deleteById(id);
    }

    public List<Document> findAllByVehicleOwnerId(Long userId) {
        return documentRepository.findAllByVehicleOwnerId(userId);
    }

}
