package com.example.backend.dao;

import com.example.backend.entity.Vehicle;
import com.example.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class VehicleDao {

    @Autowired
    private VehicleRepository vehicleRepository;

    public Vehicle save(Vehicle v) {
    	return vehicleRepository.save(v); 
    	}
    
    public Optional<Vehicle> findById(Long id) {
    	return vehicleRepository.findById(id);
    	}
    
    public List<Vehicle> findAll() { 
    	return vehicleRepository.findAll(); 
    	}
    
    public void delete(Vehicle v) { 
    	vehicleRepository.delete(v); 
    	}
    
    public List<Vehicle> findByOwnerId(Long ownerId) {
    	return vehicleRepository.findByOwnerId(ownerId);
    	}
    
    public Optional<Vehicle> findByRegistrationNumber(String registrationNumber) {
    	return vehicleRepository.findByRegistrationNumber(registrationNumber); 
    	}
}