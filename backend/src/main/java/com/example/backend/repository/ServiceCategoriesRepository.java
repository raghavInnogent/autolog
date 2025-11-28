package com.example.backend.repository;

import com.example.backend.entity.ServiceCategories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceCategoriesRepository extends JpaRepository<ServiceCategories, Long> {
    boolean existsByName(String name);
}