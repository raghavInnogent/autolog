package com.example.backend.repository;

import com.example.backend.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Integer> {
    List<Document> findByType(String type);

    List<Document> findAllByVehicleOwnerId(Long userId);

    List<Document> findByExpirationDateBetween(LocalDate today, LocalDate thirtyDaysLater);
}