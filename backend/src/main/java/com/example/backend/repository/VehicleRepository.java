package com.example.backend.repository;

import com.example.backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByOwnerId(Long ownerId);
    java.util.Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
}