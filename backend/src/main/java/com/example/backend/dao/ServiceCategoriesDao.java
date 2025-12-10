package com.example.backend.dao;

import com.example.backend.entity.ServiceCategories;
import com.example.backend.repository.ServiceCategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ServiceCategoriesDao {

    @Autowired
    ServiceCategoriesRepository serviceCategoriesRepository;

    public ServiceCategories save(ServiceCategories serviceCategory) {
        return serviceCategoriesRepository.save(serviceCategory);
    }

    public boolean existsByName(String name) {

        return serviceCategoriesRepository.existsByName(name);
    }

    public ServiceCategories findById(Long id) {
        return serviceCategoriesRepository.findById(id).get();
    }

    public List<ServiceCategories> findAll() {

        return serviceCategoriesRepository.findAll();
    }

    public boolean existsById(Long id) {
        return serviceCategoriesRepository.existsById(id);
    }

    public void deleteById(Long id) {
        serviceCategoriesRepository.deleteById(id);
    }

    public ServiceCategories  findByName(String name) {
        return serviceCategoriesRepository.findByName(name);
    }
}
