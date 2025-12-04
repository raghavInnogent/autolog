package com.example.backend.repository;

import com.example.backend.entity.ServicedItems;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ServicedItemsRepository extends JpaRepository<ServicedItems, Long> {
    List<ServicedItems> findByExpirationDateBetween(LocalDate from, LocalDate to);
}
