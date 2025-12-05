package com.example.backend.repository;

import com.example.backend.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {

    // Existing methods
    List<Document> findByType(String type);
    List<Document> findAllByVehicleOwnerId(Long userId);
    List<Document> findByExpirationDateBetween(LocalDate today, LocalDate thirtyDaysLater);

    // NEW: Find expired documents (for marking notifications inactive)
    @Query("SELECT d FROM Document d WHERE d.expirationDate < :date")
    List<Document> findExpiredDocuments(@Param("date") LocalDate date);

    // NEW: Find documents by vehicle (for notification enrichment)
    List<Document> findByVehicleId(Long vehicleId);
}