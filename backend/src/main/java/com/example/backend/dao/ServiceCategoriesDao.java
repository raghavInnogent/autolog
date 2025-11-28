package com.example.backend.dao;

import com.example.backend.entity.ServiceCategories;
import com.example.backend.repository.ServiceCategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class ServiceCategoriesDao {

    @Autowired
    ServiceCategoriesRepository serviceCategoriesRepository;

    public ServiceCategories save(ServiceCategories serviceCategory)
    {
        return  serviceCategoriesRepository.save(serviceCategory);
    }

    public boolean existsByName(String name)
    {
        return serviceCategoriesRepository.existsByName(name);
    }

    public ServiceCategories findById(Long id) {
        return serviceCategoriesRepository.findById(id).get();
    }
}
