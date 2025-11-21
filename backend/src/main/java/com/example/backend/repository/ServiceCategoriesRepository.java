package com.example.backend.repository;

import com.example.backend.entity.ServiceCategories;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceCategoriesRepository extends JpaRepository<ServiceCategories, Long> {
    ServiceCategories findByItemName(String itemName);
}